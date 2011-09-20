//> This file is part of Ymacs, an Emacs-like editor for the Web
//> http://www.ymacs.org/
//>
//> Copyright (c) 2009-2011, Mihai Bazon, Dynarch.com.  All rights reserved.
//>
//> Redistribution and use in source and binary forms, with or without
//> modification, are permitted provided that the following conditions are
//> met:
//>
//>     * Redistributions of source code must retain the above copyright
//>       notice, this list of conditions and the following disclaimer.
//>
//>     * Redistributions in binary form must reproduce the above copyright
//>       notice, this list of conditions and the following disclaimer in
//>       the documentation and/or other materials provided with the
//>       distribution.
//>
//>     * Neither the name of Dynarch.com nor the names of its contributors
//>       may be used to endorse or promote products derived from this
//>       software without specific prior written permission.
//>
//> THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER AND ANY
//> EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//> IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
//> PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE
//> FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//> CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//> SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//> INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//> CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//> ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
//> THE POSSIBILITY OF SUCH DAMAGE.

// @require ymacs-tokenizer.js

/* -----[ This defines the tokenizer ]----- */

(function(){

        function isLetter(ch) {
                return ch.toLowerCase() != ch.toUpperCase();
        };

        function isCommandStart(ch) {
                return ch && (ch=='\\');
        };

        function isNameChar(ch) {
                return ch && (isLetter(ch) || /^[0-9_$]$/.test(ch));
        };

        var NONAME = "__NONAME__";
        
        var OPEN_PAREN = {
                "{" : "}",
                "[" : "]"
        };

        var CLOSE_PAREN = {
                "}" : "{",
                "]" : "["
        };

        function isOpenParen(ch) {
                return OPEN_PAREN[ch];
        };

        function isCloseParen(ch) {
                return CLOSE_PAREN[ch];
        };

        function STEX_PARSER(stream, tok) {

                var $cont = [],
                    $parens = [],
                    $passedParens = [],
                    $inComment = null,
                    $env = [],
                    $pEnv = [],
                    PARSER = {
                            next        : next,
                            copy        : copy,
                            indentation : indentation
                    };

                function INDENT_LEVEL() {
                        return stream.buffer.getq("indent_level");
                };

                function copy() {
                        var context = restore.context = {
                                cont         : $cont.slice(0),
                                inComment    : $inComment,
                                env          : $env.slice(0),
                                pEnv	     : $pEnv.slice(0),
                                parens       : $parens.slice(0),
                                passedParens : $passedParens.slice(0)
                        };
                        function restore() {
                                $cont          = context.cont.slice(0);
                                $inComment     = context.inComment;
                                $parens        = context.parens.slice(0);
                                $passedParens  = context.passedParens.slice(0);
                                $env           = context.env.slice(0);
                                $pEnv	       = context.pEnv.slice(0);
                                return PARSER;
                        };
                        return restore;
                };

                function foundToken(c1, c2, type) {
                        tok.onToken(stream.line, c1, c2, type);
                };

                function readCommandName() {
                        var col = stream.col, ch = stream.get(),
                        name = "";
                        while (!stream.eol()) {
                                ch = stream.peek();
                                if (!isNameChar(ch)) {
                                	if (name.length == 0) {
                                		name = stream.get();
                                	}
                                	break;
                                }
                                name += ch;
                                stream.nextCol();
                        }
                        return ch && { line: stream.line, c1: col, c2: stream.col, id: name };
                };

	        function pushParan(ch) {
                    $parens.push({ line: stream.line, col: stream.col, type: ch });
                    foundToken(stream.col, ++stream.col, "open-paren");    
		}

                function getArgs() {
                        stream.checkStop();
                        var ch = stream.peek();
                        if (m = stream.lookingAt(/^\s+$/)) {
                        	foundToken(stream.col, stream.col += m[0].length, "trailing-whitespace");
                        } else
                        if (isOpenParen(ch)) {
                        	$cont.push(normal);
                        	pushParan(ch);
                        } else {
                        	$pEnv.pop();
                        	$cont.pop();
                        }
                }
                
                function normal() {
                        var ch = stream.peek(), m, tmp;
                        if (stream.lookingAt("%")) {
                                foundToken(stream.col, stream.col +=1, "comment-starter");
                                foundToken(stream.col, stream.col = stream.lineLength(), "comment");
                        }
                        else if ((m = stream.lookingAt(/^0x[0-9a-f]+|^[0-9]*\.?[0-9]+/))) {
                                foundToken(stream.col, stream.col += m[0].length, "number");
                        }
                        else if (isCommandStart(ch) && (tmp = readCommandName())) {
                        	if (name.length==1 && !isNameChar(name[0])) {
                        		 // escaping or opening math mode
                        		 foundToken(tmp.c1, tmp.c2, "keyword");
                        	}
                        	// some command
                        	$pEnv.push(tmp.id);
                            $cont.push(getArgs);
                        	foundToken(tmp.c1, tmp.c2, "keyword");
                        }
                        else if ((tmp = isOpenParen(ch))) {
                        	$pEnv.push(NONAME);
                        	pushParan(ch);
                        	$cont.push(normal);
                        }
                        else if ((tmp = isCloseParen(ch))) {
                                var p = $parens.pop();
                                if (!p || p.type != tmp) {
                                        foundToken(stream.col, ++stream.col, "error");
                                } else {
                                        // circular reference; poor browsers will leak.  mwuhahahaha
                                        p.closed = { line: stream.line, col: stream.col, opened: p };
                                        $passedParens.push(p);
                                        var t = $pEnv[$pEnv.length-1];
                                        if (t==NONAME) {
                                        	$pEnv.pop();
                                        }
                                        foundToken(stream.col, ++stream.col, "close-paren");
                                        if ($cont.length > 0)
                                        	$cont.pop();
                                        return;
                                }
                        }
                        else if ((m = stream.lookingAt(/^\s+/))) {
                                foundToken(stream.col, stream.col += m[0].length, null);
                        }
                        else {
			    var r = $pEnv[$pEnv.length-1];
                            foundToken(stream.col, ++stream.col, r);
                        }
                }
                
                function next() {
                        stream.checkStop();
                        if ($cont.length > 0)
                        	return $cont.peek()();
                        else
                        	return normal();	
                };

                function indentation() {
                        var row = stream.line;
                        var currentLine = stream.lineText();
                        var indent = 0;

                        if ($inComment) {
                                var commentStartLine = stream.lineText($inComment.line);
                                indent = $inComment.c1 + 1;
                                if (!/^\s*\*/.test(currentLine)) {
                                        // align with the first non-whitespace and non-asterisk character in the comment
                                        var re = /[^\s*]/g;
                                        re.lastIndex = $inComment.c1 + 1;
                                        var m = re.exec(commentStartLine);
                                        if (m)
                                                indent = m.index;
                                }
                                return indent;
                        }

                        var p = $parens.peek();
                        if (p) {
                                // check if the current line closes the paren
                                var re = new RegExp("^\\s*\\" + OPEN_PAREN[p.type]);
                                var thisLineCloses = re.test(currentLine);

                                // Check if there is text after the opening paren.  If so, indent to that column.
                                var line = stream.lineText(p.line);
                                re = /\S/g;
                                re.lastIndex = p.col + 1;
                                var m = re.exec(line);
                                if (m) {
                                        // but if this line closes the paren, better use the column of the open paren
                                        indent = thisLineCloses ? p.col : m.index;
                                }
                                else {
                                        // Otherwise we should indent to one level more than the indentation of the line
                                        // containing the opening paren.
                                        indent = stream.lineIndentation(p.line) + INDENT_LEVEL();

                                        // but if this line closes the paren, then back one level
                                        if (thisLineCloses)
                                                indent -= INDENT_LEVEL();
                                }
                        }

                        // Some more adjustments for continued statements.  Since we don't really have a
                        // rigorous parser, we have to rely on other regexps here, which sucks but will do for
                        // now.

                        if (row > 0) {
                                var before = stream.textBefore();
                                if (/\)\s*$/.test(before) && $passedParens.length > 0) {
                                        // Ends in a paren, could be an if, while or for which demands smart
                                        // indentation on the current line, let's check it out.

                                        // Note that the passedParen saved for that close paren is actually
                                        // the opening one, which suits us greatly.
                                        p = $passedParens.peek();
                                        var stmtLine = stream.lineText(p.line);
                                        if (/^\s*(if|for|while)\W/.test(stmtLine))
                                                indent += INDENT_LEVEL();
                                }
                                else if (/\Welse\s*$/.test(before)) {
                                        indent += INDENT_LEVEL();
                                }
                        }

                        // switch labels use half the indent level, which is my favorite
                        if (/^\s*(case|default)\W/.test(currentLine))
                                indent -= INDENT_LEVEL() / 2;

                        return indent;
                };

                return PARSER;

        };

        Ymacs_Tokenizer.define("stex", STEX_PARSER.$C());

        /* -----[ DynarchLIB ]----- */

        Ymacs_Tokenizer.define("js-dynarchlib", STEX_PARSER.$C());

})();

/* -----[ Keymap for C-like language mode ]----- */

DEFINE_SINGLETON("Ymacs_Keymap_CLanguages", Ymacs_Keymap, function(D, P){

        D.KEYS = {
                "ENTER"                                     : "newline_and_indent",
                "} && ) && ] && : && ; && { && ( && [ && *" : "c_insert_and_indent"
                // "{"                                      : "c_electric_block"
        };

});

/* -----[ Mode entry point ]----- */

Ymacs_Buffer.newMode("stex_mode", function(useDL) {
        var tok = this.tokenizer;
        var keymap = Ymacs_Keymap_CLanguages();
        this.setTokenizer(new Ymacs_Tokenizer({ buffer: this, type: "stex"} ));
        this.pushKeymap(keymap);
        var was_paren_match = this.cmd("paren_match_mode", true);

        return function() {
                this.setTokenizer(tok);
                this.popKeymap(keymap);
                if (!was_paren_match)
                        this.cmd("paren_match_mode", false);
        };

});

function wrap_text(ybuff, start, finish) {
	
/*    if (this.__preventUndo == 0)
        this._recordChange(1, pos, text.length); */
	for (i=start; i<=finish; ++i) {
		ybuff._replaceLine(i, i+" "+ybuff.code[i]);
	}
	ybuff.redrawDirtyLines();
}

Ymacs_Buffer.newCommands({

        stex_dl_mode: Ymacs_Interactive(function() {
                return this.cmd("stex_mode", true);
        }),

        c_electric_block: Ymacs_Interactive(function() {
                this.cmd("indent_line");
                this.cmd("insert", "{\n\n}");
                this.cmd("indent_line");
                this.cmd("backward_line", 1);
                this.cmd("indent_line");
        }),

        c_insert_and_indent: Ymacs_Interactive(function() {
                var ret;
                if ((ret = this.cmd("self_insert_command"))) {
                        this.cmd("indent_line");
                        return ret;
                }
        }),
        
        stex_wrap_buffer: Ymacs_Interactive(function() {
        	wrap_text(this, 0, this.code.length-1);
        }),

        stex_replace_tex: Ymacs_Interactive(function() {
        	
        }),

        
        stex_wrap_paragraph: Ymacs_Interactive(function() {
        	
        })   
        

});
