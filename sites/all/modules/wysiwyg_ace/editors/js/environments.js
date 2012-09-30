{
    "types": {
        "Environment": {
            "pluralLabel": "Environments"
        }
    },
    "items": [
        {
            "type": "Environment",
            "description": "Math arrays are produced with the array environment. It has a single mandatory argument describing the number of columns and the alignment within them. Each column, coln, is specified by a single letter that tells how items in that row should be formatted.",
            "label": "array",
            "category": "Tables",
            "params": {
                "n": {
                    "title": "Number of columns",
                    "type": "number",
                    "default": 3
                },
                "align": {
                    "title": "Alignment",
                    "type": "string",
                    "default": "l"
                }
            },
            "template": "\\begin{array}{<% for(var i=0;i<n;i++){%><%=align%><%}%>} \n <% for(var i=0;i<n-1;i++){%> & <%}%> \n\\end{array}"
        },
        {
            "type": "Environment",
            "description": "The center environment allows you to create a paragraph consisting of lines that are centered within the left and right margins on the current page. Each line must be terminated with the string.",
            "label": "center",
            "category": "Alignment",
            "template": "\\begin{center}\n\\end{center}"
        },
        {
            "type": "Environment",
            "description": "The flushright environment allows you to create a paragraph consisting of lines that are flushed right to the right-hand margin. Each line must be terminated with the string.",
            "label": "flushright",
            "category": "Alignment",
            "template": "\\begin{flushright}\n\\end{flushright}"
        },
        {
            "type": "Environment",
            "description": "The flushleft environment allows you to create a paragraph consisting of lines that are flushed left to the left-hand margin. Each line must be terminated with the string.",
            "label": "flushleft",
            "category": "Alignment",
            "template": "\\begin{flushleft}\n\\end{flushleft}"
        },
        {
            "type": "Environment",
            "description": "The description environment is used to make labeled lists. The label is bold face and flushed right.",
            "label": "description",
            "category": "Listings",
            "template": "\\begin{description}\n\n\\end{description}"
        },
        {
            "type": "Environment",
            "description": "The enumerate environment produces a numbered list. Enumerations can be nested within one another, up to four levels deep. They can also be nested within other paragraph-making environments.",
            "label": "enumerate",
            "category": "Listings",
            "template": "\\begin{enumerate}\n\\item\n\\end{enumerate}"
        },
        {
            "type": "Environment",
            "description": "The itemize environment produces a bulleted list. Itemizations can be nested within one another, up to four levels deep. They can also be nested within other paragraph-making environments.",
            "label": "itemize",
            "category": "Listings",
            "template": "\\begin{itemize}\n\\item\n\\end{itemize}"
        },
        {
            "type": "Environment",
            "description": "The itemize environment produces a bulleted list. Itemizations can be nested within one another, up to four levels deep. They can also be nested within other paragraph-making environments.",
            "label": "list",
            "category": "Listings",
            "template": "\\begin{list}{<%=label%>}{<%=spacing%>}\n\\item\n\\end{list}",
            "params": {
                "label": {
                    "title": "How should items be labeled? (this argument is a piece of text that is inserted in a box to form the label)",
                    "type": "string",
                    "default": "*"
                },
                "spacing": {
                    "title": "Commands to change the spacing parameters for the list",
                    "type": "string",
                    "default": ""
                }
            }
        },
        {
            "type": "Environment",
            "description": "The eqnarray environment is used to display a sequence of equations or inequalities. It is very much like a three-column array environment, with consecutive rows separated by \\ and consecutive items within a row separated by an &. An equation number is placed on every line unless that line has a \nonumber command.",
            "label": "eqnarray",
            "category": "Math",
            "template": "\\begin{eqnarray}\n\n\\end{eqnarray}"
        },
        {
            "type": "Environment",
            "description": "The equation environment centers your equation on the page and places the equation number in the right margin. Using equation* does not produce equation number.",
            "label": "equation",
            "category": "Math",
            "template": "\\begin{equation}\n\n\\end{equation}"
        },
        {
            "label": "figure",
            "description": "Figures are objects that are not part of the normal text, and are usually 'floated' to a convenient place, like the top of a page. Figures will not be split between two pages.",
            "template": "\\begin{figure}[<%=align%>]\n\\caption{<%=title%>}\n\\end{figure}",
            "category": "Boxes",
            "type": "Environment",
            "params": {
                "align": {
                    "title": "Where LaTeX will try to place your figure",
                    "type": "string",
                    "enum": [
                        "h",
                        "t",
                        "b",
                        "p"
                    ]
                },
                "title": {
                    "title": "Figure title",
                    "type": "string",
                    "default": ""
                }
            }
        },
        {
            "label": "minipage",
            "description": "The minipage environment is similar to a \\parbox command. It takes the same optional position argument and mandatory width argument. You may use other paragraph-making environments inside a minipage.",
            "template": "\\begin{minipage}[<%=align%>]\n\\end{minipage}",
            "category": "Boxes",
            "type": "Environment",
            "params": {
                "align": {
                    "title": "Where LaTeX will try to place your figure",
                    "type": "string",
                    "enum": [
                        "h",
                        "t",
                        "b",
                        "p"
                    ]
                }
            }
        },
        {
            "label": "picture",
            "description": "The picture environment allows you to create just about any kind of picture you want containing text, lines, arrows and circles. You tell LaTeX where to put things in the picture by specifying their coordinates. A coordinate is a number that may have a decimal point and a minus sign - a number like 5, 2.3 or -3.1416. A coordinate specifies a length in multiples of the unit length \\unitlength, so if \\unitlength has been set to 1cm, then the coordinate 2.54 specifies a length of 2.54 centimeters. You can change the value of \\unitlength anywhere you want, using the \\setlength command, but strange things will happen if you try changing it inside the picture environment.",
            "template": "\\begin{picture}(<%=width%>, <%=height%>)(<%=xoffset%>, <%=yoffset%>)\n\\end{picture}",
            "category": "Boxes",
            "type": "Environment",
            "params": {
                "width": {
                    "title": "Picture width",
                    "type": "string",
                    "default": "0px"
                },
                "height": {
                    "title": "Picture height",
                    "type": "string",
                    "default": "0px"
                },
                "xoffset": {
                    "title": "Picture x offset",
                    "type": "string",
                    "default": "0px"
                },
                "yoffset": {
                    "title": "Picture y offset",
                    "type": "string",
                    "default": "0px"
                }
            }
        },
        {
            "type": "Environment",
            "description": "The margins of the quotation environment are indented on the left and the right. The text is justified at both margins and there is paragraph indentation. Leaving a blank line between text produces a new paragraph.",
            "label": "quotation",
            "category": "Quotes",
            "template": "\\begin{quotation}\n\n\\end{quotation}"
        },
        {
            "type": "Environment",
            "description": "The margins of the quote environment are indented on the left and the right. The text is justified at both margins. Leaving a blank line between text produces a new paragraph.",
            "label": "quote",
            "category": "Quotes",
            "template": "\\begin{quote}\n\n\\end{quote}"
        },
        {
            "type": "Environment",
            "description": "The tabbing environment provides a way to align text in columns. It works by setting tab stops and tabbing to them much the way you do with an ordinary typewriter.",
            "label": "tabbing",
            "category": "Quotes",
            "template": "\\begin{tabbing}\n\n\\end{tabbing}"
        }
    ]
}
