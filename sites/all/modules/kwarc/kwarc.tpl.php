<?php
function printList($list) {
  foreach ($list as $person) {
    if (isset($person["link"])) {
      echo "<a href='".$person["link"]."'>";
    }
    echo $person["name"];
    if (isset($person["link"])) {
      echo "</a>";
    }
    echo " (".$person["role"].")<br/>";
  }
}
?>

<div style="float:left; width: 50%">
<h1><?php echo $keys[0];?></h1>
<?php printList($people[$keys[0]]); ?>
</div>

<div style="float:left; width: 50%">
<h1><?php echo $keys[1];?></h1>
<?php printList($people[$keys[1]]); ?>
</div>

<div style="clear:both"></div>


<div style="float:left; width: 50%">
<h1><?php echo $keys[2];?></h1>
<?php printList($people[$keys[2]]); ?>
</div>

<div style="float:left; width: 50%">
<h1><?php echo $keys[3];?></h1>
<?php printList($people[$keys[3]]); ?>
</div>
<div style="clear:both"></div>
