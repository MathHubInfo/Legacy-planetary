define (req) ->

	class Interpreter
		constructor: (@editor, @config) ->
			_this = @;
			@env = {};
			@eventQueue = @config.eventQueue;

			JOBAD.util.on(@eventQueue, "interpreter/getImplementation", (item) ->
				return _this.env[item];
				);

		hasImplementation: (item) ->
			@env[item]?;

		exec: (script) ->
			console.log(this);
			try
				eval("with (this.env) { script(); }");
			catch e
				s = e;
			s.toString() if s? && s.toString?

		autocomplete: (string, callback) ->
			results = [];
			for prop of @env
				results.push(prop) if prop.indexOf(string) == 0
			callback(results);

		loadScript : (editor, env, api) ->
			(t) ->
				env[api] = () ->
					t(editor);

		loadAPI: (data) ->
			env = @env;
			editor = @editor;
			for prop of data
				api = "scripts/"+prop+"-"+data[prop]["repo"]+"-"+data[prop]["version"]+".js";
				r = require([require.toUrl(api)], @loadScript(editor, env, prop));

			env