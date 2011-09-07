<?php
//
require_once('../../../../../../../wp-config.php');
require_once('../../../../../../../wp-admin/includes/image.php');
//
include_once('../../../../connectors/php/AbstractSFB.php');
class SFBWpDb extends AbstractSFB {
	
	protected $sConnBse = "../../../../";
	protected $aValidate = array(
		  "inDB"=>	array(0,3,0)
		 ,"remDB"=>	array(0,3,0)
		 ,"addDB"=>	array(0,3,0)
	);
	
	// WpDb
	function __construct() {
		//
//		require_once($this->sConnBse."../../../wp-config.php");
//		require_once($this->sConnBse."../../../wp-admin/includes/image.php");
		//
		parent::__construct();
		//
		global $wpdb, $json; // $current_site;
		//
		$sSFBpath = get_option('siteurl').'/wp-content/plugins/sfbrowser/';
		//
		//
		switch ($this->sAction) {
			case "inDB": // inDB
				//
				$aDB = array();
				$result = $wpdb->get_results("SELECT ID,guid FROM ".$wpdb->posts." where post_type='attachment'");
				foreach($result as $rs) $aDB[$rs->ID] = $rs->guid;
				//
				$sFolder = $_POST["folder"];
				$sFiles = stripslashes($_POST['files']);
				$aFiles = (array) json_decode($sFiles);
				//
//				dump($aDB); // TRACE ### $aFiles
//				dump($aFiles); // TRACE ### $aFiles
				$aData = array();
				foreach($aFiles as $key=>$filename) {
					$sRelFile = $this->clean_uri('wp-admin/'.SFB_PATH.$sFolder.$filename);
					$sFile = $this->clean_uri($sSFBpath.$sFolder.$filename);
//					echo $sRelFile."\n";
//					echo $sFile."\n";
					$RID = array_search($sRelFile,$aDB);	// relative file
					$AID = array_search($sFile,$aDB);		// absolute file
					if ($AID!==false||$RID!==false) {
						$ID = $AID!==false?$AID:$RID;
						$aData[$filename] = $ID;
						//
						$aMeta = get_post_meta($ID,'_wp_attachment_metadata');
						if (isset($aMeta[0]['sizes'])) {
							$aSizes = $aMeta[0]['sizes'];
							foreach($aSizes as $size=>$data) {
								if (array_search($data['file'],$aFiles)!==false) $aData[$data['file']] = $ID;
							}
						}
					}
				}
				$this->aReturn['data'] = $aData;
			break;
			case "remDB": // remDB
				$sID = $_POST["id"];
				//
				// first find all linked files to return
				$aFiles = array(array_pop(explode('/',get_attached_file($sID))));
				//
				$aMeta = wp_get_attachment_metadata($sID);
				if (isset($aMeta['sizes'])) {
					foreach($aMeta['sizes'] as $aSize) {
						$aFiles[] = $aSize['file'];
					}
				}
				// then delete the references from the two tables
				$sSql = "DELETE a, b FROM ".$wpdb->posts." AS a, ".$wpdb->postmeta." AS b WHERE a.ID=".$sID." AND b.post_id=".$sID;
				if ($wpdb->query($sSql)===false) $this->aReturn['error'] = "There was an error deleting the database references.";
				$this->aReturn['data'] = $aFiles;
			break;
			case "addDB": // addDB
				// do as in media.php::media_handle_upload
				$aData = array();
				$sFolder = $_POST['folder'];
				$sFile = $_POST['file'];
				$sTitle = array_shift(explode('.',$sFile));
				$aFileType = wp_check_filetype($this->sSFile);
				//$sStoreFile = clean_uri('wp-admin/'.SFB_PATH.$sFolder.$sFile);
				$sStoreFile = $this->clean_uri((get_option('sfbrowser_relativePath')=='on'?'':get_option('siteurl')).'/wp-admin/'.SFB_PATH.$sFolder.$sFile);
				$sContent = '';
				//
				// media.php ln 209 :: // use image exif/iptc data for title and caption defaults if possible
				if ( $image_meta = wp_read_image_metadata($this->sSFile) ) {
					if ( trim( $image_meta['title'] ) && ! is_numeric( sanitize_title( $image_meta['title'] ) ) )
						$sTitle = $image_meta['title'];
					if ( trim( $image_meta['caption'] ) )
						$sContent = $image_meta['caption'];
				}
				$attachment = array(
					 'post_author'=>	$user_ID
					,'post_title'=>		$sTitle
					,'post_status'=>	'inherit'
					,'post_name'=>		strToLower($sTitle)
					,'guid'=>			$sStoreFile
					,'post_type'=>		'attachment'
					,'post_mime_type'=>	$aFileType['type']
					,'post_content' =>	$sContent
				);
				// media.php ln 226 :: //  Save the data
				$id = wp_insert_attachment($attachment, $sStoreFile, 0);
				$aData['postid'] = $id;

				if ( !is_wp_error($id) ) {
					wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $this->sSFile ) );
					
					$aMeta = wp_get_attachment_metadata($id);
					$aFiles = array();
					if (isset($aMeta['sizes'])) {
						$aBase = explode('/',$this->sSFile);
						array_pop($aBase);
						$sBase = implode('/',$aBase);
						foreach($aMeta['sizes'] as $aSize) {
							$aFiles[] = $this->fileInfo($sBase.'/'.$aSize['file']);
						}
					}
					$aData['files'] = $aFiles;
				} else {
					$this->aReturn['error'] = "There was an error adding the file to the database.";
				}
				$this->aReturn['data'] = $aData;
			break;
		}
		$this->returnJSON($this->aReturn);
	}
}
$oSFBWpDb = new SFBWpDb;
// ABSPATH // array_flip // SFB_PATH // SFB_BASE
// $wp_filetype = wp_check_filetype($filename);
// $attachment = Array ( [post_mime_type] => image/png [guid] => http://localhost/sjeiti/web/wp-content/uploads/dhtmldemo.png [post_parent] => 0 [post_title] => dhtmldemo [post_content] => ) 652
//
// $id = wp_insert_attachment($attachment, $file, $post_id);
// if ( !is_wp_error($id) ) {
//	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $file ) );
// }
//
//
/*
query.php (122,8): function is_attachment() {



post.php (182,1):  function update_attached_file( $attachment_id, $file ) {
post.php (706,1):  function get_post_type( $the_post = false ) {
post.php (733,1):  function get_post_type_object( $post_type ) {
post.php (757,1):  function get_post_types( $args = array(), $output = 'names', $operator = 'and' ) {
post.php (1598,1): function wp_count_attachments( $mime_type = '' ) {
post.php (1627,1): function wp_match_mime_types($wildcard_mime_types, $real_mime_types) {
post.php (1660,1): function wp_post_mime_type_where($post_mime_types, $table_alias = '') {

post.php (2149,1): function wp_insert_post($postarr = array(), $wp_error = false) {
post.php (2406,1): function wp_update_post($postarr = array()) {

post.php (3237,1): function is_local_attachment($url) {
post.php (3291,1): function wp_insert_attachment($object, $file = false, $parent = 0) {
post.php (3442,1): function wp_delete_attachment( $post_id, $force_delete = false ) {
post.php (3537,1): function wp_get_attachment_metadata( $post_id = 0, $unfiltered = false ) {
post.php (3559,1): function wp_update_attachment_metadata( $post_id, $data ) {
post.php (3577,1): function wp_get_attachment_url( $post_id = 0 ) {
post.php (3611,1): function wp_get_attachment_thumb_file( $post_id = 0 ) {
post.php (3633,1): function wp_get_attachment_thumb_url( $post_id = 0 ) {
post.php (3660,1): function wp_attachment_is_image( $post_id = 0 ) {
post.php (3685,1): function wp_mime_type_icon( $mime = 0 ) {




WP_INSERT_ATTACHMENT
	$wp_filetype = wp_check_filetype(basename($filename), null );
	$attachment = array(
		'post_mime_type' => $wp_filetype['type'],
		'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
		'post_content' => '',
		'post_status' => 'inherit'
	);
	$attach_id = wp_insert_attachment( $attachment, $filename, 37 );
	// you must first include the image.php file
	// for the function wp_generate_attachment_metadata() to work
	require_once(ABSPATH . "wp-admin" . '/includes/image.php');
	$attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
	wp_update_attachment_metadata( $attach_id,  $attach_data );


*/