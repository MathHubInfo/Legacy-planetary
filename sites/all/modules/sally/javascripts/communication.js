function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
/**
The Communication object contains the client side logic for sending messages from Theo (the services displayed in Theo) to Sally.
 */
var Communication = {
	/**
	The received variable tells us if the scripts have been loaded and, if they are we can send proto messages to sally.
	 */
	received : false,
	scriptTarget : 0,
	callback : null,
	token : null,
	/**
	The scripts must be injected before the document loads.
	 */
	injectScripts : function () {
		var element = document.createElement("ScriptsElement");
		document.documentElement.appendChild(element);
		var evt = document.createEvent("Events");
		evt.initEvent("RequestScripts", true, false);
		element.dispatchEvent(evt);
	},
	/**
	This function is used to request the resources. The actual handling of the resources is done in the event listener.
	The function can be called without parameters when it is called after injecting resources or with one parameter which is a callback function.
	 */
	injectResources : function () {
		if (arguments.lenght == 1 && isFunction(arguments[0]))
			this.callback = arguments[0];
		if (this.received == true) {
			var element = document.createElement("ResourceElement");
			document.documentElement.appendChild(element);
			// Sally needs the context for which the resources are required i.e. document type, filename, token
			var context = new sally.ResourceContext;
			//This information is set when the service is initialized.
			context.token = this.token;
			var evt = new CustomEvent("RequestResources", {
					detail : JSON.stringify(serialize(context)),
					bubbles : true,
					cancelable : false
				});
			element.dispatchEvent(evt);
		}
		
	},
	
	/**
	Used to send events back to Sally. This implementation assumes that all actions will have a theory, a symbol, an action and a token.
	 */
	sendMessage : function (token, theory, symbol, action) {
		//If the scripts have not been injected there in no point in proceeding further.
		if (received == false)
			return;
	//Construct the message.	
		var term = new sally.OntologyItem;
		term.theory = theory;
		term.symbol = symbol;
		var message = new sally.TheoMessage;
		message.term = term;
		message.token = token;
		// Each action is represented by an integer, for now we only have NAVIGATE
		if (action == 0)
			message.action = sally.TheoMessage.Action.NAVIGATE;
		else
			return;
			
		var element = document.createElement("ResourceElement");
		document.documentElement.appendChild(element);
		// Sally needs the context for which the resources are required i.e. document type, filename, token
		var evt = new CustomEvent("RequestResources", {
				detail : JSON.stringify(serialize(message)),
				bubbles : true,
				cancelable : false
			});
		element.dispatchEvent(evt);
		
	},
	// This function is used to count if all the scripts have been loaded.
	counter : function () {
		Communication.scriptTarget--;
		if (Communication.scriptTarget == 0) {
			Communication.received = true;
			if (Communication.callback !== null) {
				Communication.injectResources();
			}
		}
	},
	/**
	This function injects the scripts and requests the resources. It can be used without arguments when it doesn't inject the resources and with two arguments
	arguments[0] - Identification string used to get the knowledge context back from sally.
	arguments[1] - callback function to be used on the returned resources.
	 */
	init : function () {
		var ref = this;
		if (arguments.length == 2 && isFunction(arguments[1])) {
			ref.callback = arguments[1];
			ref.token = arguments[0];
		}
		//	alert(this.callback == callback); If this is true why doesn't ref.callback(evt.detail) work
		//TODO
		document.addEventListener("ReceivedResources", function (evt) {
			var callback = ref.callback;
			var mes = JSON.parse(evt.detail);
			var message = restore(mes);
			callback(message);
		}, true, true);
		
		document.addEventListener("ReceivedScripts", function (evt) {
			var scriptsToLoad = evt.detail;
			var headID = document.getElementsByTagName("head")[0];
			ref.scriptTarget = scriptsToLoad.length;
			for (var i = 0; i < scriptsToLoad.length; i++) {
				var newScript = document.createElement('script');
				newScript.type = 'text/javascript';
				newScript.src = scriptsToLoad[i];
				newScript.onload = ref.counter;
				headID.appendChild(newScript);
			}
		}, true, true);
		/**
		Add event listener for the event that signals that the scripts have been loaded and received.
		 */
		this.injectScripts();
	}
	
};
//window.onload = Communication.init(true, alert);
