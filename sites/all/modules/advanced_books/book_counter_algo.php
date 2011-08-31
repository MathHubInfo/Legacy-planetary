
<?php 

$counters["chapter"] = array("parent"=>null, "formatter"=>"roman");
$counters["section"] = array("parent"=>"chapter", "formatter"=>"arabic");
$counters["subsection"] = array("parent"=>"section", "formatter"=>"arabic");
$counters["subsubsection"] = array("parent"=>"subsection", "formatter"=>"arabic");
$counters["statement"] = array("parent"=>"subsection", "formatter"=>"arabic");

$obj["table"]=array("#counter"=>"statement", "#fixed"=>true);
$obj["figure"]=array("#counter"=>"statement", "#fixed"=>true);
$obj["section"]=array("#counter"=>"subsubsection", "#fixed"=>false);

$pages = array();
$pages[0] = array(
			   array("#type"=>"section", "#title"=>"This is chapter 1"), 
			   array("#type"=>"table", "#title"=>"This is table 1.1"),
			   array("#type"=>"link", "#link"=>1), 
			   array("#type"=>"section", "#title"=>"This is chapter 2"));
$pages[1] = array(
			   array("#type"=>"section", "#title"=>"This is section 1.1"),
			   array("#type"=>"figure", "#title"=>"This is figure 1.1.1"),
			   array("#type"=>"table", "#title"=>"This is table 1.1.2"),
			   array("#type"=>"figure", "#title"=>"This is figure 1.1.3"),
			   array("#type"=>"section", "#title"=>"This is section 1.2"),
			   array("#type"=>"figure", "#title"=>"This is figure 1.2.1"),
			   array("#type"=>"link", "#link"=>2),
			   array("#type"=>"section", "#title"=>"This is figure 1.3"),
			   array("#type"=>"table", "#title"=>"This is table 1.3.1"),
);
$pages[2] = array(
			   array("#type"=>"table", "#title"=>"This is table 1.2.2"),
			   array("#type" => "section", "#title"=>"This is section 1.2.1"),
			   array("#type"=>"figure", "#title"=>"This is figure 1.2.1.1"),
);

function getLabel(&$counters, $label) {
	$res = (string) $counters[$label]["value"];
	for (; $counters[$label]["parent"]!=null;) {
		$label = $counters[$label]["parent"];
		if ($counters[$label]["value"]>0)
			$res = ((string) $counters[$label]["value"]).".".$res;
	}
	return $res;
}

function process($nid, &$pages, &$obj, &$counters) {
	$incremented = array();
	foreach ($pages[$nid] as $o) {
		$type = $o["#type"];
		if ($type == "link") {
			process($o["#link"], $pages, $obj, $counters);
			continue;
		}
		$objProps = $obj[$type];
		$counter = $lowest = $objProps["#counter"];
		$fixed = $objProps["#fixed"];
		if (!$fixed) {
			if (!isset($incremented[$counter])) {
				$last = $lowest = $counter;
				for (; $lowest != null && $counters[$lowest]["value"]==0; $lowest = $counters[$lowest]["parent"]) {
					$last = $lowest;
				}
				$lowest = $last;
				$incremented[$counter]=array("#level"=>$lowest);
			} else 
				$lowest = $incremented[$counter]["#level"];
			}
		if (isset($counters[$lowest]["children"])) {
			if (!isset($history))
				$history = array_merge(array(), $counters);
			foreach ($counters[$lowest]["children"] as $child) {
				$counters[$child]["value"]=0;
			}
		}
		$counters[$lowest]["value"]++;
		echo getLabel($counters, $lowest)." - ". $o["#title"]."<br/>";
	}
	foreach ($incremented as $key=>$val) {
		$lowest = $val["#level"];
		$counters[$lowest]["value"]=0;
	}
	if (isset($history))
		$counters = $history;
}

function init(&$counters) {
	foreach ($counters as $name=>$val) {
		$counters[$name]["value"] = 0;
		for ($key=$counters[$name]["parent"]; $key!=null; $key = $counters[$key]["parent"]) {
			$counters[$key]["children"][]=$name;
		}
	}
}

init($counters);

process(0, $pages, $obj, $counters);
?>