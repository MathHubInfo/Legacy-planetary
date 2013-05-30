<?php

interface GlossaryAPI 
{
	public function suggestImports($prefix);
	public function getModuleImports($moduleId);
	public function getModuleSymbols($moduleId);
	public function serialize($moduleId, $imports, $symbols);
}
