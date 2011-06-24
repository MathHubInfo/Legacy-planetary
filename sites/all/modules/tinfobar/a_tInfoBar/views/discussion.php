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
$this->Title(T('Start a New Discussion'));
$Session = Gdn::Session();
$CancelUrl = '/vanilla/discussions';
if (C('Vanilla.Categories.Use') && is_object($this->Category))
   $CancelUrl = '/vanilla/discussions/0/'.$this->Category->CategoryID.'/'.Gdn_Format::Url($this->Category->Name);

?>
<div id="DiscussionForm">
   <h2><?php echo T(property_exists($this, 'Discussion') ? 'Edit Discussion' : 'Start a New Discussion'); ?></h2>
   <?php
      echo $this->Form->Open();
      echo $this->Form->Errors();
      $this->FireEvent('BeforeFormInputs');
      
      echo $this->Form->Label('Discussion Title', 'Name');
      echo $this->Form->TextBox('Name', array('maxlength' => 100));
      if ($this->ShowCategorySelector === TRUE) {
         echo '<div class="Category">';
         echo $this->Form->Label('Category', 'CategoryID');
         echo $this->Form->DropDown('CategoryID', $this->CategoryData, array('TextField' => 'Name', 'ValueField' => 'CategoryID'));
         echo '</div>';
      }
      
      $this->FireEvent('BeforeBodyInput');
      
      echo $this->Form->TextBox('Body', array('MultiLine' => TRUE));

      echo "<div class=\"PostFormControlPanel\">\n";
      $Options = '';
      // If the user has any of the following permissions (regardless of junction), show the options
      // Note: I need to validate that they have permission in the specified category on the back-end
      // TODO: hide these boxes depending on which category is selected in the dropdown above.
      if ($Session->CheckPermission('Vanilla.Discussions.Announce'))
         $Options .= '<li>'.$this->Form->CheckBox('Announce', T('Announce'), array('value' => '1')).'</li>';

      if ($Session->CheckPermission('Vanilla.Discussions.Close'))
         $Options .= '<li>'.$this->Form->CheckBox('Closed', T('Close'), array('value' => '1')).'</li>';

		$this->EventArguments['Options'] = &$Options;
		$this->FireEvent('DiscussionFormOptions');

      if ($Options != '')
         echo '<ul class="PostOptions">' . $Options .'</ul>';

      $this->FireEvent('BeforeFormButtons');
      echo $this->Form->Button((property_exists($this, 'Discussion')) ? 'Save' : 'Post Discussion', array('class' => 'Button DiscussionButton'));
      if (!property_exists($this, 'Discussion') || !is_object($this->Discussion) || (property_exists($this, 'Draft') && is_object($this->Draft))) {
         echo $this->Form->Button('Save Draft', array('class' => 'Button DraftButton'));
      }
      echo $this->Form->Button('Preview', array('class' => 'Button PreviewButton'));
      $this->FireEvent('AfterFormButtons');
      echo Anchor(T('Cancel'), $CancelUrl, 'Cancel');
      echo "</div>\n";
      echo $this->Form->Close();
   ?>
</div>
