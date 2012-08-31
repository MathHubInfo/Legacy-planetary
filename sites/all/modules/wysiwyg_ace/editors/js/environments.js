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
            "category": "Positioning",
            "template": "\\begin{center}\n\\end{center}"
        },
        {
        	"type" : "Environment",
        	"category" : "Semantic",
        	"label" : "importmodule",
        	"params" : {
        		"dictionary" : {"title" : "Module Path", "type" : "string", "required":true},
        		"symbol" : {"title" : "Symbol name", "type" : "string"}
        	},
        	"template" : "\\importmodule[<%=dictionary%>]{<%=symbol%>}"        	
        }
    ]
}
