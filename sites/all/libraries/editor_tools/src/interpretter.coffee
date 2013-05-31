define (req) ->

	class Interpreter
		constructor: (@editor, @config) ->
			@env = {};

		hasImplementation: (item) ->
			@env[item]?;

		exec: (script) ->
			try
				eval("with (this.env) { s = eval(script); }");
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