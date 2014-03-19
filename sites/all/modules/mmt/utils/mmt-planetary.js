
var planetary = {
  relNavigate: function(uri) {
  	var rawEncoded = encodeURIComponent(uri);
	var matches = uri.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
	var fragment = ""; //default
	if (matches[7] != undefined) {
		fragment = "#" + matches[7].substring(1); //removing beginning '?'
	}
	var path = matches[4] + "source/" + matches[6] + fragment;
	var pathname = window.location.pathname;
	if (pathname.charAt(pathname.length - 1) !== '/') {
		pathname = pathname + "/";
	} 
	var path = pathname + matches[6];
	window.open(path);
  },

  navigate: function(uri) {
  	window.open(planetary.encode(uri));        
  },
  encode : function(uri) {
	var rawEncoded = encodeURIComponent(uri);
	var matches = uri.match(/^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/);
	var fragment = ""; //default
	if (matches[7] != undefined) {
		fragment = "#" + matches[7].substring(1); //removing beginning '?'
	}
	var path = matches[4] + "source/" + matches[6] + fragment;
		return path;
    },
};