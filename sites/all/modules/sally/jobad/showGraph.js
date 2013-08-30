(function($){JOBAD.modules.register({
    info: {
        'identifier': 'showGraph',
        'title': 'Show dependency graph',
        'author': 'Alexandru Toader',
        'description': 'Show the dependency graph of the selected item',
        'hasCleanNamespace': false
    },
    /**
    @base_path base path for the planetary installation
    @token string used to identify the workflow
    */
    init: function(JOBADInstance, base_path, token){
        this.localStore.set("base_path", base_path);
        this.localStore.set("token", token);    
     },
    contextMenuEntries: function (target) {
        var cd, symbol;
        var token = this.localStore.get("token");
        var base_path = this.localStore.get("base_path");
        if (target.is('span')) {
            cd = target.attr("omdoc:cd");
            symbol = target.attr("omdoc:name");
             if (target.is('.omdoc-term') && typeof(token) != 'undefined')
            return [
                ["Show dependency graph", function (element) {
                    window.open(base_path+"index.php?q=sally/semnav/" + cd + "/" + symbol + "/" + token, "_parent");
                }]
            ];
        }
       
    },
});
})(JOBAD.refs.$);

