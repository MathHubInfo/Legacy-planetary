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
 if (!defined('APPLICATION')) exit(); ?>
<?php
   $PluginName = $this->PluginName;

   require_once(PATH_PLUGINS."/$PluginName/class.betterForm.php");
   $Prefix  = "Plugins.$PluginName";
?>

<div class="Help Aside">
   <h2>More Info</h2>
   <ul>
      <li><?php echo T('The plugin can be enabled on the content types below by ticking the respective boxes.'); ?></li>
   </ul>
</div>

<h1><?php echo $PluginName; ?> Settings</h1>
<?php
   echo $this->Form->Open();
   echo $this->Form->Errors();
?>

<div class="Info">
   <?php
      echo Wrap(T("The tInfoBar is responsible for the notification area on the right side of the planetary content screens."), 'div');
      echo Wrap(T('It also assigns the icon menu for certain tokens which are defined along with their actions in the setup files bellow.'), 'div');
   ?>

   <br />

   <table class="altRows">
      <thead>
         <th>Enabled</th>
         <th style="width:100%">Application Name</th>
      </thead>

      <tbody>
   <?php

      $AM = new Gdn_ApplicationManager();
      $apps = $AM->AvailableApplications();

      $skip = array("Dashboard", "Skeleton", "Vanilla");
      foreach($skip as $v) unset($apps[$v]);

      ksort($apps);

      foreach($apps as $k => $v){
         echo '
            <tr class="disabled">
               <td class="Info" style="text-align:center">'
                  .$BF->CheckBox("$Prefix.EnabledApps.$k").
               '</td>
               <td class="Alt">'.$k.'</td>
            </tr>
         ';
      }
   ?>
      </tbody>
   </table>

   <br />
   Bellow is the setup code for each content type to be included.
   <br />

   <?php

      $AppList = array('NONE' => 'Not similar');
      foreach($apps as $k => $v) $AppList[$k] = $k;

      foreach($apps as $k => $v){
         $DD_name = "$Prefix.setup.equivalent.$k";
         $TB_name = "$Prefix.setupFile.$k";
         echo '
            <br />

            <div class="Help Aside">
               <span style="font-family:verdana; font-size:9pt;">'
                  .T('<b>Note</b> that in addition to ticking the box a <i>javascript</i> setup code needs to be provided for each application.').
               '</span>
            </div>

            <h1>Setup code for: <span style="color:red">'.$k.'</span>
               <select style="visibility:hidden"></select>
               '.$this->Form->Button('Save', array('style' => 'float:left')).'
            </h1>
            <div class="info">
               '.$BF->TextBox($TB_name,
                       array( 'Multiline' => true,
                              'style'     => 'width: 100%; height: 300px;',
                              'default'   => '/** Please provide the jQuery setup code for this application **/'
                       )
               ).'
            </div>
         ';
      }
   ?>
</div>

<?php
   echo $this->Form->Close('Save');