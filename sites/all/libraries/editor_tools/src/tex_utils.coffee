define (require) ->
	TextUtils = require "editor_tools/text_utils"

	class TexUtils extends TextUtils
		constructor: (@editor) ->
			super(editor);

		getEnvironmentAtPos : (pos) ->
			pos = @editor.getCursorPosition() if not pos? 
			cnt = {};
			result = null
			@searchReverse(pos, /\\(begin|end)\{([a-zA-Z0-9- ]+)\}/g, (pos, match) ->
				if not cnt[match[2]]?
					cnt[match[2]] = 0;
				if match[1] == "end" 
					cnt[match[2]]--; 
				else 
					cnt[match[2]]++;
				
				if (cnt[match[2]] > 0)
					result = match[2];
					return false
			);
			return result

	return TexUtils

