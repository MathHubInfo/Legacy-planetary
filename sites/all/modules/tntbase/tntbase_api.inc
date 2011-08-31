<?php 
function tntbase_form_alter(&$form, $form_state, $form_id) {
	if (isset($form['type']) && isset($form['#node']) && $form['type']['#value'] . '_node_form' == $form_id) {
		// If the rating is enabled for this node type, we insert our control
		// into the form.
		$node = $form['#node'];
		$form['tntbase'] = array(
		   		'#type' => 'fieldset',
		   		'#title' => t('TNTBase settings'),
		   		'#collapsible' => TRUE,
		   		'#collapsed' => TRUE,
		   		'#group' => 'additional_settings',
		   		'#weight' => -1,
		);
		
		$form['tntbase']['tnt_path'] = array(
		    	'#type' => 'textfield',
		    	'#title' => t('TNTBase path'),
		    	'#description' => t('Path from the TNTBase repository'),
		    	'#default_value' => isset($node->tnt_path) ? $node->tnt_path : ''
		);
		$form['tntbase']['tnt_rev'] = array(
		    	'#type' => 'textfield',
		    	'#title' => t('TNTBase revision'),
		    	'#description' => t('Revision of the file'),
		    	'#default_value' => isset($node->tnt_rev) ? $node->tnt_rev : ''
		);
	}
}

function tntbase_node_load($nodes, $form) {
	foreach ($nodes as $node) {
		$nids[] = $node->nid;
	}
	// Check if we should load rating for any of the nodes
	if (!isset($nids) || !count($nids)) {
		return;
	}

	$result = db_select('tntbase_url', 'e')
	->fields('e', array(
        'nid',
        'tnt_path',
        'tnt_rev',
	))
	->where('e.nid IN (:nids)', array(':nids' => $nids))
	->execute();

	foreach ($result as $record) {
		$nodes[$record->nid]->tnt_path = $record->tnt_path;
		$nodes[$record->nid]->tnt_rev = $record->tnt_rev;
	} 
}

function tntbase_sync_nodes($nids) {
	foreach(node_load_multiple($nids) as $node) {
		if (strlen($node->tnt_path)>0) {
			$rev = tntbase_get_revisions($node->tnt_path);
			if ($node->tnt_rev != $rev) {
				$language = $node->language;
				$content = tntbase_get_document($node->tnt_path);
				$node->body[$language][0]["value"] = $content["Body"];
				$node->tnt_rev = $content["Revision"];
				node_save($node);				
			}
		}		
	}
}

function tntbase_node_load_or_import($tnt_path) {
	$nid = tntbase_node_getNodeFromPath($tnt_path);
	if ($nid) {
		return $nid;
	} else {
		return tntbase_node_import($tnt_path);
	}
}

function tntbase_node_import($tnt_path) {
	$doc = tntbase_get_document($path);
	$body_text = $doc["Body"];
	
	$node = new stdClass();
	$node->type = 'article';
	node_object_prepare($node);
	
	$node->title    = $doc["TitleXHTML"];
	$node->language = LANGUAGE_NONE;
	$node->tnt_path = $doc["Path"];
	$node->tnt_rev = $doc["Revision"];
	
	$node->body[$node->language][0]['value']   = $body_text;
	$node->body[$node->language][0]['format']  = 'latex';
	
	node_save($node);
	return $node->id;	
}

function tntbase_node_insert($node) {
	db_insert('tntbase_url')
	->fields(array(
	    'nid' => $node->nid,
        'tnt_path' => $node->tnt_path,
        'tnt_rev' => $node->tnt_rev,
	))
		->execute();
}

function tntbase_node_delete($node) {
	// Notice that we're deleting even if the content type has no rating enabled.
	db_delete('tntbase_url')
	->condition('nid', $node->nid)
	->execute();
}

function tntbase_node_getNodeFromPath($tnt_path) {
	$nid = db_select('tntbase_url', 'e')
	->fields('e', array(
			'nid',
	))
	->where('e.tnt_path = (:tnt_path)', array(':tnt_path' => $tnt_path))
	->execute()->fetchField();
	if ($nid) {
		return $nid;
	} 
}


function tntbase_node_update($node) {
	// If may happen that this node does not have a previous saved rating
	// value, so we can't just update it, we need to check first if this
	$path = db_select('tntbase_url', 'e')
		->fields('e', array(
		'tnt_path',
		'tnt_rev',
	))
	->where('e.nid = (:nid)', array(':nid' => $node->nid))
		->execute()->fetchField();

	if ($path) {
	// node has been rated before.
		db_update('tntbase_url')
			->fields(array('tnt_path' => $node->tnt_path,
						   'tnt_rev' => $node->tnt_rev))
			->condition('nid', $node->nid)
			->execute();
		
    }
	else {
		// Node was not previously rated, so insert a new rating in database.
		tntbase_node_insert($node);
	}
	$language = $node->language;
	$original = $node->original;
	if (strlen($node->tnt_path)>0 && $node->body[$language][0]["value"]!=$original->body[$language][0]["value"]) {
		tntbase_commit_xml($node->body[$language][0]["value"], $node->tnt_path);
	}
}
?>