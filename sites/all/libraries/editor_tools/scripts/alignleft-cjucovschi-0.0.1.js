define(function(require) { return function(ace) { var core = require("scripts/core-cjucovschi-0.0.1"); core.setAce(ace); core.embbedText(core.getSelectedRange(), "\\begin\{flushleft\}\n", "\n\\end\{flushleft\}\n");
core.focus();
core.clearSelection();
}});