define (require) ->
	class AceTextAdapter
		clipboard = null

		constructor: (@ace) -> @session = @ace.getSession();

		getText : () -> @ace.getValue();
		insert : (pos, text) -> @session.insert(pos, text);
		getSelectedRange : () -> @session.getSelection().getRange();
		getCursorPosition : () -> @ace.getCursorPosition();
		setCursorPosition : (pos) -> @ace.moveCursorToPosition(pos); @ace.clearSelection();

		getSelectionText : () -> @session.getTextRange(@ace.getSelectionRange());

		cut: () -> clipboard = @getSelectionText(); @ace.execCommand("cut"); return; 
		copy: () -> clipboard = @getSelectionText(); return;
		paste: () -> @insertAtCursor(clipboard); @ace.clearSelection(); return;

		focus : () -> @ace.focus();

		isPositionBefore : (pos1, pos2) ->
			return pos1.row < pos2.row if pos1.row != pos2.row;
			return pos1.column < pos2.column;

		addPositionOffset : (pos, offset) ->
			return {row : pos.row, column : pos.column + offset}

		insertAtCursor : (text) -> @ace.insert(text);

		getLineIterator: (pos) ->
			session = @session;
			obj = 
				l : pos.row 
				c : pos.column
				getOffsetInLine : () -> @c
				getPos : () -> {row: @l, column : 0};
				getLine : () -> return session.getLine(@l);
				hasNext : () -> @l < session.getLength();
				hasPrevious : () -> @l > 0;
				getNext : () -> @l++; @c = 0; return @getLine();
				getPrevious : () -> @l--; @c = 0; return @getLine();
			return obj;

	AceTextAdapter
