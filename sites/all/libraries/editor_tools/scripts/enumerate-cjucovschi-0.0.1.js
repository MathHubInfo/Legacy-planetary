define(function(require) { return function(ace) { var core = require("scripts/core-cjucovschi-0.0.1"); core.setAce(ace); core.embbedText(core.getSelectedRange(), "\\begin\{itemize\}\n  \\item ", "\n\\end\{itemize\}");
core.focus();
core.clearSelection();
}});