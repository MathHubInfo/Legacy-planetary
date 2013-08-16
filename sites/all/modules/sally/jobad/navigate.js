(function($){
    JOBAD.modules.register({
        info: {
            'identifier': 'navigate',
            'title': 'Show dependency graph',
            'author': 'Alexandru Toader',
            'description': 'Show the dependency graph of the selected item',
            'hasCleanNamespace': false
        },
        /**
    @base_path base path for the planetary installation
    @token string used to identify the workflow
    @context Context message containing all the available cd/name pairs in the current document
    */
        init: function (JOBADInstance, base_path, token, context) {
            this.localStore.set("base_path", base_path);
            this.localStore.set("token", token);
            this.localStore.set("context", context);
        },
        contextMenuEntries: function (target) {
            var message = this.localStore.get("context");
            var base_path = this.localStore.get("base_path");
            var token = this.localStore.get("token");
            var i = 0;
            while (true) {
                if (typeof message.context[i] == 'undefined')
                    break;
                if (target.is('span') && target.is('.omdoc-term') && target.attr('omdoc:cd') == message.context[i].theory && target.attr('omdoc:name') == message.context[i].symbol)
                    return [
                    ["Show cell in spreadsheet",
                        function () {
                            if (Communication.isActive()) {
                                var token = this.localStore.get("token");
                                var term = new sally.OntologyItem;
                                term.theory = target.attr("omdoc:cd");
                                term.symbol = target.attr("omdoc:name");
                                var message = new sally.TheoNavigateTo;
                                message.term = term;
                                message.actionId = token;
                                Communication.sendMessage(message);
                            }
                        }
                    ]];
                i++;
            }

        },
    });
})(JOBAD.refs.$);