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

   /**
    * A helper class that replaces some of the vanilla form inputs
    * Works only with ConfigurationModel
    */
   class BetterForm extends Gdn_Form {

      public function __construct( $Form ){
         if( $Form ){
            $this->Action        = $Form->Action;
            $this->ErrorClass    = $Form->ErrorClass;
            $this->HiddenInputs  = $Form->HiddenInputs;
            $this->IDPrefix      = $Form->IDPrefix;
            $this->InputPrefix   = $Form->InputPrefix;
            $this->Method        = $Form->Method;
         }
      }

      public function CheckBox($FieldName, $Label = '', $Attributes = array()){
         $Value = ArrayValueI('value', $Attributes);
         if ($Value === FALSE){
            $Value = $this->GetValue($FieldName);
            $Value = $Value === FALSE ? C($FieldName) : $Value;
            $Value = $Value ? $Value : 'on';
         }
         $Attributes['value'] = $Value;

         if ($this->GetValue($FieldName) == $Value)
         $Attributes['checked'] = 'checked';

         // Show inline errors?
         $ShowErrors = ($this->_InlineErrors && array_key_exists($FieldName, $this->_ValidationResults));
         // Get the value from the database
         if ( !isset($Attributes['checked']) && C($FieldName) == $Value ){
            $Attributes['checked'] = 'checked';
         }

         $Input = $this->Input($FieldName, 'checkbox', $Attributes);
         if ($Label != '') 
            $Input = '<label for="' . ArrayValueI('id', $Attributes, $this->EscapeID($FieldName, FALSE)) .
                        '" class="CheckBoxLabel">' . $Input . ' ' . T($Label) . '</label>';

         // Append validation error message
         if ($ShowErrors && ArrayValueI('InlineErrors', $Attributes, TRUE))
            $Return .= $this->InlineError($FieldName);

         return $Input;
      }

      public function DropDown($FieldName, $DataSet, $Attributes = array()) {
         // Show inline errors?
         $ShowErrors = ($this->_InlineErrors && array_key_exists($FieldName, $this->_ValidationResults));

         // Add error class to input element
         if ($ShowErrors)
            $this->AddErrorClass($Attributes);

         // Opening select tag
         $Return = '<select';
         $Return .= $this->_IDAttribute($FieldName, $Attributes);
         $Return .= $this->_NameAttribute($FieldName, $Attributes);
         $Return .= $this->_AttributesToString($Attributes);
         $Return .= ">\n";

         // Get value from attributes and ensure it's an array
         $Value = ArrayValueI('Value', $Attributes);
         if ($Value === FALSE){
            $Value = $this->GetValue($FieldName);
            $Value = $Value === FALSE ? C($FieldName) : $Value;
         }
         if (!is_array($Value))
            $Value = array($Value);

         // Start with null option?
         $IncludeNull = ArrayValueI('IncludeNull', $Attributes);
         if ($IncludeNull === TRUE) $Return .= "<option value=\"\"></option>\n";

         if (is_object($DataSet)) {
            $FieldsExist = FALSE;
            $ValueField = ArrayValueI('ValueField', $Attributes, 'value');
            $TextField = ArrayValueI('TextField', $Attributes, 'text');
            $Data = $DataSet->FirstRow();
            if (is_object($Data) && property_exists($Data, $ValueField) && property_exists(
               $Data, $TextField)) {
               foreach($DataSet->Result() as $Data) {
                  $Return .= '<option value="' . $Data->$ValueField .
                      '"';
                  if (in_array($Data->$ValueField, $Value)) $Return .= ' selected="selected"';

                  $Return .= '>' . $Data->$TextField . "</option>\n";
               }
            }
         } elseif (is_array($DataSet)) {
            foreach($DataSet as $ID => $Text) {
               $Return .= '<option value="' . $ID . '"';
               if (in_array($ID, $Value)) $Return .= ' selected="selected"';

               $Return .= '>' . $Text . "</option>\n";
            }
         }
         $Return .= '</select>';

         // Append validation error message
         if ($ShowErrors && ArrayValueI('InlineErrors', $Attributes, TRUE))
            $Return .= $this->InlineError($FieldName);

         return $Return;
      }

      public function TextBox($FieldName, $Attributes = FALSE) {
         if (!is_array($Attributes))
            $Attributes = array();

         $MultiLine = ArrayValueI('MultiLine', $Attributes);

         if ($MultiLine) {
            $Attributes['rows'] = ArrayValueI('rows', $Attributes, '6'); // For xhtml compliance
            $Attributes['cols'] = ArrayValueI('cols', $Attributes, '100'); // For xhtml compliance
         }

         // Show inline errors?
         $ShowErrors = $this->_InlineErrors && array_key_exists($FieldName, $this->_ValidationResults);

         // Add error class to input element
         if ($ShowErrors)
            $this->AddErrorClass($Attributes);

         $CssClass = ArrayValueI('class', $Attributes);
         if ($CssClass == FALSE) $Attributes['class'] = $MultiLine ? 'TextBox' : 'InputBox';
         $Return = $MultiLine === TRUE ? '<textarea' : '<input type="text"';
         $Return .= $this->_IDAttribute($FieldName, $Attributes);
         $Return .= $this->_NameAttribute($FieldName, $Attributes);
         $Return .= $MultiLine === TRUE ? '' : $this->_ValueAttribute($FieldName, $Attributes);
         $Return .= $this->_AttributesToString($Attributes);

         $Value = ArrayValueI('Value', $Attributes);
         if ($Value === FALSE){
            $Value = $this->GetValue($FieldName);
            $Value = $Value === FALSE ? C($FieldName) : $Value;
            if( $Value == '' && $Attributes['default'] ){
               $Value = $Attributes['default'];
               unset($Attributes['default']);
            }
         }
         
         $Return .= $MultiLine === TRUE ? '>' . htmlentities($Value, ENT_COMPAT, 'UTF-8') . '</textarea>' : ' />';

         // Append validation error message
         if ($ShowErrors)
            $Return .= $this->InlineError($FieldName);

         return $Return;
      }

   }

   $BF = new BetterForm( $this->Form );

?>
