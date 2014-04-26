define(function(require) { return function(ace) { var core = require("scripts/core-cjucovschi-0.0.1"); core.setAce(ace); core.embbedText(core.getSelectedRange(), "\\begin\{flushright\}\n", "\n\\end\{flushright\}\n");
core.focus();
core.clearSelection();
}});