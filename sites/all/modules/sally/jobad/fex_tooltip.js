(function($){JOBAD.modules.register({
    info: {
        'identifier': 'fex_tooltip',
        'title': 'Testing tooltip',
        'author': 'Alexandru Toader',
        'description': 'Show text of fields that overflow ',
        'hasCleanNamespace': false
    },
    hoverText: function(target){
        if((target.is("span.title-dependency") || target.is("span.title-text") || target.is("div.cell-iterator") || target.is("div.cell-value"))
            && target[0].scrollWidth> target.width()){
           return target.text();
       }
        },
});
})(JOBAD.refs.$);