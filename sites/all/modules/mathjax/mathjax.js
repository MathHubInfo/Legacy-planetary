if (!jQuery.browser.mozilla) {
	MathJax.Hub.Register.StartupHook("MathML Jax Ready", function() {
		var PARSE = MathJax.InputJax.MathML.Parse;
		var oldMakeMML = PARSE.prototype.MakeMML;
		PARSE.Augment({
			MakeMML : function(node) {
				if (node.hasAttribute("type")) {
					node.removeAttribute("type")
				}
				return oldMakeMML.apply(this, arguments);
			}
		});
	});
}