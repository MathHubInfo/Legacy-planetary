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
	scriptTarget : 0, // This is initialized to the number of scripts we have to load and then we decrease it when every script is loaded
	callbackId : 0, //

	/**
	This function tells the user if the javascripts have been loaded and if it is possible to use the protobuf library to send messages
	 */
	isActive : function () {
		return this.received;
	},
	/**
	The scripts must be injected before the document loads.
	 */
	injectScripts : function () {
		/*Create an event of type RequestScripts and dispatch it. This event is catched in main.js
		The functionality that TheoFX has to provide is the one of catching this event, getting the source attributes of the javascripts from the communication window and dispatching an event containing the sources in this page.
		 */
		if (typeof(app) != 'undefined') {
			app.injectScripts();
			return;
		}

		var element = document.createElement("ScriptsElement");
		document.documentElement.appendChild(element);
		var evt = document.createEvent("Events");
		evt.initEvent("RequestScripts", true, false);
		element.dispatchEvent(evt);
	},

	/**
	Used to send events back to Sally.
	 */
	sendMessage : function (message, callback) {
		//If the scripts have not been injected there in no point in proceeding further.
		var mes = "";
		if (this.isActive() == false)
			return;
		if (typeof(message) == 'undefined')
			return;
		if (typeof(callback) != 'undefined') {
			var nameOfFunction = this.generateCallbackId(callback); //We generate a name for the callback function and attach it to Communication object.
			mes = JSON.stringify(serialize(message, nameOfFunction));
		} else {
			mes = JSON.stringify(serialize(message));
		}
		var element = document.createElement("ResourceElement");
		document.documentElement.appendChild(element);
		// We serialize and stringify the object to avoid the loss of data when dispatching the object to another window.
		var evt = new CustomEvent("RequestResources", {
				detail : mes,
				bubbles : true,
				cancelable : false
			});
		element.dispatchEvent(evt);

	},
	/**
	This function generates a name for the callback and attaches it to the Communication object.
	This is done so that when we get something from Sally we can call the appropriate function
	 */
	generateCallbackId : function (callback) {
		var nameOfFunction = "";
		if (isFunction(callback)) {
			this.callbackId++;
			nameOfFunction = this.callbackId;
			try {
				eval('Communication.fun' + nameOfFunction + ' = callback');
			} catch (err) {
				alert(err);
			}
		}
		return nameOfFunction;
	},
	/**
	This function injects the scripts and requests the resources. It can be used without arguments when it doesn't inject the resources and
	with two arguments when it does.
	arguments[0] - Identification string used to get the knowledge context back from sally.
	arguments[1] - callback function to be used on the returned resources.
	 */
	init : function () {
		var ref = this;
		var callback = null;
		var token = null;
		if (arguments.length == 2 && isFunction(arguments[1])) {
			token = arguments[0];
			callback = arguments[1];
		}
		// This function is used to count if all the scripts have been loaded.
		// Every time a script is loaded this function is called.
		var counter = function () {
			ref.scriptTarget--;
			if (ref.scriptTarget == 0) {
				ref.received = true;
				if (callback !== null) {
					var context = new sally.ResourceContext;
					context.actionId = token;
					Communication.sendMessage(context, callback);
				}
			}
		};
		/*
		This event listener is responsible for handling responses from sally.
		 */
		document.addEventListener("ReceivedResources", function (evt) {
			var mes = JSON.parse(evt.detail);
			var message = restore(mes);
			if (typeof(message.msgrid) == 'undefined')
				return;
			else {

				var callback = eval('Communication.fun' + message.msgrid);
				//var content = eval("message." + message.type.replace(".", "_"));
				var content = message.message;
				callback(content);
			}
		}, true, true);
		/*
		This event listener is responsible for handling the event that contains information about the scripts.
		 */
		document.addEventListener("ReceivedScripts", function (evt) {
			var scriptsToLoad = evt.detail;
			var headID = document.getElementsByTagName("head")[0];
			ref.scriptTarget = scriptsToLoad.length;
			for (var i = 0; i < scriptsToLoad.length; i++) {
				var newScript = document.createElement('script');
				newScript.type = 'text/javascript';
				newScript.src = scriptsToLoad[i];
				newScript.onload = counter;
				headID.appendChild(newScript);
			}
		}, true, true);
		/**
		Add event listener for the event that signals that the scripts have been loaded and received.
		 */
		this.injectScripts();
	}

};