Connectors for SFBrowser v2.5.3+
================================

A connector folder should at least have the following files.

	sfbrowser/connectors/[type]/config.[type]
	sfbrowser/connectors/[type]/init.[type]
	sfbrowser/connectors/[type]/sfbrowser.[type]


-----------
config file
-----------

The config file should at least have the following settings:
	- path of sfbrowser
	- the base upload folder
	- the language ISO code
	- ASCII preview ammount
	- a list of forbidden file extensions
	- an error return code (for severe misuse).
The config file is used in both the init file (to parse to sfbrowser js) and in the actual sfbrowser file (which does the actual server side thinking).


---------
init file
---------

The init file must be called in the html documents header in order to write these lines:
	<link rel="stylesheet" type="text/css" media="screen" href="sfbrowser/css/sfbrowser.css" />
	<script type="text/javascript" src="sfbrowser/array.js"></script>
	<script type="text/javascript" src="sfbrowser/jquery.tinysort.min.js"></script>
	<script type="text/javascript" src="sfbrowser/jquery.sfbrowser.min.js"></script>
	<script type="text/javascript" src="sfbrowser/lang/en.js"></script>
	<script type="text/javascript">
		<!--
		$.sfbrowser.defaults.connector = "php";
		$.sfbrowser.defaults.sfbpath = "sfbrowser/";
		$.sfbrowser.defaults.base = "../data/";
		$.sfbrowser.defaults.preview = 600;
		$.sfbrowser.defaults.deny = ["php","php3","phtml"];
		$.sfbrowser.defaults.icons = ['ai','as','avi','bmp','cs','default',(...)];
		-->
	</script>
As you might have noticed, most of these lines are formed to what is set in the config file. The icons variable is a folder readout from the sfbrowser/icons/ folder.


--------------
sfbrowser file
--------------

The sfbrowser file is the actual connector to the SFBrowser plugin. Mostly it will require some POST variables and a JSON output object.
A POST will always contain a variable "a" that will determine the action to be taken.

For all actions counts: make absolutely sure that the incoming data corresponds with that set in the config file!
	- Do not upload forbidden filetypes.
	- Only upload, rename, create, view, change and delete within base upload path.
	- Rename files, but not the file extension.
	- Do not return, force download or preview forbidden filetypes.

Mostly, a POST (or GET in case of force download) will contain the variable "folder" and the variable "file". Check both of these against the base upload folder set in the config. If it's outside, somebody is probably screwing around.
Just to be sure, check the number of _GET, _POST and _FILES variables. A _POST["a"] can only get a certain ammount of each, if these differ, something fishy might be going on.
If suspicious action occurs you can redirect them to the return error code set in the config file in order to block acces or whatever you'd like to do(??haven't really figured out how to go from there, consider it a loose stub??).

A number of the JSON outputs contain file descriptions. In the description of the types of actions the file object is referred to as <FileObject>. It looks like this:

	JSON FileObject: {
		 file:		<String>	file name
		,mime:		<String>	file extention
		,rsize:		<uint>		file size in bytes
		,size:		<String>	file size in kB, MB or whatever
		,time:		<uint>		time in Unix Epoch
		,date:		<String>	time in "j-n-Y H:i"
		,width:		<uint>		image width in pixels
		,height:	<uint>		image height in pixels
	}
	example folder: {
		file:"blue",
		mime:"folder",
		rsize:0,
		size:"-",
		time:1229275063,
		date:"14-12-2008 18:17"
	}
	example file: {
		file:"readme.txt",
		mime:"txt",
		rsize:3679,
		size:"4kB",
		time:1229275065,
		date:"14-12-2008 18:17"
	}
	example image: {
		file:"atomen.jpg",
		mime:"jpg",
		rsize:19005,
		size:"19kB",
		time:1229275063,
		date:"14-12-2008 18:17",
		width:254,
		height:359
	}

The following are the possible values for _POST["a"]: the possible actions that can be taken and the required return values.

_POST["a"]=="fileList" :: retreive file list
	requires:
		_POST["folder"] <String>	path to folder
	action:
		Read the contents of a folder
		Filter out the forbidden file types
		If applicable, filter for allowed file types
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
		,data:		<Object>	object containing <FileObject>'s
	}
	example: {
		error:	"",
		msg:	"fileListing",
		data: {
			a: <FileObject>,
			b: <FileObject>,
			c: <FileObject>,
			...
		}
	}




_POST["a"]=="duplicate" :: duplicate file
	requires:
		_POST["file"]	<String>	file name
		_POST["folder"]	<String>	file folder
	action:
		Create new non-existing file name
		Duplicate file to that name
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
		,data:		<FileObject>	duplicated file
	}




_POST["a"]=="upload" :: file upload
	requires:
		_FILES["fileToUpload"]	<Object>	file object
		_POST["file"]		<String>	path to folder
		_POST["deny"]		<String>	pipe separated string of denied file extensions ("php|tpl|log")
		_POST["allow"]		<String>	pipe separated string of allowed file extensions ("gif|jpg|jpeg|png")
		_POST["resize"]	<Array>		resize image to [width,heigth]
		
	action:
		Check for _FILES["fileToUpload"]["error"]
		Check _FILES["fileToUpload"]["tmp_name"] for actual upload
		Check forbidden filetypes
		Check allowed filetypes
		Check upload folder for similarly named file
		Move file to upload folder
		If applicable, resize image
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
		,data:		<FileObject>	uploaded file
	}




_POST["a"]=="bar" :: image resize
	requires:
		_POST["file"]	<String>	file name
		_POST["folder"]	<String>	file folder
		_POST["w"]	<uint>		new width
		_POST["h"]	<uint>		new height
	action:
		Resize image
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
	}




_POST["a"]=="delete" :: file delete
	requires:
		_POST["file"]	<String>	file name
		_POST["folder"]	<String>	file folder
	action:
		delete file
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
	}




_POST["a"]=="download" :: file force download
	requires:
		_POST["file"]	<String>	file name
		_POST["folder"]	<String>	file folder
	action:
		Force download file
	JSON return: nothing




_POST["a"]=="read" :: read txt file contents
	requires:
		_POST["file"]	<String>	file name
		_POST["folder"]	<String>	file folder
	action:
		Read and return file contents
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
		,data: {
			text:	<String>	first x amount of bytes from ascii file
		}
	}




_POST["a"]=="rename" :: rename file
	requires:
		_POST["file"]	<String>	original file name
		_POST["folder"]	<String>	file folder
		_POST["nfile"]	<String>	new file name
	action:
		Check if new file name is valid
		Rename file
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
	}




_POST["a"]=="addFolder" :: add folder
	requires:
		_POST["folder"]		<String>	folder to create new folder into
		_POST["foldername"]	<String>	new folder name
	action:
		Create new folder
	JSON return: {
		 error:		<String>	error message (see lang.js)
		,msg:		<String>	succes message (see lang.js)
		,data:		<FileObject>	newly created folder
	}