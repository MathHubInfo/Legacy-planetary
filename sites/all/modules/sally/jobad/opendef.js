(function($){
    JOBAD.modules.register({
    info: {
        'identifier': 'opendef',
        'title': 'Open definition',
        'author': 'Alexandru Toader',
        'description': 'Open the definition of the selected ontology item',
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
        } else if (target.is('div')) {
            var aux = target.attr('id');
            aux = aux.substring(aux.lastIndexOf("/") + 1);
            cd = aux.substring(0, aux.indexOf(".omdoc"));
            symbol = aux.substring(aux.indexOf("#") + 1, aux.lastIndexOf(".def"));
        }
        if ((target.is('.omdoc-term') || target.attr('class') == 'node') && typeof(token) != 'undefined')
            return { 
                "Look-up definition": function(element) {
                    window.open(base_path + "index.php?q=sally/showdef/" + cd + "/" + symbol + "/" + token, "_parent");
                }
            }
            
    },
});
})(JOBAD.refs.$);
