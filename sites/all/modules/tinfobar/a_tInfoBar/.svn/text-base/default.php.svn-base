<?php
// Copyright (C) 2010-2011, Planetary System Developer Group. All rights reserved.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>
 if (!defined('APPLICATION')) exit();

$PluginInfo['tInfoBar'] = array(
	'Description'            => 'Enables the tInfoBar plugin on articles and books',
	'Version'                => '0.1',
	'RequiredApplications'   => NULL,
	'RequiredTheme'          => FALSE,
	'RequiredPlugins'        => FALSE,
	'HasLocale'              => FALSE,
   'SettingsUrl'           => 'settings/tInfoBar',
	'Author'                 => "Stefan Mirea",
	'AuthorEmail'            => 'steven.mirea@jacobs-university.de'
);

class tInfoBar extends Gdn_Plugin {

   public function Base_Render_Before( &$Sender ) {
//      if(C("Plugins.tCollapsible.EnabledApps.".$Sender->Application)){
      if( $Sender->Application == 'Articles' || $Sender->Application == 'Books' ){
         $Sender->AddCssFile($this->GetResource('css/tTooltip.css', FALSE, FALSE));
         $Sender->AddCssFile($this->GetResource('css/tIconMenu.css', FALSE, FALSE));
         $Sender->AddCssFile($this->GetResource('css/tInfoBar.css', FALSE, FALSE));
         $Sender->AddCssFile($this->GetResource('css/MathML.css', FALSE, FALSE));

         $Sender->AddJsFile($this->GetResource('js/tTooltip.js', FALSE, FALSE));
         $Sender->AddJsFile($this->GetResource('js/tIconMenu.js', FALSE, FALSE));
         $Sender->AddJsFile($this->GetResource('js/tInfoBar.js', FALSE, FALSE));
         /* NOTE: Not working on planetary. Using Hardcoded version in application folders instead
         // Add the custom setup file for each application
         // As vanilla is stupid and for some reason add an ?&amp;v=... at the end of the link
         // we have to do it the hard way
         $Sender->Head->AddString(
                 "\n".'<script src="'
                  .Gdn_Url::WebRoot(true).'/index.php?p=/plugin/'.$this->ClassName.'SetupFiles/'.$Sender->Application.
                 '" type="text/javascript"></script>');
         */
      }
   }

   public function PluginController_tInfoBarSetupFiles_Create( &$Sender ){
      if($Sender->RequestArgs[0])
         echo C('Plugins.'.$this->ClassName.'.setupFile.'.$Sender->RequestArgs[0]);
   }

	public function Base_GetAppSettingsMenuItems_Handler(&$Sender) {
		$Menu = &$Sender->EventArguments['SideMenu'];
		$Menu->AddLink('Add-ons', T($this->ClassName), 'settings/'.$this->ClassName, 'Garden.Settings.Manage');
	}

   public function SettingsController_tInfoBar_Create(&$Sender) {
      $Sender->PluginName = $this->ClassName;

      $Sender->AddSideMenu('plugin/'.$this->ClassName);
      $Sender->Form = new Gdn_Form();
      $Validation = new Gdn_Validation();
      $ConfigurationModel = new Gdn_ConfigurationModel($Validation);
      $Sender->Form->SetModel($ConfigurationModel);

      if ($Sender->Form->AuthenticatedPostBack() === FALSE) {
         $Sender->Form->SetData($ConfigurationModel->Data);
      } else {
         $Data = $Sender->Form->FormValues();
         $ConfigurationModel->SetField(array_keys($Data));

         if ($Sender->Form->Save() !== FALSE)
            $Sender->StatusMessage = Gdn::Translate("Your settings have been saved.");
      }

      // creates the page for the plugin options such as display options
      $Sender->View = dirname(__FILE__).DS.'views'.DS.'dashboard.php';
      $Sender->Render();
   }

	// Filter discussion list to a particular articleid if it is present on the model (I add it to the model manually before running the Get() method in the AddonController.
	public function DiscussionModel_BeforeGet_Handler($Sender) {
		$ArticleID = GetValue('ArticleID', $Sender);
		if (is_numeric($ArticleID) && $ArticleID > 0)
		$Sender->SQL->Where('ArticleID', $ArticleID);
	}
	
	//Pass the ArticleID to the form
	public function PostController_Render_Before($Sender) {
		$code = GetIncomingValue('code');
		$a = explode('||', $code);
		
		if(count( $a ) == 2){
			$Sender->Form->AddHidden('ArticleID', $a[0]);
			$Sender->Form->AddHidden('ItemID', $a[1]);
		}
	}

	public function PluginController_getArticleThreads_Create( &$Sender ){
		$ArticleID 	= GetIncomingValue( 'ArticleID' );
		$ItemID		= GetIncomingValue( 'ItemID' );

		$Data = Gdn::Database()->SQL()->Select('Name, DiscussionID')->From('Discussion')->Where('ItemID', $ItemID)->Get()->ResultArray();

		foreach( $Data as $v)
			echo sprintf(T('%s'), Anchor($v['Name'], 'discussion/'.$v['DiscussionID'].'/'.Gdn_Format::Url($v['Name'])));
		
	}
	
	public function ArticleController_ArticleOptions_Handler(&$Sender){
		echo '<span style="display:none" id="CurrentArticleID">'.$Sender->Article->ArticleID.'</span>';
	}
	
	//TODO: Deprecated
	public function PluginController_getMyUsername_Create( &$Sender ){
		$Session	= Gdn::Session();
		echo $Session->User->Name;
	}
	
// /*	TODO: use this method
	public function PluginController_tInfoBarAJAX_Create(&$Sender) {
      $args = $Sender->RequestArgs;
      $action  = isset($_REQUEST['action']) ? $_REQUEST['action'] : $args[0];

      $table_comments = 'tInfoBar_comments';
      $SQL = Gdn::SQL();
      switch( $action ){
	      case 'getIDs':
            $context = isset($_REQUEST['context']) ? $_REQUEST['context'] : $args[1];
            $SQL->Select('wordID')->Distinct()->From($table_comments);
            if( isset($context) ) $SQL->Where("context", $context);

            $res = $SQL->Get();
		      $h = '';
		      while($r = $res->NextRow(DATASET_TYPE_ARRAY))
			      $h .= ", '".$r['wordID']."'";
			
		      echo '['.substr($h, 1).']';
	      break;
	      case 'comment':
		      $context	= isset($_REQUEST['context']) ? $_REQUEST['context'] : $args[1];
		      $wordID	= isset($_REQUEST['wordID']) ? $_REQUEST['wordID'] : $args[2];
		      $text		= isset($_REQUEST['text']) ? $_REQUEST['text'] : $args[3];
		      $user		= 'Guest';
            
            $SQL->Insert($table_comments, array(
                'context'  => $context,
                'wordID'   => $wordID,
                'user'     => $user,
                'text'     => $text
            ));
            
            echo 'true';
	      break;
	      case 'getComments':
		      $wordID  = isset($_REQUEST['wordID']) ? $_REQUEST['wordID'] : $args[1];
            $res     = $SQL->Select('*')->From($table_comments)->Where('wordID', $wordID)->Get();
		      $h 		= '';
		      while($r = $res->NextRow(DATASET_TYPE_ARRAY))
			      $h .= ", '<b>".$r['user']."</b>: ".htmlspecialchars($r['text'])."'";

            echo '['.substr($h, 1).']';
	      break;
      }
   }
// */

	/**
	 * Create table if not exists and create a dbinfo.php file for ajax use
	 */
	public function Setup() {
		$commentsTable = 'GDN_tInfoBar_comments';
		$file_dbinfo	= $this->GetPluginFolder().'/dbinfo.php';
		$file_globals	= $this->GetPluginFolder().'/globals.js';
		
		
		$Structure = Gdn::Structure();
		$Structure->Query("
			CREATE TABLE IF NOT EXISTS `$commentsTable` (
			  `id` int(11) NOT NULL AUTO_INCREMENT,
			  `context` varchar(256) NOT NULL,
			  `wordID` text NOT NULL,
			  `user` varchar(60) NOT NULL,
			  `text` text NOT NULL,
			  PRIMARY KEY (`id`)
			) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;
		");
		
		$dbinfo = '<?php
	$table_comments = "'.$commentsTable.'";

	$db_host 	= \''.Gdn::Config('Database.Host').'\';
	$db_user		= \''.Gdn::Config('Database.User').'\';
	$db_pass		= \''.Gdn::Config('Database.Password').'\';
	$db_database= \''.Gdn::Config('Database.Name').'\';

	$con = mysql_connect($db_host, $db_user, $db_pass) or die ("Could not connect to Data Base!");
	mysql_select_db($db_database, $con) or die ("Failed to select Data Base");
?>
';

		$globals = '
// Some global vars for use in the main.js file
var GdnWebRoot			= "'.Gdn_Url::WebRoot( true ).'";
var GgnPluginFolder	= "'.$this->GetPluginFolder().'";
';
		
//		if( !file_put_contents($file_dbinfo, $dbinfo))
//			exit("Unable to create database info file. Check if you have writing permissions on: <b>".$this->GetPluginFolder()."</b>");
		
//		if( !file_put_contents($file_globals, $globals))
//			exit("Unable to create database info file. Check if you have writing permissions on: <b>".$this->GetPluginFolder()."</b>");
		
//		chmod($file_dbinfo, 0777);
//		chmod($file_globals, 0777);

		 Gdn::Structure()
		 	->Table('Discussion')
			->Column('ArticleID', 'int', NULL)
			->Column('ItemID', 'varchar(256)', NULL)
			->Set();
		
	}
	
}
