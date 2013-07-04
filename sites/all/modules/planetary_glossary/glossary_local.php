<?php

require_once("glossary_api.php");

class LocalGlossary implements GlossaryAPI {
  function suggestImports($prefix) {
    $term_matches = array();
    foreach (planetary_repo_list("/") as $file) {
      $matches = array();
      if (preg_match("/^([a-zA-Z0-9-_]+)\.tex$/", $file, $matches) == 0)
        continue;
      if (strlen($prefix)>0 && strpos($matches[1], $prefix) === false)
        continue;
      if ($matches[1]=="all")
        continue;
      $term_matches[] = $matches[1];
    }
    return $term_matches;
  }

  function get_template($file, $vars = array()) {
      ob_start();
      $file = __DIR__ . "/".$file;
      if (file_exists($file)) {
          include($file);
      }
      return ob_get_clean();
  }

  function getModuleImports($location) {
    $path_info = mmt_get_path_info($location);
    $moduleId = $path_info['modName'];
    $parent = $path_info['parent'];
    $path = planetary_glossary_get_path($moduleId, $parent);
    // if no "moduleId".tex file exists, return no imports
    if (planetary_repo_stat_file($path) == null)
      return array();

    $root_content = planetary_repo_load_file($path);
    $result = array();
    $matches = array();
    preg_match_all("|\\\\gimport\{([a-zA-Z0-9-_]+)\}|", $root_content, $matches, PREG_PATTERN_ORDER);
    return $matches[1];
  }

  function getModuleSymbols($location) {
    $path_info = mmt_get_path_info($location);
    $moduleId = $path_info['modName'];
    $parent = $path_info['parent'];
    $path = planetary_glossary_get_path($moduleId, $parent);
    // if no "moduleId".tex file exists, return no imports
    if (planetary_repo_stat_file($path) == null)
      return array();

    $root_content = planetary_repo_load_file($path);
    $result = array();
    $matches = array();
    preg_match_all("|\\\\symbol\{([a-zA-Z0-9-_]+)\}|", $root_content, $matches, PREG_PATTERN_ORDER);
    return $matches[1];
  }


  function serialize($location, $imports, $symbols) {
    $path_info = mmt_get_path_info($location);
    $moduleId = $path_info['modName'];
    $parent = $path_info['parent'];
    $path = planetary_glossary_get_path($moduleId, $parent);
    $content = $this->get_template("glossary_module_template.php", array("moduleid" => $moduleId, "imports" => $imports, "symbols" => $symbols));
    planetary_repo_save_file($path, $content);
  }
}

