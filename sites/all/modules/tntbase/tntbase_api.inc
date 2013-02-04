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
		$form['actions']['commit'] = array(
				'#type' => "submit",
				'#value' => "Save & Commit",
				'#weight' => 11,
				'#submit' => array("tntbase_node_commit"),
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
				tntbase_normalize_path($node->tnt_path);
				$content = tntbase_get_document("/".$node->tnt_path);
				$node->body[$language][0]["value"] = $content["Body"];
				$node->tnt_rev = $content["Revision"];
				node_save($node);				
			}
		}		
	}
}

function tntbase_node_load_or_import($tnt_path, $content_type="article", $body_field="body", $type="latex") {
	$nid = tntbase_node_getNodeFromPath($tnt_path);
	if ($nid) {
		return $nid;
	} else {
		return tntbase_node_import($tnt_path, $content_type, $body_field, $type);
	}
}

function tntbase_node_import($tnt_path, $content_type="article", $body_field="body", $type="latex") {
	tntbase_normalize_path($tnt_path);
	$doc = tntbase_get_document("/".$tnt_path);
	$body_text = $doc["Body"];
	$node = array();
	$node["type"] = $content_type;
	
	try {
		$p = simplexml_load_string($doc["TitleXHTML"]);
		$doc["TitleXHTML"] = $p->{0};
	} catch (Exception $e) {
	}
	
	if ($doc["TitleXHTML"]>=255) {
		$doc["TitleXHTML"] = substr($doc["TitleXHTML"], 0, 254);
	}
	
	$node["title"]    = $doc["TitleXHTML"];
	$node["language"] = LANGUAGE_NONE;
	$node["tnt_path"] = $doc["Path"];
	$node["tnt_rev"] = $doc["Revision"];
		
	$node[$body_field]=array();
	$node[$body_field][$node["language"]]=array();
	$node[$body_field][$node["language"]][0]=array();
	if ($type=="latex") {
		$node[$body_field][$node["language"]][0]['value']   = $body_text;
		$node[$body_field][$node["language"]][0]['document']   = $body_text;
		$node[$body_field][$node["language"]][0]['format']  = 'latex';
	} else {
		$node[$body_field][$node["language"]][0]['value']   = $doc["BodyXHTML"];
		$node[$body_field][$node["language"]][0]['document'] = $doc["BodyXHTML"];
		$node[$body_field][$node["language"]][0]['format']  = 'full_html';
	}	
	$node = (object) $node;
	node_object_prepare($node);
	
	node_save($node);
	return $node->nid;	
}

function tntbase_node_insert($node) {
	if (strlen($node->tnt_path)==0)
		return;
	if (!is_numeric($node->tnt_rev)) {
		$node->tnt_rev = 0;
	}
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


/*
 * makes sure there is no leading '/' in front
 */ 
function tntbase_normalize_path(&$tnt_path) {
	if (strlen($tnt_path)>0 && $tnt_path[0]=='/')
		$tnt_path = substr($tnt_path, 1);
	return $tnt_path;
}

function tntbase_node_getNodeFromPath($tnt_path) {
	tntbase_normalize_path($tnt_path);
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


function tntbase_node_commit($form, &$form_state) {
	$node = (array)node_form_submit_build_node($form, $form_state);
	$nid = $node["nid"];
	$original = (array) node_load($nid);
	
	$path = db_select('tntbase_url', 'e')
		->fields('e', array(
		'tnt_path',
		'tnt_rev',
	))
	->where('e.nid = (:nid)', array(':nid' => $node["nid"]))
		->execute()->fetchField();
	if ($path) {
	// node has been rated before.
		db_update('tntbase_url')
			->fields(array('tnt_path' => $node["tnt_path"],
						   'tnt_rev' => $node["tnt_rev"]))
			->condition('nid', $node["nid"])
			->execute();
		
    }
	else {
		// Node was not previously rated, so insert a new rating in database.
		tntbase_node_insert($node);
	}
	$language = $node["language"];

	if (isset($node["body"])) {
		$fldName = "body";
		$valName = "value";
	} else
	if (isset($node["field_latex"])) {
		$fldName = "field_latex";
		$valName = "document";
	} else {
		dpm("TNTBase: don't know what field to commit");
		return;
	}

	if (strlen($node["tnt_path"])>0 && $node[$fldName][$language][0][$valName]!=$original[$fldName][$language][0][$valName]) {
		$new_rev = tntbase_commit_file($node[$fldName][$language][0][$valName], $node["tnt_path"]);
		db_update('tntbase_url')
			->fields(array('tnt_path' => $node["tnt_path"],
						   'tnt_rev' => $new_rev))
			->condition('nid', $node["nid"])
			->execute();
	}
	node_form_submit($form, $form_state);
}
?>