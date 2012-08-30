/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * Starting using Exhibit.jQuery instead of jQuery or $
 */
Exhibit.jQuery = jQuery.noConflict();

/**
 * @static
 * @param {Exhibit.Database} database
 * @returns {Exhibit._Impl}
 */
Exhibit.create = function(database) {
    return new Exhibit._Impl(database);
};

/**
 * Check for instances of ex:role and throw into backwards compatibility
 * mode if any are found.  Authors are responsible for converting or using
 * the HTML5 attributes correctly; backwards compatibility is only applicable
 * when used with unconverted Exhibits.
 * @static
 * @see Exhibit.Backwards
 */
Exhibit.checkBackwardsCompatibility = function() {
    var exroles;
    exroles = Exhibit.jQuery("*").filter(function() {
        return typeof Exhibit.jQuery(this).attr("ex:role") !== "undefined";
    });
    if (exroles.length > 0) {
        Exhibit.Backwards.enable("Attributes");
    }
};

/**
 * Retrieve an Exhibit-specific attribute from an element.
 *
 * @static
 * @param {jQuery|Element} elmt
 * @param {String} name Full attribute name or Exhibit attribute (without any
 *    prefix), e.g., "id" or "itemTypes".  "item-types" or "data-ex-item-types"
 *    are equivalent to "itemTypes", but "itemTypes" is the preferred form.
 * @param {String} splitOn Separator character to split a string
 *    representation into several values.  Returns an array if used.
 * @returns {String|Array}
 */
Exhibit.getAttribute = function(elmt, name, splitOn) {
    var value, i, values;

    try {
        value = Exhibit.jQuery(elmt).attr(name);
        if (typeof value === "undefined" || value === null || value.length === 0) {
            value = Exhibit.jQuery(elmt).data("ex-"+name);
            if (typeof value === "undefined" || value === null || value.length === 0) {
                return null;
            }
        }
        if (typeof value.toString !== "undefined") {
            value = value.toString();
        }
        if (typeof splitOn === "undefined" || splitOn === null) {
            return value;
        }
        values = value.split(splitOn);
        for (i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    } catch(e) {
        return null;
    }
};

/**
 * @static
 * @param {Element} elmt
 * @returns {String}
 */
Exhibit.getRoleAttribute = function(elmt) {
    var role = Exhibit.getAttribute(elmt, "role") || "";
    if (typeof role === "object") {
        role = role[0];
    }
    role = role.replace(/^exhibit-/, "");
    return role;
};

/**
 * Process a DOM element's attribute name to see if it is an Exhibit
 * attribute.
 * @static
 * @param {String} name
 * @returns {Boolean}
 */
Exhibit.isExhibitAttribute = function(name) {
    return name.length > "data-ex-".length
        && name.startsWith("data-ex-");
};

/**
 * Process a DOM element's attribute and convert it into the name Exhibit
 * uses internally.
 * @static
 * @param {String} name
 * @returns {String}
 */
Exhibit.extractAttributeName = function(name) {
    return name.substr("data-ex-".length);
};

/**
 * Turn an internal attribute name into something that can be inserted into
 * the DOM and correctly re-extracted later as an Exhibit attribute.
 * @static
 * @param {String} name
 */
Exhibit.makeExhibitAttribute = function(name) {
    var exname;
    switch (name) {
        case "itemID":
            exname = "itemid";
            break;
        default:
            exname = "data-ex-" + name.replace(/([A-Z])/g, "-$1").toLowerCase();
            break;
    }
    return exname;
};

/**
 * @static
 * @param {Element} elmt
 * @returns {Object}
 */
Exhibit.getConfigurationFromDOM = function(elmt) {
    var c, o;
    c = Exhibit.getAttribute(elmt, "configuration");
    if (typeof c !== "undefined" && c !== null && c.length > 0) {
        try{
            o = eval(c);
            if (typeof o === "object") {
                return o;
            }
        } catch (e) {}
    }
    return {};
};

/**
 * This method is not commonly used.  Consider using Exhibit.SettingsUtilties.
 * @deprecated
 * @static
 * @param {Element} elmt
 * @returns {Object}
 */
Exhibit.extractOptionsFromElement = function(elmt) {
    var opts, dataset, i;
    opts = {};
    dataset = Exhibit.jQuery(elmt).data();
    for (i in dataset) {
        if (dataset.hasOwnProperty(i)) {
            if (i.startsWith("ex")) {
                opts[i.substring(2)] = dataset[i];
            } else {
                opts[i] = dataset[i];
            }
        }
    }
    return opts;
};

/**
 * @public
 * @class
 * @constructor
 * @param {Exhibit.Database} database
 */
Exhibit._Impl = function(database) {
    this._database = (database !== null && typeof database !== "undefined") ? 
        database : 
        (typeof window["database"] !== "undefined" ?
            window.database :
            Exhibit.Database.create());
            
    this._uiContext = Exhibit.UIContext.createRootContext({}, this);
    this._registry = new Exhibit.Registry();
    Exhibit.jQuery(document).trigger("registerComponents.exhibit", this._registry);
    this._collectionMap = {};
};

/**
 * 
 */
Exhibit._Impl.prototype.dispose = function() {
    var id;

    for (id in this._collectionMap) {
        if (this._collectionMap.hasOwnProperty(id)) {
            try {
                this._collectionMap[id].dispose();
            } catch(ex2) {
                Exhibit.Debug.exception(ex2, Exhibit._("%general.error.disposeCollection"));
            }
        }
    }
    
    this._uiContext.dispose();
    
    this._collectionMap = null;
    this._uiContext = null;
    this._database = null;
    this._registry.dispose();
    this._registry = null;
};

/**
 * @returns {Exhibit.Database}
 */
Exhibit._Impl.prototype.getDatabase = function() {
    return this._database;
};

/**
 * @returns {Exhibit.Registry}
 */
Exhibit._Impl.prototype.getRegistry = function() {
    return this._registry;
};

/**
 * @returns {Exhibit.UIContext}
 */
Exhibit._Impl.prototype.getUIContext = function() {
    return this._uiContext;
};

/**
 * @param {String} id
 * @returns {Exhibit.Collection}
 */
Exhibit._Impl.prototype.getCollection = function(id) {
    var collection = this._collectionMap[id];
    if ((typeof collection === "undefined" || collection === null) && id === "default") {
        collection = Exhibit.Collection.createAllItemsCollection(id, this._database);
        this.setDefaultCollection(collection);
    }
    return collection;
};

/**
 * @returns {Exhibit.Collection}
 */
Exhibit._Impl.prototype.getDefaultCollection = function() {
    return this.getCollection("default");
};

/**
 * @param {String} id
 * @param {Exhibit.Collection} c
 */
Exhibit._Impl.prototype.setCollection = function(id, c) {
    if (typeof this._collectionMap[id] !== "undefined") {
        try {
            this._collectionMap[id].dispose();
        } catch(e) {
            Exhibit.Debug.exception(e);
        }
    }
    this._collectionMap[id] = c;
};

/**
 * @param {Exhibit.Collection} c
 */
Exhibit._Impl.prototype.setDefaultCollection = function(c) {
    this.setCollection("default", c);
};

/**
 * @param {String} id
 * @returns {Object}
 */
Exhibit._Impl.prototype.getComponent = function(id) {
    return this.getRegistry().getID(id);
};

/**
 * @param {Object} configuration
 */
Exhibit._Impl.prototype.configure = function(configuration) {
    var i, config, id;
    if (typeof configuration["collections"] !== "undefined") {
        for (i = 0; i < configuration.collections.length; i++) {
            config = configuration.collections[i];
            id = config.id;
            if (typeof id === "undefined" || id === null || id.length === 0) {
                id = "default";
            }
            this.setCollection(id, Exhibit.Collection.create2(id, config, this._uiContext));
        }
    }
    if (typeof configuration["components"] !== "undefined") {
        for (i = 0; i < configuration.components.length; i++) {
            config = configuration.components[i];
            component = Exhibit.UI.create(config, config.elmt, this._uiContext);
        }
    }
};

/**
 * Set up this Exhibit's view from its DOM configuration.
 * @param {Node} [root] optional root node, below which configuration gets read
 *                      (defaults to document.body, when none provided)
 */
Exhibit._Impl.prototype.configureFromDOM = function(root) {
    var controlPanelElmts, collectionElmts, coderElmts, coordinatorElmts, lensElmts, facetElmts, otherElmts, f, uiContext, i, elmt, id, self, processElmts, exporters, expr, exporter, hash, itemID;

    collectionElmts = [];
    coderElmts = [];
    coordinatorElmts = [];
    lensElmts = [];
    facetElmts = [];
    controlPanelElmts = [];
    otherElmts = [];

    f = function(elmt) {
        var role, node;
        role = Exhibit.getRoleAttribute(elmt);
        if (role.length > 0) {
            switch (role) {
            case "collection":  collectionElmts.push(elmt); break;
            case "coder":       coderElmts.push(elmt); break;
            case "coordinator": coordinatorElmts.push(elmt); break;
            case "lens":
            case "submission-lens":
            case "edit-lens":   lensElmts.push(elmt); break;
            case "facet":       facetElmts.push(elmt); break;
            case "controlPanel": controlPanelElmts.push(elmt); break;
            default: 
                otherElmts.push(elmt);
            }
        } else {
            node = elmt.firstChild;
            while (typeof node !== "undefined" && node !== null) {
                if (node.nodeType === 1) {
                    f(node);
                }
                node = node.nextSibling;
            }
        }
    };
    f(root || document.body);
    
    uiContext = this._uiContext;
    for (i = 0; i < collectionElmts.length; i++) {
        elmt = collectionElmts[i];
        id = elmt.id;
        if (typeof id === "undefined" || id === null || id.length === 0) {
            id = "default";
        }
        this.setCollection(id, Exhibit.Collection.createFromDOM2(id, elmt, uiContext));
    }
    
    self = this;
    processElmts = function(elmts) {
        var i, elmt;
        for (i = 0; i < elmts.length; i++) {
            elmt = elmts[i];
            try {
                Exhibit.UI.createFromDOM(elmt, uiContext);
            } catch (ex1) {
                Exhibit.Debug.exception(ex1);
            }
        }
    };

    processElmts(coordinatorElmts);
    processElmts(coderElmts);
    processElmts(lensElmts);
    processElmts(facetElmts);

    if (controlPanelElmts.length === 0) {
        panel = Exhibit.ControlPanel.createFromDOM(
            Exhibit.jQuery("<div>").prependTo(document.body),
            null,
            uiContext
        );
        panel.setCreatedAsDefault();
    } else {
        processElmts(controlPanelElmts);
    }

    processElmts(otherElmts);
    
    exporters = Exhibit.getAttribute(document.body, "exporters");
    if (typeof exporters !== "undefined" && exporters !== null) {
        exporters = exporters.split(";");
        for (i = 0; i < exporters.length; i++) {
            expr = exporters[i];
            exporter = null;
            
            try {
                exporter = eval(expr);
            } catch (ex2) {}
            
            if (exporter === null) {
                try { exporter = eval(expr + "Exporter"); } catch (ex3) {}
            }
            
            if (exporter === null) {
                try { exporter = eval("Exhibit." + expr + "Exporter"); } catch (ex4) {}
            }
            
            if (typeof exporter === "object") {
                Exhibit.addExporter(exporter);
            }
        }
    }
    
    hash = document.location.hash;
    if (hash.length > 1) {
        itemID = decodeURIComponent(hash.substr(1));
        if (this._database.containsItem(itemID)) {
            this._showFocusDialogOnItem(itemID);
        }
    }
    Exhibit.jQuery(document).trigger("exhibitConfigured.exhibit", this);
};

/**
 * @private
 * @param {String} itemID
 */
Exhibit._Impl.prototype._showFocusDialogOnItem = function(itemID) {
    var dom, itemLens;
    dom = Exhibit.jQuery.simileDOM("string",
        "div",
        "<div class='exhibit-focusDialog-viewContainer' id='lensContainer'>" +
        "</div>" +
        "<div class='exhibit-focusDialog-controls'>" +
            "<button id='closeButton'>" + 
                      Exhibit._("%export.focusDialogBoxCloseButtonLabel") + 
            "</button>" +
        "</div>"
    );
    Exhibit.jQuery(dom.elmt).attr("class", "exhibit-focusDialog exhibit-ui-protection");
    Exhibit.UI.setupDialog(dom, true);
    
    itemLens = this._uiContext.getLensRegistry().createLens(itemID, dom.lensContainer, this._uiContext);
    
    Exhibit.jQuery(dom.elmt).css("top", (document.body.scrollTop + 100) + "px");
    Exhibit.jQuery(document.body).append(Exhibit.jQuery(dom.elmt));
    Exhibit.jQuery(document).trigger("modalSuperseded.exhibit");

    Exhibit.jQuery(dom.closeButton).bind("click", function(evt) {
        dom.close();
    });
};
/**
 * @fileOverview General backwards compatibility material.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Backwards = {
    "enabled": {
        "Attributes": false
    }
};

/**
 * Enable a backwards compatibility module.
 * @param {String} module
 */
Exhibit.Backwards.enable = function(module) {
    Exhibit.Backwards[module].enable();
};
/**
 * @fileOverview Methods for handling older Exhibit attribute styles. Only
 *     load if the page-based config seems to contain a namespace / attributes
 *     that reflect the old style (e.g., ex:role) instead of the new style.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Backwards.Attributes = {
    "prefix": "ex:"
};

/**
 * Call to switch Exhibit into backwards compatibility mode for Exhibit
 * attributes.
 * @static
 */
Exhibit.Backwards.Attributes.enable = function() {
    Exhibit.Backwards.enabled.Attributes = true;
    Exhibit.getAttribute = Exhibit.Backwards.Attributes.getAttribute;
    Exhibit.extractOptionsFromElement = Exhibit.Backwards.Attributes.extractOptionsFromElement;
    Exhibit.isExhibitAttribute = Exhibit.Backwards.Attributes.isExhibitAttribute;
    Exhibit.makeExhibitAttribute = Exhibit.Backwards.Attributes.makeExhibitAttribute;
    Exhibit.extractAttributeName = Exhibit.Backwards.Attributes.extractAttributeName;
};

/**
 * A backwards compatible mechanism for retrieving an Exhibit attribute value.
 * @static
 * @param {jQuery|Element} elmt
 * @param {String} name
 * @param {String} splitOn
 * @returns {String|Array}
 */
Exhibit.Backwards.Attributes.getAttribute = function(elmt, name, splitOn) {
    var value, i, values;

    try {
        value = Exhibit.jQuery(elmt).attr(name);
        if (typeof value === "undefined" || value === null || value.length === 0) {
            value = Exhibit.jQuery(elmt).attr(Exhibit.Backwards.Attributes.prefix+name);
            if (typeof value === "undefined" || value === null || value.length === 0) {
                return null;
            }
        }
        if (typeof splitOn === "undefined" || splitOn === null) {
            return value;
        }
        values = value.split(splitOn);
        for (i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
        }
        return values;
    } catch(e) {
        return null;
    }
};

/**
 * A backwards compatible mechanism for retrieving all Exhibit attributes
 * on an element.
 * @static
 * @param {Element} elmt
 * @returns {Object}
 */
Exhibit.Backwards.Attributes.extractOptionsFromElement = function(elmt) {
    var opts, attrs, i, name, value;
    opts = {};
    attrs = elmt.attributes;
    for (i in attrs) {
        if (attrs.hasOwnProperty(i)) {
            name = attrs[i].nodeName;
            value = attrs[i].nodeValue;
            if (name.indexOf(Exhibit.Backwards.Attributes.prefix) === 0) {
                name = name.substring(Exhibit.Backwards.Attributes.prefix.length);
            }
            opts[name] = value;
        }
    }
    return opts;
};

/**
 * @static
 * @param {String} name
 * @returns {Boolean}
 */
Exhibit.Backwards.Attributes.isExhibitAttribute = function(name) {
    var prefix = Exhibit.Backwards.Attributes.prefix;
    return name.length > prefix.length
        && name.startsWith(prefix);
};

/**
 * @static
 * @param {String} name
 */
Exhibit.Backwards.Attributes.extractAttributeName = function(name) {
    return name.substr(Exhibit.Backwards.Attributes.prefix.length);
};

/**
 * @static
 * @param {String} name
 * @returns {String}
 */
Exhibit.Backwards.Attributes.makeExhibitAttribute = function(name) {
    return Exhibit.Backwards.Attributes.prefix + name;
};
/**
 * @fileOverview Centralized component registry for easier API access.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 * @class
 */
Exhibit.Registry = function(isStatic) {
    this._registry = {};
    this._idCache = {};
    this._components = [];
    this._isStatic = (typeof isStatic !== "undefined" && isStatic !== null) ?
        isStatic :
        false;
};

Exhibit.Registry.prototype.isStatic = function() {
    return this._isStatic;
};

/**
 * @param {String} component
 * @returns {Boolean}
 */
Exhibit.Registry.prototype.createRegistry = function(component) {
    this._registry[component] = {};
    this._components.push(component);
};

/**
 * @returns {Array}
 */
Exhibit.Registry.prototype.components = function() {
    return this._components;
};

/**
 * @param {String} component
 * @returns {Boolean}
 */
Exhibit.Registry.prototype.hasRegistry = function(component) {
    return typeof this._registry[component] !== "undefined";
};

/**
 * @param {String} component
 * @returns {Number}
 */
Exhibit.Registry.prototype.generateIdentifier = function(component) {
    var branch, key, size;
    size = 0;
    branch = this._registry[component];
    if (typeof branch !== "undefined") {
        for (key in branch) {
            if (branch.hasOwnProperty(key)) {
                size++;
            }
        }
    } else {
        throw new Error(Exhibit._("%registry.error.noSuchRegistry", component));
    }
    return size;
};

/**
 * @param {String} component
 * @param {String} id
 * @returns {Boolean}
 */
Exhibit.Registry.prototype.isRegistered = function(component, id) {
    return (this.hasRegistry(component) &&
            typeof this._registry[component][id] !== "undefined");
};

/**
 * @param {String} component
 * @param {String} id
 * @param {Object} handler
 * @returns {Boolean}
 */
Exhibit.Registry.prototype.register = function(component, id, handler) {
    if (!this.isRegistered(component, id)) {
        this._registry[component][id] = handler;
        if (!this.isStatic() && typeof this._idCache[id] === "undefined") {
            this._idCache[id] = handler;
        }
        return true;
    } else {
        return false;
    }
};

/**
 * @param {String} component
 * @returns {Object}
 */
Exhibit.Registry.prototype.componentHandlers = function(component) {
    if (this.hasRegistry(component)) {
        return this._registry[component];
    } else {
        return null;
    }
};

/**
 * @param {String} component
 * @returns {Array}
 */
Exhibit.Registry.prototype.getKeys = function(component) {
    var hash, key, keys;
    hash = this._registry[component];
    keys = [];
    for (key in hash) {
        if (hash.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
};

/**
 * Called when both the type of component and its ID are known to retrieve
 * the object associated with both.
 *
 * @param {String} component
 * @param {String} id
 * @returns {Object}
 * @see Exhibit.Registry.prototype.getID
 */
Exhibit.Registry.prototype.get = function(component, id) {
    if (this.isRegistered(component, id)) {
        return this._registry[component][id];
    } else {
        return null;
    }
};

/**
 * Called when the component type cannot be specified at the time of
 * calling but the ID is expected to exist.  Will always return null
 * for a static registry.
 *
 * @param {String} id
 * @returns {Object}
 * @see Exhibit.Registry.prototype.get
 */
Exhibit.Registry.prototype.getID = function(id) {
    if (!this.isStatic()) {
        if (typeof this._idCache[id] !== "undefined") {
            return this._idCache[id];
        }
    }
    return null;
};

/**
 * Typically called from within a dispose() method, removes component
 * from Exhibit's awareness, and the handler should be garbage collected.
 *
 * @param {String} component
 * @param {String} id
 * @returns {Boolean}
 */
Exhibit.Registry.prototype.unregister = function(component, id) {
    var c;
    if (this.isRegistered(component, id)) {
        c = this.get(component, id);
        this._registry[component][id] = null;
        delete this._registry[component][id];
        if (!this.isStatic() && typeof this._idCache[id] !== "undefined") {
            this._idCache[id] = null;
            delete this._idCache[id];
        }
    }
};
/**
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @fileOverview Base for Exhibit utilities and native datatype modifications.
 */

/**
 * @namespace For Exhibit utility classes and methods.
 */
Exhibit.Util = {};

/**
 * Round a number n to the nearest multiple of precision (any positive value),
 * such as 5000, 0.1 (one decimal), 1e-12 (twelve decimals), or 1024 (if you'd
 * want "to the nearest kilobyte" -- so round(66000, 1024) == "65536"). You are
 * also guaranteed to get the precision you ask for, so round(0, 0.1) == "0.0".
 *
 * @static
 * @param {Number} n Original number.
 * @param {Number} [precision] Rounding bucket, by default 1.
 * @returns {String} Rounded number into the nearest bucket at the bucket's
 *                   precision, in a form readable by users.
 */
Exhibit.Util.round = function(n, precision) {
    var lg;
    precision = precision || 1;
    lg = Math.floor( Math.log(precision) / Math.log(10) );
    n = (Math.round(n / precision) * precision).toString();
    if (lg >= 0) {
        return parseInt(n, 10).toString();
    }

    lg = -lg;
    return parseFloat(n).toFixed(lg);
};

/**
 * Modify the native String type.
 */
(function() {
    if (typeof String.prototype.trim === "undefined") {
        /**
         * Removes leading and trailing spaces.
         *
         * @returns {String} Trimmed string.
         */
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    if (typeof String.prototype.startsWith === "undefined") {
        /**
         * Test if a string begins with a prefix.
         *
         * @param {String} prefix Prefix to check.
         * @returns {Boolean} True if string starts with prefix, false if not.
         */
        String.prototype.startsWith = function(prefix) {
            return this.length >= prefix.length && this.substr(0, prefix.length) === prefix;
        };
    }

    if (typeof String.prototype.endsWith === "undefined") {
        /**
         * Test if a string ends with a suffix.
         *
         * @param {String} suffix Suffix to check.
         * @returns {Boolean} True if string ends with suffix, false if not.
         */
        String.prototype.endsWith = function(suffix) {
            return this.length >= suffix.length && this.substr(this.length - suffix.length) === suffix;
        };
    }
}());
/**
 * @fileOverview Methods for generating and interpreting session state
 *               bookmarks.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace Bookmarking the current state of a browsing session.
 */
Exhibit.Bookmark = {
    /**
     * Whether the History system should load the bookmarked state.
     *
     * @private
     */
    _shouldRun: undefined,

    /**
     * The bookmark state read in by the bookmarking system.
     */
    state: {},
    
    /**
     * Whether a bookmark was used at the start or not.
     */
    run: undefined
};

/**
 * Generate a string that can be used as the hash portion of a URI
 * to be used for bookmarking the current state of an Exhibit browsing
 * session.
 *
 * @static
 * @param state {Object} An JSON serializable object fully describing
 *                       the current state.
 * @returns {String} The Base64-encoded string representing a JSON
 *                   serialized object.
 * @depends JSON
 * @depends Base64
 */
Exhibit.Bookmark.generateBookmarkHash = function(state) {
    if (typeof state === "undefined" ||
        state === null ||
        typeof state.data === "undefined" ||
        state.data === null ||
        typeof state.data.state === "undefined" ||
        state.data.state === null) {
        return "";
    }
    return Base64.encode(JSON.stringify(state));
};

/**
 * Turn a bookmark hash into a representation of state.
 *
 * @static
 * @param hash {String} A Base64-encoded string representing a JSON
 *                      serialized object.
 * @returns {Object} The deserialized object represented by the hash.
 * @depends JSON
 * @depends Base64
 */
Exhibit.Bookmark.interpretBookmarkHash = function(hash) {
    if (typeof hash === "undefined" || hash === null || hash === "") {
        return null;
    } else {
        return JSON.parse(Base64.decode(hash));
    }
};

/**
 * Given the current page state from Exhibit.History, make a bookmark URI.
 *
 * @static
 * @returns {String} The bookmark URI
 * @depends Exhibit.History
 */
Exhibit.Bookmark.generateBookmark = function() {
    var hash;
    hash = Exhibit.Bookmark.generateBookmarkHash(Exhibit.History.getState());
    return document.location.href + ((hash === "") ? "": "#" + hash);
};

/**
 * Change the state of the page given an interpreted bookmark hash.
 *
 * @static
 * @param state {Object} The interpreted bookmark hash as the state
 *                       object History.js uses.
 * @depends Exhibit.History
 */
Exhibit.Bookmark.implementBookmark = function(state) {
    if (typeof state !== "undefined" && state !== null) {
        Exhibit.History.replaceState(state.data, state.title, state.url);
        Exhibit.Bookmark.run = true;
    }
};

/**
 * Answer whether the bookmark system should run or not on the hash
 * (if there is a hash) in the current URL.
 *
 * @returns {Boolean}
 */
Exhibit.Bookmark.runBookmark = function() {
    return Exhibit.Bookmark._shouldRun;
};

/**
 * When run, examine this page's URI for a hash and try to interpret and
 * implement it.
 *
 * @static
 */
Exhibit.Bookmark.init = function() {
    var hash, state;
    hash = document.location.hash;
    if (hash.length > 0) {
        try {
            state = Exhibit.Bookmark.interpretBookmarkHash(hash.substr(1));
            if (typeof state === "object" &&
                typeof state["data"] !== "undefined" &&
                typeof state["title"] !== "undefined" &&
                typeof state["url"] !== "undefined") {
                Exhibit.Bookmark.state = state;
                Exhibit.Bookmark._shouldRun = true;
            } else {
                Exhibit.Bookmark._shouldRun = false;
            }
        } catch (ex) {
            Exhibit.Bookmark._shouldRun = false;
        } finally {
            Exhibit.Bookmark.run = false;
        }
    }
};
/**
 * @fileOverview Default colors for color coders.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Coders = {
    /**
     * @constant
     */
    "mixedCaseColor":  "#fff",

    /**
     * @constant
     */
    "othersCaseColor": "#aaa",

    /**
     * @constant
     */
    "missingCaseColor": "#888"
};
/**
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @fileOverview A collection of date/time utility functions.
 */

/**
 * @namespace A collection of date/time utility functions.
 */
Exhibit.DateTime = {};

                                     /** @constant */
Exhibit.DateTime.MILLISECOND    = 0; /** @constant */
Exhibit.DateTime.SECOND         = 1; /** @constant */
Exhibit.DateTime.MINUTE         = 2; /** @constant */
Exhibit.DateTime.HOUR           = 3; /** @constant */
Exhibit.DateTime.DAY            = 4; /** @constant */
Exhibit.DateTime.WEEK           = 5; /** @constant */
Exhibit.DateTime.MONTH          = 6; /** @constant */
Exhibit.DateTime.YEAR           = 7; /** @constant */
Exhibit.DateTime.DECADE         = 8; /** @constant */
Exhibit.DateTime.CENTURY        = 9; /** @constant */
Exhibit.DateTime.MILLENNIUM     = 10; /** @constant */
Exhibit.DateTime.QUARTER        = 11; /** @constant */

Exhibit.DateTime.EPOCH          = -1; /** @constant */
Exhibit.DateTime.ERA            = -2;

/**
 * An array of unit lengths, expressed in milliseconds, of various lengths of
 * time.  The array indices are predefined and stored as properties of the
 * Exhibit.DateTime object, e.g. Exhibit.DateTime.YEAR.
 * @constant
 * @type {Array}
 */
Exhibit.DateTime.gregorianUnitLengths = [];
(function() {
    var d = Exhibit.DateTime, a = d.gregorianUnitLengths;
    
    a[d.MILLISECOND] = 1;
    a[d.SECOND]      = 1000;
    a[d.MINUTE]      = a[d.SECOND] * 60;
    a[d.HOUR]        = a[d.MINUTE] * 60;
    a[d.DAY]         = a[d.HOUR] * 24;
    a[d.WEEK]        = a[d.DAY] * 7;
    a[d.MONTH]       = a[d.DAY] * 31;
    a[d.QUARTER]     = a[d.MONTH] * 3;
    a[d.YEAR]        = a[d.DAY] * 365;
    a[d.DECADE]      = a[d.YEAR] * 10;
    a[d.CENTURY]     = a[d.YEAR] * 100;
    a[d.MILLENNIUM]  = a[d.YEAR] * 1000;
}());

/**
 * @private
 * @static
 * @constant
 */
Exhibit.DateTime._dateRegexp = new RegExp(
    "^(-?)([0-9]{4})(" + [
        "(-?([0-9]{2})(-?([0-9]{2}))?)", // -month-dayOfMonth
        "(-?([0-9]{3}))",                // -dayOfYear
        "(-?W([0-9]{2})(-?([1-7]))?)"    // -Wweek-dayOfWeek
    ].join("|") + ")?$"
);

/**
 * @private
 * @static
 * @constant
 */
Exhibit.DateTime._timezoneRegexp = /Z|(([\-+])([0-9]{2})(:?([0-9]{2}))?)$/;

/**
 * @private
 * @static
 * @constant
 */
Exhibit.DateTime._timeRegexp = /^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(\.([0-9]+))?)?)?$/;

/**
 * Takes a date object and a string containing an ISO 8601 date and sets the
 * the date using information parsed from the string.  Note that this method
 * does not parse any time information.
 *
 * @static
 * @param {Date} dateObject The date object to modify.
 * @param {String} string An ISO 8601 string to parse.
 * @returns {Date} The modified date object.
 */
Exhibit.DateTime.setIso8601Date = function(dateObject, string) {
    /*
     *  This function has been adapted from dojo.date, v.0.3.0
     *  http://dojotoolkit.org/.
     */
    var d, sign, year, month, date, dayofyear, week, dayofweek, gd, day, offset;
    d = string.match(Exhibit.DateTime._dateRegexp);
    if (!d) {
        throw new Error(Exhibit._("%datetime.error.invalidDate", string));
    }
    
    sign = (d[1] === "-") ? -1 : 1; // BC or AD
    year = sign * d[2];
    month = d[5];
    date = d[7];
    dayofyear = d[9];
    week = d[11];
    dayofweek = (d[13]) ? d[13] : 1;

    dateObject.setUTCFullYear(year);
    if (dayofyear) { 
        dateObject.setUTCMonth(0);
        dateObject.setUTCDate(Number(dayofyear));
    } else if (week) {
        dateObject.setUTCMonth(0);
        dateObject.setUTCDate(1);
        gd = dateObject.getUTCDay();
        day =  (gd) ? gd : 7;
        offset = Number(dayofweek) + (7 * Number(week));
        
        if (day <= 4) { 
            dateObject.setUTCDate(offset + 1 - day); 
        } else { 
            dateObject.setUTCDate(offset + 8 - day); 
        }
    } else {
        if (month) { 
            dateObject.setUTCDate(1);
            dateObject.setUTCMonth(month - 1); 
        }
        if (date) { 
            dateObject.setUTCDate(date); 
        }
    }
    
    return dateObject;
};

/**
 * Takes a date object and a string containing an ISO 8601 time and sets the
 * the time using information parsed from the string.  Note that this method
 * does not parse any date information.
 *
 * @param {Date} dateObject The date object to modify.
 * @param {String} string An ISO 8601 string to parse.
 * @returns {Date} The modified date object.
 */
Exhibit.DateTime.setIso8601Time = function (dateObject, string) {
    /*
     *  This function has been adapted from dojo.date, v.0.3.0
     *  http://dojotoolkit.org/.
     */
    var d, hours, mins, secs, ms;
    d = string.match(Exhibit.DateTime._timeRegexp);
    if (!d) {
        throw new Error(Exhibit._("%datetime.error.invalidTime", string));
    }
    hours = d[1];
    mins = Number((d[3]) ? d[3] : 0);
    secs = (d[5]) ? d[5] : 0;
    ms = d[7] ? (Number("0." + d[7]) * 1000) : 0;

    dateObject.setUTCHours(hours);
    dateObject.setUTCMinutes(mins);
    dateObject.setUTCSeconds(secs);
    dateObject.setUTCMilliseconds(ms);
    
    return dateObject;
};

/**
 * The timezone offset in minutes in the user's browser.
 * @type {Number}
 */
Exhibit.DateTime.timezoneOffset = new Date().getTimezoneOffset();

/**
 * Takes a date object and a string containing an ISO 8601 date and time and 
 * sets the date object using information parsed from the string.
 *
 * @param {Date} dateObject The date object to modify.
 * @param {String} string An ISO 8601 string to parse.
 * @returns {Date} The modified date object.
 */
Exhibit.DateTime.setIso8601 = function (dateObject, string){
    /*
     *  This function has been adapted from dojo.date, v.0.3.0
     *  http://dojotoolkit.org/.
     */
    var offset, comps, d;
    offset = null;
    comps = (string.indexOf("T") === -1) ? string.split(" ") : string.split("T");
    
    Exhibit.DateTime.setIso8601Date(dateObject, comps[0]);
    if (comps.length === 2) { 
        // first strip timezone info from the end
        d = comps[1].match(Exhibit.DateTime._timezoneRegexp);
        if (d) {
            if (d[0] === 'Z') {
                offset = 0;
            } else {
                offset = (Number(d[3]) * 60) + Number(d[5]);
                offset *= ((d[2] === '-') ? 1 : -1);
            }
            comps[1] = comps[1].substr(0, comps[1].length - d[0].length);
        }

        Exhibit.DateTime.setIso8601Time(dateObject, comps[1]); 
    }
    if (typeof offset === "undefined" || offset === null) {
        offset = dateObject.getTimezoneOffset(); // local time zone if no tz info
    }
    dateObject.setTime(dateObject.getTime() + offset * 60000);
    
    return dateObject;
};

/**
 * Takes a string containing an ISO 8601 date and returns a newly instantiated
 * date object with the parsed date and time information from the string.
 *
 * @param {String} string An ISO 8601 string to parse.
 * @returns {Date} A new date object created from the string.
 */
Exhibit.DateTime.parseIso8601DateTime = function (string) {
    try {
        return Exhibit.DateTime.setIso8601(new Date(0), string);
    } catch (e) {
        return null;
    }
};

/**
 * Takes a string containing a Gregorian date and time and returns a newly
 * instantiated date object with the parsed date and time information from the
 * string.  If the param is actually an instance of Date instead of a string, 
 * simply returns the given date instead.  Note the times are considered UTC
 * by default, so, e.g., setting a year only may result in a different value
 * if you subsequently use non-UTC getters.
 *
 * @param {Date|String} o An object, to either return or parse as a string.
 * @returns {Date} The date object.
 */
Exhibit.DateTime.parseGregorianDateTime = function(o) {
    var s, space, year, suffix, d;
    if (typeof o === "undefined" || o === null) {
        return null;
    } else if (o instanceof Date) {
        return o;
    }
    
   s = o.toString();
    if (s.length > 0 && s.length < 8) {
        space = s.indexOf(" ");
        if (space > 0) {
            year = parseInt(s.substr(0, space), 10);
            suffix = s.substr(space + 1);
            if (suffix.toLowerCase() === "bc") {
                year = 1 - year;
            }
        } else {
            year = parseInt(s, 10);
        }
            
        d = new Date(0);
        d.setUTCFullYear(year);
        
        return d;
    }
    
    try {
        return new Date(Date.parse(s));
    } catch (e) {
        return null;
    }
};

/**
 * Rounds date objects down to the nearest interval or multiple of an interval.
 * This method modifies the given date object, converting it to the given
 * timezone if specified.  NB, does not support Exhibit.DateTime.QUARTER.
 *
 * Rounding to the week is something of an odd concept, so the semantics are
 * described here.  Weeks are 1-index.  The first week of the year goes from
 * Jan 1 to the day before the first firstDayOfWeek, unless Jan 1 is the first
 * firstDayOfWeek.  There can be 54 weeks in a leap year, 53 in a non-leap
 * year.  Rounding is only done within a year; the farthest to round down is
 * the first week of the year.  The same day of week is retained unless it
 * comes before the first of the year, in which case the first of the year is
 * used.
 * 
 * @param {Date} date The date object to round.
 * @param {Number} intervalUnit A constant, integer index specifying an 
 *   interval, e.g. Exhibit.DateTime.HOUR.
 * @param {Number} timeZone A timezone shift, given in hours.
 * @param {Number} multiple A multiple of the interval to round by.
 * @param {Number} firstDayOfWeek An integer specifying the first day of the
 *   week, 0 corresponds to Sunday, 1 to Monday, etc.
 */
Exhibit.DateTime.roundDownToInterval = function(date, intervalUnit, timeZone, multiple, firstDayOfWeek) {
    var timeShift, date2, clearInDay, clearInYear, x, first;
    timeShift = timeZone * 
        Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.HOUR];
        
    date2 = new Date(date.getTime() + timeShift);
    clearInDay = Exhibit.DateTime.zeroTimeUTC;
    clearInYear = function(d) {
        clearInDay(d);
        d.setUTCDate(1);
        d.setUTCMonth(0);
    };
    
    switch(intervalUnit) {
    case Exhibit.DateTime.MILLISECOND:
        x = date2.getUTCMilliseconds();
        date2.setUTCMilliseconds(x - (x % multiple));
        break;
    case Exhibit.DateTime.SECOND:
        date2.setUTCMilliseconds(0);
        
        x = date2.getUTCSeconds();
        date2.setUTCSeconds(x - (x % multiple));
        break;
    case Exhibit.DateTime.MINUTE:
        date2.setUTCMilliseconds(0);
        date2.setUTCSeconds(0);
        
        x = date2.getUTCMinutes();
        date2.setTime(date2.getTime() - 
            (x % multiple) * Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.MINUTE]);
        break;
    case Exhibit.DateTime.HOUR:
        date2.setUTCMilliseconds(0);
        date2.setUTCSeconds(0);
        date2.setUTCMinutes(0);
        
        x = date2.getUTCHours();
        date2.setUTCHours(x - (x % multiple));
        break;
    case Exhibit.DateTime.DAY:
        clearInDay(date2);

        x = date2.getUTCDate();
        date2.setUTCDate(x - (x % multiple));
        break;
    case Exhibit.DateTime.WEEK:
        first = new Date(date2.getUTCFullYear(), 0, 1);
        clearInDay(date2);
        clearInDay(first);
        x = Math.ceil((((date2 - first) / Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.DAY]) - ((firstDayOfWeek - first.getUTCDay() + 7) % 7) + 1) / 7) + (first.getUTCDay() !== firstDayOfWeek ? 1 : 0);
        date2.setTime(date2.getTime() - ((x % multiple) * Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.WEEK]));
        if (date2 < first) {
            date2 = first;
        }
        break;
    case Exhibit.DateTime.MONTH:
        clearInDay(date2);
        date2.setUTCDate(1);
        
        x = date2.getUTCMonth() + 1;
        date2.setUTCMonth(Math.max(0, x - 1 - (x % multiple)));
        break;
    case Exhibit.DateTime.YEAR:
        clearInYear(date2);
        
        x = date2.getUTCFullYear();
        date2.setUTCFullYear(x - (x % multiple));
        break;
    case Exhibit.DateTime.DECADE:
        clearInYear(date2);
        date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 10) * 10);
        break;
    case Exhibit.DateTime.CENTURY:
        clearInYear(date2);
        date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 100) * 100);
        break;
    case Exhibit.DateTime.MILLENNIUM:
        clearInYear(date2);
        date2.setUTCFullYear(Math.floor(date2.getUTCFullYear() / 1000) * 1000);
        break;
    }
    
    date.setTime(date2.getTime() - timeShift);
};

/**
 * Rounds date objects up to the nearest interval or multiple of an interval.
 * This method modifies the given date object, converting it to the given
 * timezone if specified.  NB, does not support Exhibit.DateTime.QUARTER.
 *
 * Unlike round down, round up for week and month may cross year boundaries.
 * The semantics here are also weird and probably should not be used for
 * anything other than multiples of one, but if you have October and want
 * to round up to the nearest fifteenth month, you will get April of the
 * next year.  Caveat emptor.
 * 
 * @param {Date} date The date object to round.
 * @param {Number} intervalUnit A constant, integer index specifying an 
 *   interval, e.g. Exhibit.DateTime.HOUR.
 * @param {Number} timeZone A timezone shift, given in hours.
 * @param {Number} multiple A multiple of the interval to round by.
 * @param {Number} firstDayOfWeek An integer specifying the first day of the
 *   week, 0 corresponds to Sunday, 1 to Monday, etc.
 * @see Exhibit.DateTime.roundDownToInterval
 */
Exhibit.DateTime.roundUpToInterval = function(date, intervalUnit, timeZone, multiple, firstDayOfWeek) {
    var originalTime, useRoundDown, usedRoundDown, date2, first, x, clearInYear;
    originalTime = date.getTime();
    clearInYear = function(d) {
        Exhibit.DateTime.zeroTimeUTC(d);
        d.setUTCDate(1);
        d.setUTCMonth(0);
    };
    usedRoundDown = false;
    useRoundDown = function() {
        Exhibit.DateTime.roundDownToInterval(date, intervalUnit, timeZone, multiple, firstDayOfWeek);
        if (date.getTime() < originalTime) {
            date.setTime(date.getTime() + 
                         Exhibit.DateTime.gregorianUnitLengths[intervalUnit] * multiple);
        }
        usedRoundDown = true;
    };

    timeShift = timeZone * 
        Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.HOUR];
    date2 = new Date(date.getTime() + timeShift);

    switch(intervalUnit) {
    case Exhibit.DateTime.MILLISECOND:
        useRoundDown();
        break;
    case Exhibit.DateTime.SECOND:
        useRoundDown();
        break;
    case Exhibit.DateTime.MINUTE:
        useRoundDown();
        break;
    case Exhibit.DateTime.HOUR:
        useRoundDown();
        break;
    case Exhibit.DateTime.DAY:
        useRoundDown();
        break;
    case Exhibit.DateTime.WEEK:
        first = new Date(date2.getUTCFullYear(), 0, 1);
        Exhibit.DateTime.zeroTimeUTC(date2);
        Exhibit.DateTime.zeroTimeUTC(first);
        x = Math.ceil((((date2 - first) / Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.DAY]) - ((firstDayOfWeek - first.getUTCDay() + 7) % 7) + 1) / 7) + (first.getUTCDay() !== firstDayOfWeek ? 1 : 0);
        date2.setTime(date2.getTime() + (((multiple - (x % multiple)) % multiple) * Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.WEEK]));
        break;
    case Exhibit.DateTime.MONTH:
        Exhibit.DateTime.zeroTimeUTC(date2);
        date2.setUTCDate(1);
        
        x = date2.getUTCMonth() + 1;
        date2.setUTCMonth(x - 1 + (multiple - (x % multiple)) % multiple);
        break;
    case Exhibit.DateTime.YEAR:
        clearInYear(date2);
        
        x = date2.getUTCFullYear();
        date2.setUTCFullYear(x + (multiple - (x % multiple)) % multiple);
        break;
    case Exhibit.DateTime.DECADE:
        clearInYear(date2);
        date2.setUTCFullYear(Math.ceil(date2.getUTCFullYear() / 10) * 10);
        break;
    case Exhibit.DateTime.CENTURY:
        clearInYear(date2);
        date2.setUTCFullYear(Math.ceil(date2.getUTCFullYear() / 100) * 100);
        break;
    case Exhibit.DateTime.MILLENNIUM:
        clearInYear(date2);
        date2.setUTCFullYear(Math.ceil(date2.getUTCFullYear() / 1000) * 1000);
        break;
    }

    if (!usedRoundDown) {
        date.setTime(date2.getTime() - timeShift);
    }
};

/**
 * Increments a date object by a specified interval, taking into
 * consideration the timezone.
 *
 * @param {Date} date The date object to increment.
 * @param {Number} intervalUnit A constant, integer index specifying an
 *   interval, e.g. Exhibit.DateTime.HOUR.
 * @param {Number} timeZone The timezone offset in hours.
 */
Exhibit.DateTime.incrementByInterval = function(date, intervalUnit, timeZone) {
    timeZone = (typeof timeZone === 'undefined') ? 0 : timeZone;
    var timeShift, date2;
    timeShift = timeZone * 
        Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.HOUR];
        
    date2 = new Date(date.getTime() + timeShift);

    switch(intervalUnit) {
    case Exhibit.DateTime.MILLISECOND:
        date2.setTime(date2.getTime() + 1);
        break;
    case Exhibit.DateTime.SECOND:
        date2.setTime(date2.getTime() + 1000);
        break;
    case Exhibit.DateTime.MINUTE:
        date2.setTime(date2.getTime() + 
            Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.MINUTE]);
        break;
    case Exhibit.DateTime.HOUR:
        date2.setTime(date2.getTime() + 
            Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.HOUR]);
        break;
    case Exhibit.DateTime.DAY:
        date2.setUTCDate(date2.getUTCDate() + 1);
        break;
    case Exhibit.DateTime.WEEK:
        date2.setUTCDate(date2.getUTCDate() + 7);
        break;
    case Exhibit.DateTime.MONTH:
        date2.setUTCMonth(date2.getUTCMonth() + 1);
        break;
    case Exhibit.DateTime.YEAR:
        date2.setUTCFullYear(date2.getUTCFullYear() + 1);
        break;
    case Exhibit.DateTime.DECADE:
        date2.setUTCFullYear(date2.getUTCFullYear() + 10);
        break;
    case Exhibit.DateTime.CENTURY:
        date2.setUTCFullYear(date2.getUTCFullYear() + 100);
        break;
    case Exhibit.DateTime.MILLENNIUM:
        date2.setUTCFullYear(date2.getUTCFullYear() + 1000);
        break;
    }

    date.setTime(date2.getTime() - timeShift);
};

/**
 * Returns a new date object with the given time offset removed.
 *
 * @param {Date} date The starting date.
 * @param {Number} timeZone A timezone specified in an hour offset to remove.
 * @returns {Date} A new date object with the offset removed.
 */
Exhibit.DateTime.removeTimeZoneOffset = function(date, timeZone) {
    return new Date(date.getTime() + 
        timeZone * Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime.HOUR]);
};

/**
 * Returns the timezone of the user's browser.  This is expressed as the
 * number of hours one would have to add to the local time to equal GMT,
 * NOT the numbers one would have to add to GMT to equal local time, as
 * timezones are normally expressed.
 *
 * @returns {Number} The timezone in the user's locale in hours.
 */
Exhibit.DateTime.getTimezone = function() {
    var d = new Date().getTimezoneOffset();
    return d / -60;
};

/**
 * Zeroes (UTC) all time components of the provided date object.
 *
 * @static
 * @param {Date} date The Date object to modify.
 * @returns {Date} The modified Date object.
 */
Exhibit.DateTime.zeroTimeUTC = function(date) {
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
};
/**
 * @fileOverview Error reporting.  This file is not localized in order to
 *      keep errors in that system from interfering with this one.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Debug = {
    silent: false
};

/**
 * @static
 * @param {String} msg
 */
Exhibit.Debug.log = function(msg) {
    var f;
    if (typeof window["console"] !== "undefined" &&
        typeof window.console["log"] === "function") {
        f = function(msg2) {
            console.log(msg2);
        };
    } else {
        f = function(msg2) {
            if (!Exhibit.Debug.silent) {
                alert(msg2);
            }
        };
    }
    Exhibit.Debug.log = f;
    f(msg);
};

/**
 * @static
 * @pararm {String} msg
 */
Exhibit.Debug.warn = function(msg) {
    var f;
    if (typeof window["console"] !== "undefined" &&
        typeof window.console["warn"] === "function") {
        f = function(msg2) {
            console.warn(msg2);
        };
    } else {
        f = function(msg2) {
            if (!Exhibit.Debug.silent) {
                alert(msg2);
            }
        };
    }
    Exhibit.Debug.warn = f;
    f(msg);
};

/**
 * @static
 * @param {Exception} e
 * @param {String} msg
 */
Exhibit.Debug.exception = function(e, msg) {
    var f, params = Exhibit.parseURLParameters();
    if (params.errors === "throw" || Exhibit.params.errors === "throw") {
        f = function(e2, msg2) {
            throw(e2);
        };
    } else if (typeof window["console"] !== "undefined" &&
               typeof window.console["error"] !== "undefined") {
        f = function(e2, msg2) {
            if (typeof msg2 !== "undefined" && msg2 !== null) {
                console.error(msg2 + " %o", e2);
            } else {
                console.error(e2);
            }
            throw(e2); // do not hide from browser's native debugging features
        };
    } else {
        f = function(e2, msg2) {
            if (!Exhibit.Debug.silent) {
                alert("Caught exception: " + msg2 + "\n\nDetails: " + (typeof e2["description"] !== "undefined" ? e2.description : e2));
            }
            throw(e2); // do not hide from browser's native debugging features
        };
    }
    Exhibit.Debug.exception = f;
    f(e, msg);
};

/**
 * @static
 * @param {Object} o
 * @returns {String}
 */
Exhibit.Debug.objectToString = function(o) {
    return Exhibit.Debut._objectToString(o, "");
};

/**
 * @static
 * @param {Object} o
 * @param {String} indent
 * @returns {String}
 */
Exhibit.Debug._objectToString = function(o, indent) {
    var indent2 = indent + " ", s, n;
    if (typeof o === "object") {
        s = "{";
        for (n in o) {
            if (o.hasOwnProperty(n)) {
                s += indent2 + n + ": " + Exhibit.Debug._objectToString(o[n], indent2) + "\n";
            }
        }
        s += indent + "}";
        return s;
    } else if (typeof o === "array") {
        s = "[";
        for (n = 0; n < o.length; n++) {
            s += Exhibit.Debug._objectToString(o[n], indent2) + "\n";
        }
        s += indent + "]";
        return s;
    } else if (typeof o === "function") {
        return indent + "{function}\n";
    } else {
        return o;
    }
};
/**
 * @fileOverview Facet building and interaction utilities.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.FacetUtilities = {};

/**
 * @static
 * @param {Exhibit.Facet} forFacet
 * @param {Element} div
 * @param {String} facetLabel
 * @param {Function} onClearAllSelections
 * @param {Exhibit.UIContext} uiContext
 * @param {Boolean} collapsible
 * @param {Boolean} collapsed
 * @returns {Object}
 */
Exhibit.FacetUtilities.constructFacetFrame = function(forFacet, div, facetLabel, onClearAllSelections, uiContext, collapsible, collapsed) {
    var dom, resizableDivWidget;

    Exhibit.jQuery(div).attr("class", "exhibit-facet");
    dom = Exhibit.jQuery.simileDOM("string", div,
            '<div class="exhibit-facet-header">' +
            '<div class="exhibit-facet-header-filterControl" id="clearSelectionsDiv" title="' + Exhibit._("%facets.clearSelectionsTooltip") + '">' +
            '<span id="filterCountSpan"></span>' +
            '<img id="checkImage" />' +
            '</div>' +
            ((collapsible) ?
             '<img src="' + Exhibit.urlPrefix + 'images/collapse.png" class="exhibit-facet-header-collapse" id="collapseImg" />' :
                '') +
            '<span class="exhibit-facet-header-title">' + facetLabel + '</span>' +
        '</div>' +
        '<div class="exhibit-facet-body-frame" id="frameDiv"></div>',
        { checkImage: Exhibit.UI.createTranslucentImage("images/black-check.png") }
    );
    resizableDivWidget = Exhibit.ResizableDivWidget.create({}, dom.frameDiv, uiContext);
    
    dom.valuesContainer = resizableDivWidget.getContentDiv();
    Exhibit.jQuery(dom.valuesContainer).attr("class", "exhibit-facet-body");
    
    dom.setSelectionCount = function(count) {
        Exhibit.jQuery(this.filterCountSpan).html(count);
        Exhibit.jQuery(this.clearSelectionsDiv).toggle(count > 0);
    };
    Exhibit.jQuery(dom.clearSelectionsDiv).bind("click", onClearAllSelections);
    
    if (collapsible) {
        Exhibit.jQuery(dom.collapseImg).bind("click", function(evt) {
            Exhibit.FacetUtilities.toggleCollapse(dom, forFacet);
        });
        
        if (collapsed) {
            Exhibit.FacetUtilities.toggleCollapse(dom, forFacet);
        }
    }
    
    return dom;
};

/**
 * @static
 * @param {Object} dom
 * @param {Exhibit.Facet} facet
 */
Exhibit.FacetUtilities.toggleCollapse = function(dom, facet) {
    var el = dom.frameDiv;
    if (Exhibit.jQuery(el).is(":visible")) {
        Exhibit.jQuery(el).hide();
        Exhibit.jQuery(dom.collapseImg).attr("src", Exhibit.urlPrefix + "images/expand.png");
    } else {
        Exhibit.jQuery(el).show();
        Exhibit.jQuery(dom.collapseImg).attr("src", Exhibit.urlPrefix + "images/collapse.png");
		// Try to call onUncollapse but don't sweat it if it isn't there.
		if (typeof facet.onUncollapse === 'function') {
			facet.onUncollapse();			
		}
    }
};

/**
 * @static
 * @param {Exhibit.Facet} facet
 * @returns {Boolean}
 */
Exhibit.FacetUtilities.isCollapsed = function(facet) {
    var el = facet._dom.frameDiv;
    return !Exhibit.jQuery(el).is(":visible");
};

/**
 * @static
 * @param {String} label
 * @param {Number} count
 * @param {String} color A valid CSS color value.
 * @param {Boolean} selected
 * @param {Boolean} facetHasSelection
 * @param {Function} onSelect
 * @param {Function} onSelectOnly
 * @param {Exhibit.UIContext} uiContext
 * @returns {Element}
 */
Exhibit.FacetUtilities.constructFacetItem = function(
    label, 
    count, 
    color,
    selected, 
    facetHasSelection,
    onSelect,
    onSelectOnly,
    uiContext
) {
    if (Exhibit.params.safe) {
        label = Exhibit.Formatter.encodeAngleBrackets(label);
    }
    
    var dom = Exhibit.jQuery.simileDOM("string",
        "div",
        '<div class="exhibit-facet-value-count">' + count + "</div>" +
        '<div class="exhibit-facet-value-inner" id="inner">' + 
            (   '<div class="exhibit-facet-value-checkbox">&#160;' +
                    Exhibit.UI.createTranslucentImageHTML(
                        facetHasSelection ?
                            (selected ? "images/black-check.png" : "images/no-check.png") :
                            "images/no-check-no-border.png"
                    ) +
                "</div>"
            ) +
            '<a class="exhibit-facet-value-link" href="#" id="link"></a>' +
        "</div>"
    );

    Exhibit.jQuery(dom.elmt).attr("class", selected ? "exhibit-facet-value exhibit-facet-value-selected" : "exhibit-facet-value");
    if (typeof label === "string") {
        Exhibit.jQuery(dom.elmt).attr("title", label);
        Exhibit.jQuery(dom.link).html(label);
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(dom.link).css("color", color);
        }
    } else {
        Exhibit.jQuery(dom.link).append(label);
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(label).css("color", color);
        }
    }
    
    Exhibit.jQuery(dom.elmt).bind("click", onSelectOnly);
    if (facetHasSelection) {
        Exhibit.jQuery(dom.inner).children(':first-child').bind("click", onSelect);
    }
    return dom.elmt;
};

/**
 * @static
 * @param {Exhibit.Facet} forFacet
 * @param {Element} div
 * @param {String} facetLabel
 * @param {Function} onClearAllSelections
 * @param {Exhibit.UIContext} uiContext
 * @param {Boolean} collapsible
 * @param {Boolean} collapsed
 * @returns {Object}
 */
Exhibit.FacetUtilities.constructFlowingFacetFrame = function(forFacet, div, facetLabel, onClearAllSelections, uiContext, collapsible, collapsed) {
    Exhibit.jQuery(div).attr("class", "exhibit-flowingFacet");
    var dom = Exhibit.jQuery.simileDOM("string",
        div,
        '<div class="exhibit-flowingFacet-header">' +
            ((collapsible) ?
                '<img src="' + Exhibit.urlPrefix + 'images/collapse.png" class="exhibit-facet-header-collapse" id="collapseImg" />' :
                "") +
            '<span class="exhibit-flowingFacet-header-title">' + facetLabel + "</span>" +
        "</div>" +
        '<div id="frameDiv"><div class="exhibit-flowingFacet-body" id="valuesContainer"></div></div>'
    );
    
    dom.setSelectionCount = function(count) {
        // nothing
    };

    if (collapsible) {
        Exhibit.jQuery(dom.collapseImg).bind("click", function(evt) {
            Exhibit.FacetUtilities.toggleCollapse(dom, forFacet);
        });
        
        if (collapsed) {
            Exhibit.FacetUtilities.toggleCollapse(dom, forFacet);
        }
    }
    
    return dom;
};

/**
 * @static
 * @param {String} label
 * @param {Number} count
 * @param {String} color A valid CSS color value.
 * @param {Boolean} selected
 * @param {Boolean} facetHasSelection
 * @param {Function} onSelect
 * @param {Function} onSelectOnly
 * @param {Exhibit.UIContext} uiContext
 * @returns {Element}
 */
Exhibit.FacetUtilities.constructFlowingFacetItem = function(
    label, 
    count, 
    color,
    selected, 
    facetHasSelection,
    onSelect,
    onSelectOnly,
    uiContext
) {
    if (Exhibit.params.safe) {
        label = Exhibit.Formatter.encodeAngleBrackets(label);
    }
    
    var dom = Exhibit.jQuery.simileDOM("string",
        "div",
        (   '<div class="exhibit-flowingFacet-value-checkbox">' +
                Exhibit.jQuery.simileBubble("createTranslucentImageHTML",
                    Exhibit.urlPrefix + 
                    (   facetHasSelection ?
                        (selected ? "images/black-check.png" : "images/no-check.png") :
                        "images/no-check-no-border.png"
                    )) +
            "</div>"
        ) +
        '<a class="exhibit-flowingFacet-value-link" href="#" id="inner"></a>' +
        " " +
        '<span class="exhibit-flowingFacet-value-count">(' + count + ")</span>"
    );
    
    Exhibit.jQuery(dom.elmt).attr("class", selected ? "exhibit-flowingFacet-value exhibit-flowingFacet-value-selected" : "exhibit-flowingFacet-value");
    if (typeof label === "string") {
        Exhibit.jQuery(dom.elmt).attr("title", label);
        Exhibit.jQuery(dom.inner).html(label);
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(dom.inner).css("color", color);
        }
    } else {
        Exhibit.jQuery(dom.inner).append(label);
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(label).css("color", color);
        }
    }

    Exhibit.jQuery(dom.elmt).bind("click", onSelectOnly);
    if (facetHasSelection) {
        Exhibit.jQuery(dom.elmt).children(":first-child").bind("click", onSelect);
    }
    return dom.elmt;
};

/**
 * @static
 * @param {String} label
 * @param {Number} count
 * @param {String} color A valid CSS color value.
 * @param {Boolean} selected
 * @param {Boolean} hasChildren
 * @param {Boolean} expanded
 * @param {Boolean} facetHasSelection
 * @param {Function} onSelect
 * @param {Function} onSelectOnly
 * @param {Function} onToggleChildren
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.FacetUtilities.constructHierarchicalFacetItem = function(
    label, 
    count, 
    color,
    selected, 
    hasChildren,
    expanded,
    facetHasSelection,
    onSelect,
    onSelectOnly,
    onToggleChildren,
    uiContext
) {
    if (Exhibit.params.safe) {
        label = Exhibit.Formatter.encodeAngleBrackets(label);
    }
    
    var dom = Exhibit.jQuery.simileDOM("string",
        "div",
        '<div class="exhibit-facet-value-count">' + count + "</div>" +
        '<div class="exhibit-facet-value-inner" id="inner">' + 
            (   '<div class="exhibit-facet-value-checkbox">&#160;' +
                Exhibit.jQuery.simileBubble("createTranslucentImageHTML",
                        Exhibit.urlPrefix + 
                        (   facetHasSelection ?
                            (selected ? "images/black-check.png" : "images/no-check.png") :
                            "images/no-check-no-border.png"
                        )) +
                "</div>"
            ) +
            '<a class="exhibit-facet-value-link" href="#" id="link"></a>' +
            (   hasChildren ?
                (   '<a class="exhibit-facet-value-children-toggle" href="#" id="toggle">' + 
                    Exhibit.jQuery.simileBubble("createTranslucentImageHTML",
                            Exhibit.urlPrefix + "images/down-arrow.png") +
                    Exhibit.jQuery.simileBubble("createTranslucentImageHTML",
                            Exhibit.urlPrefix + "images/right-arrow.png") +
                    "</a>"
                ) :
                ""
            ) +
        "</div>" +
        (hasChildren ? '<div class="exhibit-facet-childrenContainer" id="childrenContainer"></div>' : "")
    );
    Exhibit.jQuery(dom.elmt).attr("class", selected ? "exhibit-facet-value exhibit-facet-value-selected" : "exhibit-facet-value");
    if (typeof label === "string") {
        Exhibit.jQuery(dom.elmt).attr("title", label);
        Exhibit.jQuery(dom.link).append(document.createTextNode(label));
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(dom.link).css("color", color);
        }
    } else {
        Exhibit.jQuery(dom.link).append(label);
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(label).css("color", color);
        }
    }
    
    Exhibit.jQuery(dom.elmt).bind("click", onSelectOnly);
    if (facetHasSelection) {
        Exhibit.jQuery(dom.elmt).children(":first-child").bind("click", onSelect);
    }
    if (hasChildren) {
        dom.showChildren = function(show) {
            Exhibit.jQuery(dom.childrenContainer).toggle(show);
            Exhibit.jQuery(dom.toggle).children(":eq(0)").toggle(show);
            Exhibit.jQuery(dom.toggle).children(":eq(1)").toggle(!show);
        };
        
        Exhibit.jQuery(dom.toggle).bind("click", onToggleChildren);
        dom.showChildren(expanded);
    }
    
    return dom;
};

/**
 * @static
 * @param {String} label
 * @param {Number} count
 * @param {String} color A valid CSS color value.
 * @param {Boolean} selected
 * @param {Boolean} hasChildren
 * @param {Boolean} expanded
 * @param {Boolean} facetHasSelection
 * @param {Function} onSelect
 * @param {Function} onSelectOnly
 * @param {Function} onToggleChildren
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.FacetUtilities.constructFlowingHierarchicalFacetItem = function(
    label, 
    count, 
    color,
    selected, 
    hasChildren,
    expanded,
    facetHasSelection,
    onSelect,
    onSelectOnly,
    onToggleChildren,
    uiContext
) {
    if (Exhibit.params.safe) {
        label = Exhibit.Formatter.encodeAngleBrackets(label);
    }
    
    var dom = Exhibit.jQuery.simileDOM("string",
        "div",
        (   '<div class="exhibit-flowingFacet-value-checkbox">' +
            Exhibit.jQuery.simileBubble("createTranslucentImageHTML",
                    Exhibit.urlPrefix + 
                    (   facetHasSelection ?
                        (selected ? "images/black-check.png" : "images/no-check.png") :
                        "images/no-check-no-border.png"
                    )) +
            "</div>"
        ) +
        '<a class="exhibit-flowingFacet-value-link" href="#" id="inner"></a>' +
        " " +
        '<span class="exhibit-flowingFacet-value-count">(' + count + ")</span>" +
        (   hasChildren ?
            (   '<a class="exhibit-flowingFacet-value-children-toggle" href="#" id="toggle">' + 
                Exhibit.jQuery.simileBubble("createTranslucentImageHTML",
                        Exhibit.urlPrefix + "images/down-arrow.png") +
                Exhibit.jQuery.simileBubble("createTranslucentImageHTML",
                        Exhibit.urlPrefix + "images/right-arrow.png") +
                "</a>"
            ) :
            ""
        ) +
        (hasChildren ? '<div class="exhibit-flowingFacet-childrenContainer" id="childrenContainer"></div>' : "")
    );
    
    Exhibit.jQuery(dom.elmt).attr("class", selected ? "exhibit-flowingFacet-value exhibit-flowingFacet-value-selected" : "exhibit-flowingFacet-value");
    if (typeof label === "string") {
        Exhibit.jQuery(dom.elmt).attr("title", label);
        Exhibit.jQuery(dom.inner).append(document.createTextNode(label));
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(dom.inner).css("color", color);
        }
    } else {
        Exhibit.jQuery(dom.inner).append(label);
        if (typeof color !== "undefined" && color !== null) {
            Exhibit.jQuery(label).css("color", color);
        }
    }
    
    Exhibit.jQuery(dom.elmt).bind("click", onSelectOnly);
    if (facetHasSelection) {
        Exhibit.jQuery(dom.elmt).children(":first-child").bind("click", onSelect);
    }
    if (hasChildren) {
        dom.showChildren = function(show) {
            Exhibit.jQuery(dom.childrenContainer).toggle(show);
            Exhibit.jQuery(dom.toggle).children(":eq(0)").toggle(show);
            Exhibit.jQuery(dom.toggle).children(":eq(1)").toggle(!show);
        };
        
        Exhibit.jQuery(dom.toggle).bind("click", onToggleChildren);
        dom.showChildren(expanded);
    }
    
    return dom;
};


/*======================================================================
 *  Cache for item/value mapping
 *======================================================================
 */

/**
 * @constructor
 * @class
 * @param {Exhibit.Database} database
 * @param {Exhibit.Collection} collection
 * @param {Exhibit.Expression} expression
 */
Exhibit.FacetUtilities.Cache = function(database, collection, expression) {
    var self = this;
    
    this._database = database;
    this._collection = collection;
    this._expression = expression;
    
    this._onRootItemsChanged = function() {
        if (typeof self._itemToValue !== "undefined") {
            delete self._itemToValue;
        }
        if (typeof self._valueToItem !== "undefined") {
            delete self._valueToItem;
        }
        if (typeof self._missingItems !== "undefined") {
            delete self._missingItems;
        }
    };

    Exhibit.jQuery(collection.getElement()).bind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
};

/**
 *
 */
Exhibit.FacetUtilities.Cache.prototype.dispose = function() {
    Exhibit.jQuery(this._collection.getElement()).unbind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
    this._collection = null;
    this._listener = null;
    
    this._itemToValue = null;
    this._valueToItem = null;
    this._missingItems = null;
};

/**
 * @param {Exhibit.Set} values
 * @param {Exhibit.Set} filter
 * @returns {Exhibit.Set}
 */
Exhibit.FacetUtilities.Cache.prototype.getItemsFromValues = function(values, filter) {
    var set, valueToItem;
    if (this._expression.isPath()) {
        set = this._expression.getPath().walkBackward(
            values, 
            "item",
            filter, 
            this._database
        ).getSet();
    } else {
        this._buildMaps();
        
        set = new Exhibit.Set();
        
        valueToItem = this._valueToItem;
        values.visit(function(value) {
            var itemA, i, item;
            if (typeof valuetoItem[value] !== "undefined") {
                itemA = valueToItem[value];
                for (i = 0; i < itemA.length; i++) {
                    item = itemA[i];
                    if (filter.contains(item)) {
                        set.add(item);
                    }
                }
            }
        });
    }
    return set;
};

/**
 * @param {Exhibit.Set} filter
 * @param {Exhibit.Set} results
 * @returns {Exhibit.Set}
 */
Exhibit.FacetUtilities.Cache.prototype.getItemsMissingValue = function(filter, results) {
    this._buildMaps();
    
    results = results || new Exhibit.Set();
        
    var missingItems = this._missingItems;
    filter.visit(function(item) {
        if (typeof missingItems[item] !== "undefined") {
            results.add(item);
        }
    });
    return results;
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.FacetUtilities.Cache.prototype.getValueCountsFromItems = function(items) {
    var entries, database, valueType, path, facetValueResult, value, itemA, count, i;
    entries = [];
    database = this._database;
    valueType = "text";
    
    if (this._expression.isPath()) {
        path = this._expression.getPath();
        facetValueResult = path.walkForward(items, "item", database);
        valueType = facetValueResult.valueType;
        
        if (facetValueResult.size > 0) {
            facetValueResult.forEachValue(function(facetValue) {
                var itemSubcollection = path.evaluateBackward(facetValue, valueType, items, database);
                entries.push({ value: facetValue, count: itemSubcollection.size });
            });
        }
    } else {
        this._buildMaps();
        
        valueType = this._valueType;
        for (value in this._valueToItem) {
            if (this._valueToItem.hasOwnProperty(value)) {
                itemA = this._valueToItem[value];
                count = 0;
                for (i = 0; i < itemA.length; i++) {
                    if (items.contains(itemA[i])) {
                        count++;
                    }
                }
            
                if (count > 0) {
                    entries.push({ value: value, count: count });
                }
            }
        }
    }
    return { entries: entries, valueType: valueType };
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.FacetUtilities.Cache.prototype.getValuesFromItems = function(items) {
    var set, itemToValue;

    if (this._expression.isPath()) {
        return this._expression.getPath().walkForward(items, "item", database).getSet();
    } else {
        this._buildMaps();
        
        set = new Exhibit.Set();
        itemToValue = this._itemToValue;
        items.visit(function(item) {
            var a, i;
            if (typeof itemToValue[item] !== "undefined") {
                a = itemToValue[item];
                for (i = 0; i < a.length; i++) {
                    set.add(a[i]);
                }
            }
        });
        
        return set;
    }
};

/**
 * @param {Exhibit.Set} items
 * @returns {Number}
 */
Exhibit.FacetUtilities.Cache.prototype.countItemsMissingValue = function(items) {
    var count, item;

    this._buildMaps();
    
    count = 0;
    for (item in this._missingItems) {
        if (this._missingItems.hasOwnProperty(item)) {
            if (items.contains(item)) {
                count++;
            }
        }
    }
    return count;
};

/**
 *
 */
Exhibit.FacetUtilities.Cache.prototype._buildMaps = function() {
    var itemToValue, valueToItem, missingItems, valueType, insert, expression, database;

    if (typeof this._itemToValue === "undefined") {
        itemToValue = {};
        valueToItem = {};
        missingItems = {};
        valueType = "text";
        
        insert = function(x, y, map) {
            if (typeof map.x !== "undefined") {
                map[x].push(y);
            } else {
                map[x] = [ y ];
            }
        };
        
        expression = this._expression;
        database = this._database;
        
        this._collection.getAllItems().visit(function(item) {
            var results = expression.evaluateOnItem(item, database);
            if (results.values.size() > 0) {
                valueType = results.valueType;
                results.values.visit(function(value) {
                    insert(item, value, itemToValue);
                    insert(value, item, valueToItem);
                });
            } else {
                missingItems[item] = true;
            }
        });
        
        this._itemToValue = itemToValue;
        this._valueToItem = valueToItem;
        this._missingItems = missingItems;
        this._valueType = valueType;
    }
};
/**
 * This requires the entire Exhibit infrastructure to be oriented around
 * generating registered state changes.
 */

/**
 * @fileOverview Local interface to a history manager.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace For history management related methods.
 */
Exhibit.History = {
    /**
     * Whether the history module is available.
     */
    enabled: false,

    /**
     * @private
     */
    _state: 0,

    /**
     * @private
     */
    _originalTitle: "",

    /**
     * @private
     */
    _originalLocation: "",
    
    /**
     * @private
     */
    _registry: null,

    /**
     * @private
     * @constant
     */
    _activeTypes: [ "facet", "view", "viewPanel" ]
};

/**
 * @depends History.js
 * @param {Exhibit._Impl} ex
 */
Exhibit.History.init = function(ex) {
    var state, types, i, j, keys, component;

    if (typeof History !== "undefined" && History.enabled) {
        Exhibit.History.enabled = true;
        Exhibit.History._originalTitle = document.title;
        Exhibit.History._originalLocation = Exhibit.Persistence.getURLWithoutQueryAndHash();
        Exhibit.History._registry = ex.getRegistry();

        Exhibit.jQuery(window).bind("statechange", Exhibit.History.stateListener);
        if (Exhibit.Bookmark.runBookmark()) {
            Exhibit.Bookmark.implementBookmark(Exhibit.Bookmark.state);
        } else {
            Exhibit.History._processEmptyState();
            Exhibit.History.stateListener();
        }
    }
};

/**
 * @private
 * @static
 */
Exhibit.History._processEmptyState = function() {
    var state, types, reg, keys, component, i;
    types = Exhibit.History._activeTypes;
    reg = Exhibit.History._registry;
    state = Exhibit.History.getState();
    if (typeof state.data.components === "undefined") {
        state.data.components = {};
        state.data.state = Exhibit.History._state;
        for (i = 0; i < types.length; i++) {
            keys = reg.getKeys(types[i]);
            for (j = 0; j < keys.length; j++) {
                component = reg.get(types[i], keys[j]);
                if (typeof component.exportState === "function") {
                    state.data.components[keys[j]] = {};
                    state.data.components[keys[j]].type = types[i];
                    state.data.components[keys[j]].state = component.exportState();
                }
            }
        }
        Exhibit.History.replaceState(state.data);
    }
};

/**
 * @param {jQuery.Event} evt
 */
Exhibit.History.stateListener = function(evt) {
    var fullState, components, key, id, componentState, component;

    fullState = Exhibit.History.getState();

    if (fullState.data.lengthy) {
        Exhibit.UI.showBusyIndicator();
    }

    components = fullState.data.components;
    for (key in components) {
        if (components.hasOwnProperty(key)) {
            componentState = components[key].state;
            component = Exhibit.History._registry.get(components[key].type, key);
            if (component !== null &&
                typeof component.importState === "function") {
                // @@@ not every component is immediately available
                component.importState(componentState);
            }
        }
    }
    Exhibit.History._state = fullState.data.state || 0;

    if (fullState.data.lengthy) {
        Exhibit.UI.hideBusyIndicator();
    }
};

/**
 * Catch up for components that aren't immediately available.
 *
 * @param {jQuery.Event} evt
 * @param {String} type
 * @param {String} id
 */
Exhibit.History.componentStateListener = function(evt, type, id) {
    var fullState, components, componentState, component;
    fullState = Exhibit.History.getState();
    if (fullState !== null) {
        components = fullState.data.components;
        if (typeof components[id] !== "undefined") {
            componentState = components[id].state;
            component = Exhibit.History._registry.get(type, id);
            if (component !== null &&
                typeof component.importState === "function") {
                // @@@ not every component is immediately available
                // @@@ some components should be considered disposed of
                component.importState(componentState);
            }
        }
    }
};

/**
 * Passes through to History.js History.getState function.
 *
 * @static
 * @returns {Object}
 */
Exhibit.History.getState = function() {
    if (Exhibit.History.enabled) {
        return History.getState();
    } else {
        return null;
    }
};

Exhibit.History.setComponentState = function(state, component, registry, data, lengthy) {
    if (typeof state === "undefined" || state === null) {
        state = { "data": { "components": {} } };
    }

    if (typeof state["data"] === "undefined") {
        state.data = { "components": {} };
    }
    if (typeof state.data["components"] === "undefined") {
        state.data.components = {};
    }

    state.data.lengthy = lengthy;
    state.data.components[component.getID()] = {
        "type": registry,
        "state": data
    };

    return state;
};

Exhibit.History.pushComponentState = function(component, registry, data, subtitle, lengthy) {
    var state = Exhibit.History.getState();
    Exhibit.History.setComponentState(state, component, registry, data, lengthy);
    Exhibit.History.pushState(state.data, subtitle);
};

/**
 * Passes through to History.js History.pushState function.
 * 
 * @static
 * @param {Object} data
 * @param {String} subtitle
 */
Exhibit.History.pushState = function(data, subtitle) {
    var title, url;

    if (Exhibit.History.enabled) {
        Exhibit.History._state++;
        data.state = Exhibit.History._state;

        title = Exhibit.History._originalTitle;

        if (typeof subtitle !== "undefined" &&
            subtitle !== null &&
            subtitle !== "") {
            title += " {" + subtitle + "}";
        }
        
        url = Exhibit.History._originalLocation;
        
        History.pushState(data, title, url);
    }
};

/**
 * Passes through to History.js History.replaceState function.
 * 
 * @static
 * @param {Object} data
 * @param {String} subtitle
 * @param {String} url
 */
Exhibit.History.replaceState = function(data, subtitle, url) {
    var title, currentState;

    if (Exhibit.History.enabled) {
        currentState = Exhibit.History.getState();
        title = Exhibit.History._originalTitle;

        if (typeof subtitle !== "undefined" &&
            subtitle !== null &&
            subtitle !== "") {
            title += " {" + subtitle + "}";
        } else {
            if (typeof currentState.title !== "undefined") {
                title = Exhibit.History.getState().title;
            }
        }

        if ((typeof url === "undefined" || url === null) &&
            typeof currentState.url !== "undefined") {
            url = currentState.url;
        }
        
        History.replaceState(data, title, url);
    }
};

/**
 * Pushes an empty state into the history state tracker so the next refresh
 * will start from scratch.
 * 
 * @static
 */
Exhibit.History.eraseState = function() {
    Exhibit.History.pushState({});
};

Exhibit.jQuery(document).bind("importReady.exhibit",
                 Exhibit.History.componentStateListener);
/**
 * @author Dvaid Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @fileOverview HTML utility functions
 */

/**
 * @namespace For utilities related to HTML entities.
 */
Exhibit.Util.HTML = {};

/**
 * A hash of entities to Unicode code points.
 *
 * @private
 * @constant
 */
Exhibit.Util.HTML._e2uHash = {};

(function() {
    var e2uHash = Exhibit.Util.HTML._e2uHash;
    e2uHash['quot'] = '\u0022';
    // jslint thinks escaping normal ASCII characters is unexpected, so
    // letting these stand as they are instead of their Unicode representation
    e2uHash['amp'] = '&';
    e2uHash['lt'] = '<';
    e2uHash['gt'] = '>';
    e2uHash['nbsp'] = '\u00A0[space]';
    e2uHash['iexcl'] = '\u00A1';
    e2uHash['cent'] = '\u00A2';
    e2uHash['pound'] = '\u00A3';
    e2uHash['curren'] = '\u00A4';
    e2uHash['yen'] = '\u00A5';
    e2uHash['brvbar'] = '\u00A6';
    e2uHash['sect'] = '\u00A7';
    e2uHash['uml'] = '\u00A8';
    e2uHash['copy'] = '\u00A9';
    e2uHash['ordf'] = '\u00AA';
    e2uHash['laquo'] = '\u00AB';
    e2uHash['not'] = '\u00AC';
    e2uHash['shy'] = '\u00AD';
    e2uHash['reg'] = '\u00AE';
    e2uHash['macr'] = '\u00AF';
    e2uHash['deg'] = '\u00B0';
    e2uHash['plusmn'] = '\u00B1';
    e2uHash['sup2'] = '\u00B2';
    e2uHash['sup3'] = '\u00B3';
    e2uHash['acute'] = '\u00B4';
    e2uHash['micro'] = '\u00B5';
    e2uHash['para'] = '\u00B6';
    e2uHash['middot'] = '\u00B7';
    e2uHash['cedil'] = '\u00B8';
    e2uHash['sup1'] = '\u00B9';
    e2uHash['ordm'] = '\u00BA';
    e2uHash['raquo'] = '\u00BB';
    e2uHash['frac14'] = '\u00BC';
    e2uHash['frac12'] = '\u00BD';
    e2uHash['frac34'] = '\u00BE';
    e2uHash['iquest'] = '\u00BF';
    e2uHash['Agrave'] = '\u00C0';
    e2uHash['Aacute'] = '\u00C1';
    e2uHash['Acirc'] = '\u00C2';
    e2uHash['Atilde'] = '\u00C3';
    e2uHash['Auml'] = '\u00C4';
    e2uHash['Aring'] = '\u00C5';
    e2uHash['AElig'] = '\u00C6';
    e2uHash['Ccedil'] = '\u00C7';
    e2uHash['Egrave'] = '\u00C8';
    e2uHash['Eacute'] = '\u00C9';
    e2uHash['Ecirc'] = '\u00CA';
    e2uHash['Euml'] = '\u00CB';
    e2uHash['Igrave'] = '\u00CC';
    e2uHash['Iacute'] = '\u00CD';
    e2uHash['Icirc'] = '\u00CE';
    e2uHash['Iuml'] = '\u00CF';
    e2uHash['ETH'] = '\u00D0';
    e2uHash['Ntilde'] = '\u00D1';
    e2uHash['Ograve'] = '\u00D2';
    e2uHash['Oacute'] = '\u00D3';
    e2uHash['Ocirc'] = '\u00D4';
    e2uHash['Otilde'] = '\u00D5';
    e2uHash['Ouml'] = '\u00D6';
    e2uHash['times'] = '\u00D7';
    e2uHash['Oslash'] = '\u00D8';
    e2uHash['Ugrave'] = '\u00D9';
    e2uHash['Uacute'] = '\u00DA';
    e2uHash['Ucirc'] = '\u00DB';
    e2uHash['Uuml'] = '\u00DC';
    e2uHash['Yacute'] = '\u00DD';
    e2uHash['THORN'] = '\u00DE';
    e2uHash['szlig'] = '\u00DF';
    e2uHash['agrave'] = '\u00E0';
    e2uHash['aacute'] = '\u00E1';
    e2uHash['acirc'] = '\u00E2';
    e2uHash['atilde'] = '\u00E3';
    e2uHash['auml'] = '\u00E4';
    e2uHash['aring'] = '\u00E5';
    e2uHash['aelig'] = '\u00E6';
    e2uHash['ccedil'] = '\u00E7';
    e2uHash['egrave'] = '\u00E8';
    e2uHash['eacute'] = '\u00E9';
    e2uHash['ecirc'] = '\u00EA';
    e2uHash['euml'] = '\u00EB';
    e2uHash['igrave'] = '\u00EC';
    e2uHash['iacute'] = '\u00ED';
    e2uHash['icirc'] = '\u00EE';
    e2uHash['iuml'] = '\u00EF';
    e2uHash['eth'] = '\u00F0';
    e2uHash['ntilde'] = '\u00F1';
    e2uHash['ograve'] = '\u00F2';
    e2uHash['oacute'] = '\u00F3';
    e2uHash['ocirc'] = '\u00F4';
    e2uHash['otilde'] = '\u00F5';
    e2uHash['ouml'] = '\u00F6';
    e2uHash['divide'] = '\u00F7';
    e2uHash['oslash'] = '\u00F8';
    e2uHash['ugrave'] = '\u00F9';
    e2uHash['uacute'] = '\u00FA';
    e2uHash['ucirc'] = '\u00FB';
    e2uHash['uuml'] = '\u00FC';
    e2uHash['yacute'] = '\u00FD';
    e2uHash['thorn'] = '\u00FE';
    e2uHash['yuml'] = '\u00FF';
    e2uHash['OElig'] = '';
    e2uHash['oelig'] = '\u0153';
    e2uHash['Scaron'] = '\u0160';
    e2uHash['scaron'] = '\u0161';
    e2uHash['Yuml'] = '\u0178';
    e2uHash['circ'] = '\u02C6';
    e2uHash['tilde'] = '\u02DC';
    e2uHash['ensp'] = '\u2002';
    e2uHash['emsp'] = '\u2003';
    e2uHash['thinsp'] = '\u2009';
    e2uHash['zwnj'] = '\u200C';
    e2uHash['zwj'] = '\u200D';
    e2uHash['lrm'] = '\u200E';
    e2uHash['rlm'] = '\u200F';
    e2uHash['ndash'] = '\u2013';
    e2uHash['mdash'] = '\u2014';
    e2uHash['lsquo'] = '\u2018';
    e2uHash['rsquo'] = '\u2019';
    e2uHash['sbquo'] = '\u201A';
    e2uHash['ldquo'] = '\u201C';
    e2uHash['rdquo'] = '\u201D';
    e2uHash['bdquo'] = '\u201E';
    e2uHash['dagger'] = '\u2020';
    e2uHash['Dagger'] = '\u2021';
    e2uHash['permil'] = '\u2030';
    e2uHash['lsaquo'] = '\u2039';
    e2uHash['rsaquo'] = '\u203A';
    e2uHash['euro'] = '\u20AC';
    e2uHash['fnof'] = '\u0192';
    e2uHash['Alpha'] = '\u0391';
    e2uHash['Beta'] = '\u0392';
    e2uHash['Gamma'] = '\u0393';
    e2uHash['Delta'] = '\u0394';
    e2uHash['Epsilon'] = '\u0395';
    e2uHash['Zeta'] = '\u0396';
    e2uHash['Eta'] = '\u0397';
    e2uHash['Theta'] = '\u0398';
    e2uHash['Iota'] = '\u0399';
    e2uHash['Kappa'] = '\u039A';
    e2uHash['Lambda'] = '\u039B';
    e2uHash['Mu'] = '\u039C';
    e2uHash['Nu'] = '\u039D';
    e2uHash['Xi'] = '\u039E';
    e2uHash['Omicron'] = '\u039F';
    e2uHash['Pi'] = '\u03A0';
    e2uHash['Rho'] = '\u03A1';
    e2uHash['Sigma'] = '\u03A3';
    e2uHash['Tau'] = '\u03A4';
    e2uHash['Upsilon'] = '\u03A5';
    e2uHash['Phi'] = '\u03A6';
    e2uHash['Chi'] = '\u03A7';
    e2uHash['Psi'] = '\u03A8';
    e2uHash['Omega'] = '\u03A9';
    e2uHash['alpha'] = '\u03B1';
    e2uHash['beta'] = '\u03B2';
    e2uHash['gamma'] = '\u03B3';
    e2uHash['delta'] = '\u03B4';
    e2uHash['epsilon'] = '\u03B5';
    e2uHash['zeta'] = '\u03B6';
    e2uHash['eta'] = '\u03B7';
    e2uHash['theta'] = '\u03B8';
    e2uHash['iota'] = '\u03B9';
    e2uHash['kappa'] = '\u03BA';
    e2uHash['lambda'] = '\u03BB';
    e2uHash['mu'] = '\u03BC';
    e2uHash['nu'] = '\u03BD';
    e2uHash['xi'] = '\u03BE';
    e2uHash['omicron'] = '\u03BF';
    e2uHash['pi'] = '\u03C0';
    e2uHash['rho'] = '\u03C1';
    e2uHash['sigmaf'] = '\u03C2';
    e2uHash['sigma'] = '\u03C3';
    e2uHash['tau'] = '\u03C4';
    e2uHash['upsilon'] = '\u03C5';
    e2uHash['phi'] = '\u03C6';
    e2uHash['chi'] = '\u03C7';
    e2uHash['psi'] = '\u03C8';
    e2uHash['omega'] = '\u03C9';
    e2uHash['thetasym'] = '\u03D1';
    e2uHash['upsih'] = '\u03D2';
    e2uHash['piv'] = '\u03D6';
    e2uHash['bull'] = '\u2022';
    e2uHash['hellip'] = '\u2026';
    e2uHash['prime'] = '\u2032';
    e2uHash['Prime'] = '\u2033';
    e2uHash['oline'] = '\u203E';
    e2uHash['frasl'] = '\u2044';
    e2uHash['weierp'] = '\u2118';
    e2uHash['image'] = '\u2111';
    e2uHash['real'] = '\u211C';
    e2uHash['trade'] = '\u2122';
    e2uHash['alefsym'] = '\u2135';
    e2uHash['larr'] = '\u2190';
    e2uHash['uarr'] = '\u2191';
    e2uHash['rarr'] = '\u2192';
    e2uHash['darr'] = '\u2193';
    e2uHash['harr'] = '\u2194';
    e2uHash['crarr'] = '\u21B5';
    e2uHash['lArr'] = '\u21D0';
    e2uHash['uArr'] = '\u21D1';
    e2uHash['rArr'] = '\u21D2';
    e2uHash['dArr'] = '\u21D3';
    e2uHash['hArr'] = '\u21D4';
    e2uHash['forall'] = '\u2200';
    e2uHash['part'] = '\u2202';
    e2uHash['exist'] = '\u2203';
    e2uHash['empty'] = '\u2205';
    e2uHash['nabla'] = '\u2207';
    e2uHash['isin'] = '\u2208';
    e2uHash['notin'] = '\u2209';
    e2uHash['ni'] = '\u220B';
    e2uHash['prod'] = '\u220F';
    e2uHash['sum'] = '\u2211';
    e2uHash['minus'] = '\u2212';
    e2uHash['lowast'] = '\u2217';
    e2uHash['radic'] = '\u221A';
    e2uHash['prop'] = '\u221D';
    e2uHash['infin'] = '\u221E';
    e2uHash['ang'] = '\u2220';
    e2uHash['and'] = '\u2227';
    e2uHash['or'] = '\u2228';
    e2uHash['cap'] = '\u2229';
    e2uHash['cup'] = '\u222A';
    e2uHash['int'] = '\u222B';
    e2uHash['there4'] = '\u2234';
    e2uHash['sim'] = '\u223C';
    e2uHash['cong'] = '\u2245';
    e2uHash['asymp'] = '\u2248';
    e2uHash['ne'] = '\u2260';
    e2uHash['equiv'] = '\u2261';
    e2uHash['le'] = '\u2264';
    e2uHash['ge'] = '\u2265';
    e2uHash['sub'] = '\u2282';
    e2uHash['sup'] = '\u2283';
    e2uHash['nsub'] = '\u2284';
    e2uHash['sube'] = '\u2286';
    e2uHash['supe'] = '\u2287';
    e2uHash['oplus'] = '\u2295';
    e2uHash['otimes'] = '\u2297';
    e2uHash['perp'] = '\u22A5';
    e2uHash['sdot'] = '\u22C5';
    e2uHash['lceil'] = '\u2308';
    e2uHash['rceil'] = '\u2309';
    e2uHash['lfloor'] = '\u230A';
    e2uHash['rfloor'] = '\u230B';
    e2uHash['lang'] = '\u2329';
    e2uHash['rang'] = '\u232A';
    e2uHash['loz'] = '\u25CA';
    e2uHash['spades'] = '\u2660';
    e2uHash['clubs'] = '\u2663';
    e2uHash['hearts'] = '\u2665';
    e2uHash['diams'] = '\u2666'; 
}());

/**
 * Converts HTML entities into their Unicode equivalents within a string.
 *
 * @static
 * @param {String} s A string possibly containing HTML entities.
 * @returns {String} The same string with all entities replaced by Unicode
 *                   equivalents.
 */
Exhibit.Util.HTML.deEntify = function(s) {
    var m, re = /&(\w+?);/, e2uHash = Exhibit.Util.HTML._e2uHash;
    
    while (re.test(s)) {
        m = s.match(re);
        s = s.replace(re, e2uHash[m[1]]);
    }
    return s;
};
/**
 * @fileOverview Localization handlers
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {String} locale
 * @param {String} url
 */
Exhibit.Locale = function(locale, url) {
    this._locale = locale;
    this._url = url;
    Exhibit.Localization.registerLocale(this._locale, this);
};

/**
 * @returns {String}
 */
Exhibit.Locale.prototype.getURL = function() {
    return this._url;
};

/**
 * @namespace All localization keys and strings fit under this namespace.
 */
Exhibit.l10n = {};

/**
 * Localizing function; take an identifying key and return the most specific
 * localization possible for it.  May return undefined if no match can be
 * found.
 * @see http://purl.eligrey.com/l10n.js
 * @requires sprintf.js
 * @param {String} s The key of the localized string to use.
 * @param [arguments] Any number of optional arguments that may be used in
 *     displaying the message, like numbers for count-dependent messages.
 * @returns Usually returns a string but may return arrays, booleans, etc.
 *     depending on what was localized.  Ideally this would not return a
 *     data structure.
 */
Exhibit._ = function() {
    var key, s, args;
    args = [].slice.apply(arguments);
    if (args.length > 0) {
        key = args.shift();
        s = Exhibit.Localization.lookup(key);
        if (typeof s !== "undefined") {
            return vsprintf(s, args);
        } else {
            return s;
        }
    }
};

/**
 * @namespace
 */
Exhibit.Localization = {
    _registryKey: "l10n",
    _registry: null,
    _lastResortLocale: "en",
    _currentLocale: undefined,
    _loadedLocales: []
};

/**
 * @static
 */
Exhibit.Localization._registerComponent = function(evt, reg) {
    var i, locale, clientLocales, segments;
    Exhibit.Localization._registry = reg;
    Exhibit.locales.push(Exhibit.Localization._lastResortLocale);

    clientLocales = (typeof navigator.language === "string" ?
                     navigator.language :
                     (typeof navigator.browserLanguage === "string" ?
                      navigator.browserLanguage :
                      Exhibit.Localization._lastResortLocale)).split(";");

    for (i = 0; i < clientLocales.length; i++) {
        locale = clientLocales[i];
        if (locale !== Exhibit.Localization._lastResortLocale) {
            segments = locale.split("-");
            if (segments.length > 1 &&
                segments[0] !== Exhibit.Localization._lastResortLocale) {
                Exhibit.locales.push(segments[0]);
            }
            Exhibit.locales.push(locale);
        }
    }

    if (typeof Exhibit.params.locale === "string") {
        if (Exhibit.params.locale !== Exhibit.Localization._lastResortLocale) {
            segments = Exhibit.params.locale.split("-");
            if (segments.length > 1 &&
                segments[0] !== Exhibit.Localization._lastResortLocale) {
                Exhibit.locales.push(segments[0]);
            }
            Exhibit.locales.push(Exhibit.params.locale);
        }
    }

    if (!reg.hasRegistry(Exhibit.Localization._registryKey)) {
        reg.createRegistry(Exhibit.Localization._registryKey);
        Exhibit.jQuery(document).trigger("registerLocales.exhibit");
    }
};

/**
 * @static
 * @param {String} locale
 * @returns {Boolean}
 */
Exhibit.Localization.registerLocale = function(locale, l10n) {
    if (!Exhibit.Localization._registry.isRegistered(
        Exhibit.Localization._registryKey,
        locale
    )) {
        Exhibit.Localization._registry.register(
            Exhibit.Localization._registryKey,
            locale,
            l10n
        );
        Exhibit.jQuery(document).trigger("localeRegistered.exhibit");
        return true;
    } else {
        return false;
    }
};

/**
 * @param {String} locale
 * @returns {Boolean}
 */
Exhibit.Localization.hasLocale = function(locale) {
    return Exhibit.Localization._registry.isRegistered(
        Exhibit.Localization._registryKey,
        locale
    );
};

/**
 * @param {String} locale
 * @returns {Exhibit.Locale}
 */
Exhibit.Localization.getLocale = function(locale) {
    return Exhibit.Localization._registry.get(
        Exhibit.Localization._registryKey,
        locale
    );
};

/**
 * @param {Array} locales
 */
Exhibit.Localization.setLocale = function(locales) {
    var i, locale, urls;

    urls = [];
    for (i = locales.length - 1; i >= 0; i--) {
        locale = locales[i];
        if (Exhibit.Localization.hasLocale(locale)) {
            if (typeof Exhibit.Localization._currentLocale === "undefined") {
                Exhibit.Localization._currentLocale = locale;
            }
            Exhibit.Localization._loadedLocales.push(locale);
            urls.push(Exhibit.Localization.getLocale(locale).getURL());
        }
    }

    Exhibit.jQuery(document).trigger(
        "localeSet.exhibit",
        [urls]
    );
};

/**
 * @returns {String}
 */
Exhibit.Localization.getCurrentLocale = function() {
    return Exhibit.Localization._currentLocale;
};

/**
 * Given a list of extension locales, return the viable locales that
 * should be loaded, based on what core locales were loaded.  Assume
 * that a localization not available and loaded in core is not an
 * interesting extension locale to load.
 * @param {Array} possibles
 * @returns {Array}
 */
Exhibit.Localization.getLoadableLocales = function(possibles) {
    var i, loaded, loadable;
    loaded = Exhibit.Localization._loadedLocales;
    loadable = [];
    for (i = 0; i < loaded.length; i++) {
        if (possibles.indexOf(loaded[i]) >= 0) {
            loadable.push(loaded[i]);
        }
    }
    return loadable;
};

/**
 * Import core localization.
 * @param {String} locale
 * @param {Object} hash
 */
Exhibit.Localization.importLocale = function(locale, hash) {
    if (typeof Exhibit.l10n[locale] === "undefined") {
        Exhibit.l10n[locale] = hash;
        Exhibit.jQuery(document).trigger("localeLoaded.exhibit", [locale]);
    }
};

/**
 * Import extension localization.
 * @param {String} locale
 * @param {Object} hash
 */
Exhibit.Localization.importExtensionLocale = function(locale, hash) {
    if (typeof Exhibit.l10n[locale] !== "undefined") {
        Exhibit.jQuery.extend(Exhibit.l10n[locale], hash);
    } else {
        Exhibit.l10n[locale] = hash;
    }
};

/**
 * Decodes UTF-8 strings to output in HTML
 * @param {String} s
 * @returns {String}
 * @see http://ecmanaut.blogspot.com/2006/07/encoding-decoding-utf8-in-javascript.html
 */
Exhibit.Localization.decodeUTF8 = function(s) {
    var r;
    try {
        r = decodeURIComponent(escape(s));
    } catch (e) {
        r = s;
    }
    return r;
};

/**
 * Looks up a key in the set of localization and returns the corresponding
 * message; may return undefined if not found.
 * @param {String} key
 * @returns {String}
 */
Exhibit.Localization.lookup = function(key) {
    var i, locale;
    for (i = 0; i < Exhibit.Localization._loadedLocales.length; i++) {
        locale = Exhibit.Localization._loadedLocales[i];
        if (typeof Exhibit.l10n[locale] !== "undefined") {
            if (typeof Exhibit.l10n[locale][key] !== "undefined") {
                return Exhibit.Localization.decodeUTF8(Exhibit.l10n[locale][key]);
            }
        }
    }
    return undefined;
};

Exhibit.jQuery(document).one(
    "registerLocalization.exhibit",
    Exhibit.Localization._registerComponent
);

Exhibit.jQuery(document).bind(
    "localesRegistered.exhibit",
    function() {
        Exhibit.Localization.setLocale(Exhibit.locales);
    }
);
/**
 * @fileOverview Support methods surrounding generating a URL for an item
 *               in the database.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace Contains support methods for generating persistent URLs for
 *            items in an Exhibit database.
 */
Exhibit.Persistence = {
    /**
     * Cached URL without query portion.
     */
    "_urlWithoutQuery": null,

    /**
     * Cached URL without query and hash portions.
     */
    "_urlWithoutQueryAndHash": null
};

/**
 * Given a relative or absolute URL, determine the fragment of the
 * corresponding absolute URL up to its last '/' character (relative URLs
 * are resolved relative to the document location).
 * 
 * @param {String} url Starting URL to derive a base URL from.
 * @returns {String} The base URL.
 */
Exhibit.Persistence.getBaseURL = function(url) {
    // HACK: for some unknown reason Safari keeps throwing
    //      TypeError: no default value
    // when this function is called from the RDFa importer. So I put a try catch here.
    var url2, i;
    try {
        if (url.indexOf("://") < 0) {
            url2 = Exhibit.Persistence.getBaseURL(document.location.href);
            if (url.substr(0, 1) === "/") {
                url = url2.substr(0, url2.indexOf("/", url2.indexOf("://") + 3)) + url;
            } else {
                url = url2 + url;
            }
        }
        i = url.indexOf("#");
        if (i >= 0) {
            url = url.substr(0, i);
        }
        i = url.lastIndexOf("/");
        if (i < 0) {
            return "";
        } else {
            return url.substr(0, i + 1);
        }
    } catch (e) {
        return url;
    }
};

/**
 * Given a relative or absolute URL, return the absolute URL (resolving
 * relative to the document location). 
 *
 * @param {String} url The orignal URL to resolve.
 * @returns {String} The resolved URL.
 */
Exhibit.Persistence.resolveURL = function (url) {
    var url2, hash;
    if (url.indexOf('#') === 0) {  //resolving a fragment identifier
        hash = document.location.href.indexOf('#');
        if (hash < 0) {  //no current fragment
            url = document.location.href + url;
        } else {
            url = document.location.href.substring(0, hash) + url;
        }
    } else if (url.indexOf("://") < 0) {
        url2 = Exhibit.Persistence.getBaseURL(document.location.href);
        if (url.substr(0, 1) === "/") {
            url = url2.substr(0, url2.indexOf("/", url2.indexOf("://") + 3)) + url;
        } else {
            url = url2 + url;
        }
    }
    return url;
};

/**
 * Return the current document location without the query and hash portions
 * of the URL.
 *
 * @returns {String} The document's location without query and hash portions.
 */
Exhibit.Persistence.getURLWithoutQueryAndHash = function() {
    var url, hash, question;
    if (Exhibit.Persistence._urlWithoutQueryAndHash === null) {
        url = document.location.href;
        
        hash = url.indexOf("#");
        question = url.indexOf("?");
        if (question >= 0) {
            url = url.substr(0, question);
        } else if (hash >= 0) {
            url = url.substr(0, hash);
        }
        
        Exhibit.Persistence._urlWithoutQueryAndHash = url;
    }
    return Exhibit.Persistence._urlWithoutQueryAndHash;
};

/**
 * Return the current document location without the query portion of the URL.
 * If there is also a hash, it is also ignored.
 *
 * @returns {String} The document's location without a query portion.
 */
Exhibit.Persistence.getURLWithoutQuery = function() {
    var url, question;
    if (Exhibit.Persistence._urlWithoutQuery === null) {
        url = document.location.href;
        
        question = url.indexOf("?");
        if (question >= 0) {
            url = url.substr(0, question);
        }
        
        Exhibit.Persistence._urlWithoutQuery = url;
    }
    return Exhibit.Persistence._urlWithoutQuery;
};

/**
 * Return a URL to one item in this Exhibit, encoding it as a hash relative to
 * the URL without query and hash. 
 *
 * @param {String} itemID The item's database identifier.
 * @returns {String} A URL to Exhibit highlighting the item.
 */
Exhibit.Persistence.getItemLink = function(itemID) {
    return Exhibit.Persistence.getURLWithoutQueryAndHash() + "#" + encodeURIComponent(itemID);
};
/**
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @fileOverview Pertaining to the Exhibit.Set datatype.
 */

/**
 * A basic set (in the mathematical sense) data structure.  Only numerical
 * or string values can be used.  Any other data type would be considered
 * equivalent to a generic object and cannot be added.
 *
 * @constructor
 * @class Represents a mathematical set.
 * @param {Array|Exhibit.Set} [a] An initial collection.
 * @example
 * var set = new Exhibit.Set(['a']);
 */
Exhibit.Set = function(a) {
    this._hash = {};
    this._count = 0;
    var i;

    if (a instanceof Array) {
        for (i = 0; i < a.length; i++) {
            this.add(a[i]);
        }
    } else if (a instanceof Exhibit.Set) {
        this.addSet(a);
    }
};

/**
 * Adds the given single String or Number object to this set, assuming it
 * does not already exist.  Other types will be rejected.
 *
 * @param {String|Number|Boolean} o The object to add.
 * @returns {Boolean} True if the object was added, false if not.
 */
Exhibit.Set.prototype.add = function(o) {
    if ((typeof o === "number" || typeof o === "string" || typeof o === "boolean")
        && typeof this._hash[o] === "undefined") {
        this._hash[o] = true;
        this._count++;
        return true;
    }
    return false;
};

/**
 * Adds each element in the given set to this set.
 *
 * @param {Exhibit.Set} set The set of elements to add.
 */
Exhibit.Set.prototype.addSet = function(set) {
    var o;
    for (o in set._hash) {
        if (set._hash.hasOwnProperty(o)) {
            this.add(o);
        }
    }
};

/**
 * Removes the given single element from this set.
 *
 * @param {String|Number|Boolean} o The object to remove.
 * @returns {Boolean} True if the object was successfully removed,
 *   false otherwise.
 */
Exhibit.Set.prototype.remove = function(o) {
    if (typeof this._hash[o] !== "undefined") {
        delete this._hash[o];
        this._count--;
        return true;
    }
    return false;
};

/**
 * Removes the elements in this set that correspond to the elements in the
 * given set.
 *
 * @param {Exhibit.Set} set The set of elements to remove.
 */
Exhibit.Set.prototype.removeSet = function(set) {
    var o;
    for (o in set._hash) {
        if (set._hash.hasOwnProperty(o)) {
            this.remove(o);
        }
    }
};

/**
 * Removes all elements in this set that are not present in the given set, i.e.
 * modifies this set to the intersection of the two sets.
 *
 * @param {Exhibit.Set} set The set to intersect.
 */
Exhibit.Set.prototype.retainSet = function(set) {
    var o;
    for (o in this._hash) {
        if (this._hash.hasOwnProperty(o)) {
            if (!set.contains(o)) {
                delete this._hash[o];
                this._count--;
            }
        }
    }
};

/**
 * Returns whether or not the given element exists in this set.
 *
 * @param {String|Number} o The object to test for.
 * @returns {Boolean} True if the object is present, false otherwise.
 */
Exhibit.Set.prototype.contains = function(o) {
    return typeof this._hash[o] !== "undefined";
};

/**
 * Returns the number of elements in this set.
 *
 * @returns {Number} The number of elements in this set.
 */
Exhibit.Set.prototype.size = function() {
    return this._count;
};

/**
 * Returns the elements of this set as an array.
 *
 * @returns {Array} A new array containing the elements of this set.
 */
Exhibit.Set.prototype.toArray = function() {
    var o, a = [];
    for (o in this._hash) {
        if (this._hash.hasOwnProperty(o)) {
            a.push(o);
        }
    }
    return a;
};

/**
 * Iterates through the elements of this set, order unspecified, executing the
 * given function on each element until the function returns true.
 *
 * @param {Function} f A function of form f(element).
 */
Exhibit.Set.prototype.visit = function(f) {
    var o;
    for (o in this._hash) {
        if (this._hash.hasOwnProperty(o)) {
            if (f(o) === true) {
                break;
            }
        }
    }
};

/**
 * Creates a new set based on the intersection of two other sets.
 *
 * @static
 * @param {Exhibit.Set} set1 The first set to intersect
 * @param {Exhibit.Set} set2 The second set to intersect; order is irrelevant
 * @param {Exhibit.Set} [result] An optional set to modify by adding each
 *                               element in the intersection
 * @returns {Exhibit.Set} Either a new set or the modified set containing
 *                        the intersection of sets.
 */
Exhibit.Set.createIntersection = function(set1, set2, result) {
    var setA, setB, set = (result) ? result : new Exhibit.Set();
    if (set1.size() < set2.size()) {
        setA = set1;
        setB = set2;
    } else {
        setA = set2;
        setB = set1;
    }
    setA.visit(function (v) {
        if (setB.contains(v)) {
            set.add(v);
        }
    });
    return set;
};
/**
 * @fileOverview Utilities for various parts of Exhibit to collect
 *    their settings.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.SettingsUtilities = {};

/**
 * @param {Object} config
 * @param {Object} specs
 * @param {Object} settings
 */
Exhibit.SettingsUtilities.collectSettings = function(config, specs, settings) {
    Exhibit.SettingsUtilities._internalCollectSettings(
        function(field) { return config[field]; },
        specs,
        settings
    );
};

/**
 * @param {Element} configElmt
 * @param {Object} specs
 * @param {Object} settings
 */
Exhibit.SettingsUtilities.collectSettingsFromDOM = function(configElmt, specs, settings) {
    Exhibit.SettingsUtilities._internalCollectSettings(
        function(field) { return Exhibit.getAttribute(configElmt, field); },
        specs,
        settings
    );
};

/**
 * @param {Function} f
 * @param {Object} specs
 * @param {Object} settings
 */
Exhibit.SettingsUtilities._internalCollectSettings = function(f, specs, settings) {
    var field, spec, name, value, type, dimensions, separator, a, i;

    for (field in specs) {
        if (specs.hasOwnProperty(field)) {
            spec = specs[field];
            name = field;
            if (typeof spec.name !== "undefined") {
                name = spec.name;
            }
            if (typeof settings[name] === "undefined" &&
                typeof spec.defaultValue !== "undefined") {
                settings[name] = spec.defaultValue;
            }
        
            value = f(field);
            if (typeof value !== "undefined" && value !== null) {
                if (typeof value === "string") {
                    value = value.trim();
                }
            }

            if (typeof value !== "undefined" && value !== null && ((typeof value === "string" && value.length > 0) || typeof value !== "string")) {
                type = "text";
                if (typeof spec.type !== "undefined") {
                    type = spec.type;
                }
                
                dimensions = 1;
                if (typeof spec.dimensions !== "undefined") {
                    dimensions = spec.dimensions;
                }
                
                try {
                    if (dimensions > 1) {
                        separator = ",";
                        if (typeof spec.separator !== "undefined") {
                            separator = spec.separator;
                        }

                        a = value.split(separator);
                        if (a.length !== dimensions) {
                            throw new Error(Exhibit._("%settings.error.inconsistentDimensions", dimensions, separator, value));
                        } else {
                            for (i = 0; i < a.length; i++) {
                                a[i] = Exhibit.SettingsUtilities._parseSetting(a[i].trim(), type, spec);
                            }
                            settings[name] = a;
                        }
                    } else {
                        settings[name] = Exhibit.SettingsUtilities._parseSetting(value, type, spec);
                    }
                } catch (e) {
                    Exhibit.Debug.exception(e);
                }
            }
        }
    }
};

/**
 * @param {String|Number|Boolean|Function} s
 * @param {String} type
 * @param {Object} spec
 * @param {Array} spec.choices
 * @throws Error
 */
Exhibit.SettingsUtilities._parseSetting = function(s, type, spec) {
    var sType, f, n, choices, i;
    sType = typeof s;
    if (type === "text") {
        return s;
    } else if (type === "float") {
        if (sType === "number") {
            return s;
        } else if (sType === "string") {
            f = parseFloat(s);
            if (!isNaN(f)) {
                return f;
            }
        }
        throw new Error(Exhibit._("%settings.error.notFloatingPoint", s));
    } else if (type === "int") {
        if (sType === "number") {
            return Math.round(s);
        } else if (sType === "string") {
            n = parseInt(s, 10);
            if (!isNaN(n)) {
                return n;
            }
        }
        throw new Error(Exhibit._("%settings.error.notInteger", s));
    } else if (type === "boolean") {
        if (sType === "boolean") {
            return s;
        } else if (sType === "string") {
            s = s.toLowerCase();
            if (s === "true") {
                return true;
            } else if (s === "false") {
                return false;
            }
        }
        throw new Error(Exhibit._("%settings.error.notBoolean", s));
    } else if (type === "function") {
        if (sType === "function") {
            return s;
        } else if (sType === "string") {
            try {
                f = eval(s);
                if (typeof f === "function") {
                    return f;
                }
            } catch (e) {
                // silent
            }
        }
        throw new Error(Exhibit._("%settings.error.notFunction", s));
    } else if (type === "enum") {
        choices = spec.choices;
        for (i = 0; i < choices.length; i++) {
            if (choices[i] === s) {
                return s;
            }
        }
        throw new Error(Exhibit._("%settings.error.notEnumerated", choices.join(", "), s));
    } else {
        throw new Error(Exhibit._("%settings.error.unknownSetting", type));
    }
};

/**
 * @param {Object} config
 * @param {Object} specs
 * @param {Object} accessors
 */
Exhibit.SettingsUtilities.createAccessors = function(config, specs, accessors) {
    Exhibit.SettingsUtilities._internalCreateAccessors(
        function(field) { return config[field]; },
        specs,
        accessors
    );
};

/**
 * @param {Element} configElmt
 * @param {Object} specs
 * @param {Object} accessors
 */
Exhibit.SettingsUtilities.createAccessorsFromDOM = function(configElmt, specs, accessors) {
    Exhibit.SettingsUtilities._internalCreateAccessors(
        function(field) { return Exhibit.getAttribute(configElmt, field); },
        specs,
        accessors
    );
};

/**
 * @param {Function} f
 * @param {Object} specs
 * @param {Object} accessors
 */ 
Exhibit.SettingsUtilities._internalCreateAccessors = function(f, specs, accessors) {
    var field, spec, accessorName, acessor, isTuple, createOneAccessor, alternatives, i, noop;

    noop = function(value, database, visitor) {};

    createOneAccessor = function(spec2) {
        isTuple = false;
        if (typeof spec2["bindings"] !== "undefined") {
            return Exhibit.SettingsUtilities._createBindingsAccessor(f, spec2.bindings);
        } else if (typeof spec2["bindingNames"] !== "undefined") {
            isTuple = true;
            return Exhibit.SettingsUtilities._createTupleAccessor(f, spec2);
        } else {
            return Exhibit.SettingsUtilities._createElementalAccessor(f, spec2);
        }
    };

    for (field in specs) {
        if (specs.hasOwnProperty(field)) {
            spec = specs[field];
            accessorName = spec.accessorName;
            accessor = null;
            isTuple = false;

            if (typeof spec["alternatives"] !== "undefined") {
                alternatives = spec.alternatives;
                for (i = 0; i < alternatives.length; i++) {
                    accessor = createOneAccessor(alternatives[i]);
                    if (accessor !== null) {
                        break;
                    }
                }
            } else {
                accessor = createOneAccessor(spec);
            }
        
            if (accessor !== null) {
                accessors[accessorName] = accessor;
            } else if (typeof accessors[accessorName] === "undefined") {
                accessors[accessorName] = noop;
            }
        }
    }
};

/**
 * @param {Function} f
 * @param {Array} bindingSpecs
 * @returns {Function}
 */
Exhibit.SettingsUtilities._createBindingsAccessor = function(f, bindingSpecs) {
    var bindings, i, bindingSpec, accessor, isTuple;
    bindings = [];
    for (i = 0; i < bindingSpecs.length; i++) {
        bindingSpec = bindingSpecs[i];
        accessor = null;
        isTuple = false;
        
        if (typeof bindingSpec["bindingNames"] !== "undefined") {
            isTuple = true;
            accessor = Exhibit.SettingsUtilities._createTupleAccessor(f, bindingSpec);
        } else {
            accessor = Exhibit.SettingsUtilities._createElementalAccessor(f, bindingSpec);
        }
        
        if (typeof accessor === "undefined" || accessor === null) {
            if (typeof bindingSpec["optional"] === "undefined" || !bindingSpec.optional) {
                return null;
            }
        } else {
            bindings.push({
                bindingName:    bindingSpec.bindingName, 
                accessor:       accessor, 
                isTuple:        isTuple
            });
        }
    }
    
    return function(value, database, visitor) {
        Exhibit.SettingsUtilities._evaluateBindings(value, database, visitor, bindings);
    };
};

/**
 * @param {Function} f
 * @param {Object} spec
 * @returns {Function}
 */
Exhibit.SettingsUtilities._createTupleAccessor = function(f, spec) {
    var value, expression, parsers, bindingTypes, bindingNames, separator, i;
    value = f(spec.attributeName);

    if (typeof value === "undefined" || value === null) {
        return null;
    }
    
    if (typeof value === "string") {
        value = value.trim();
        if (value.length === 0) {
            return null;
        }
    }
    
    try {
        expression = Exhibit.ExpressionParser.parse(value);
        
        parsers = [];
        bindingTypes = spec.types;
        for (i = 0; i < bindingTypes.length; i++) {
            parsers.push(Exhibit.SettingsUtilities._typeToParser(bindingTypes[i]));
        }
        
        bindingNames = spec.bindingNames;
        separator = ",";

        if (typeof spec["separator"] !== "undefined") {
            separator = spec.separator;
        }
        
        return function(itemID, database, visitor, tuple) {
            expression.evaluateOnItem(itemID, database).values.visit(
                function(v) {
                    var a, tuple2, n, j;
                    a = v.split(separator);
                    if (a.length === parsers.length) {
                        tuple2 = {};
                        if (tuple) {
                            for (n in tuple) {
                                if (tuple.hasOwnProperty(n)) {
                                    tuple2[n] = tuple[n];
                                }
                            }
                        }

                        for (j = 0; j < bindingNames.length; j++) {
                            tuple2[bindingNames[j]] = null;
                            parsers[j](a[j], function(v) { tuple2[bindingNames[j]] = v; });
                        }
                        visitor(tuple2);
                    }
                }
            );
        };

    } catch (e) {
        Exhibit.Debug.exception(e);
        return null;
    }
};

/**
 * @param {Function} f
 * @param {Object} spec
 * @param {String} spec.attributeName
 * @returns {Function}
 */
Exhibit.SettingsUtilities._createElementalAccessor = function(f, spec) {
    var value, bindingType, expression, parser;

    value = f(spec.attributeName);

    if (typeof value === "undefined" || value === null) {
        return null;
    }
    
    if (typeof value === "string") {
        value = value.trim();
        if (value.length === 0) {
            return null;
        }
    }
    
    bindingType = "text";

    if (typeof spec["type"] !== "undefined") {
        bindingType = spec.type;
    }

    try {
        expression = Exhibit.ExpressionParser.parse(value);
        parser = Exhibit.SettingsUtilities._typeToParser(bindingType);
        return function(itemID, database, visitor) {
            expression.evaluateOnItem(itemID, database).values.visit(
                function(v) { return parser(v, visitor); }
            );
        };
    } catch (e) {
        Exhibit.Debug.exception(e);
        return null;
    }
};

/**
 * @param {String} type
 * @returns {Function}
 * @throws Error
 */
Exhibit.SettingsUtilities._typeToParser = function(type) {
    switch (type) {
    case "text":    return Exhibit.SettingsUtilities._textParser;
    case "url":     return Exhibit.SettingsUtilities._urlParser;
    case "float":   return Exhibit.SettingsUtilities._floatParser;
    case "int":     return Exhibit.SettingsUtilities._intParser;
    case "date":    return Exhibit.SettingsUtilities._dateParser;
    case "boolean": return Exhibit.SettingsUtilities._booleanParser;
    default:
        throw new Error(Exhibit._("%settings.error.unknownSetting", type));

    }
};

/**
 * @param {String} v
 * @param {Function} f
 */
Exhibit.SettingsUtilities._textParser = function(v, f) {
    return f(v);
};

/**
 * @param {String} v
 * @param {Function} f
 */
Exhibit.SettingsUtilities._floatParser = function(v, f) {
    var n = parseFloat(v);
    if (!isNaN(n)) {
        return f(n);
    }
    return false;
};

/**
 * @param {String} v
 * @param {Function} f
 */
Exhibit.SettingsUtilities._intParser = function(v, f) {
    var n = parseInt(v, 10);
    if (!isNaN(n)) {
        return f(n);
    }
    return false;
};

/**
 * @param {String} v
 * @param {Function} f
 */
Exhibit.SettingsUtilities._dateParser = function(v, f) {
    var d;
    if (v instanceof Date) {
        return f(v);
    } else if (typeof v === "number") {
        d = new Date(0);
        d.setUTCFullYear(v);
        return f(d);
    } else {
        d = Exhibit.DateTime.parseIso8601DateTime(v.toString());
        if (d !== null) {
            return f(d);
        }
    }
    return false;
};

/**
 * @param {String} v
 * @param {Function} f
 */
Exhibit.SettingsUtilities._booleanParser = function(v, f) {
    v = v.toString().toLowerCase();
    if (v === "true") {
        return f(true);
    } else if (v === "false") {
        return f(false);
    }
    return false;
};

/**
 * @param {String} v
 * @param {Function} f
 */
Exhibit.SettingsUtilities._urlParser = function(v, f) {
    return f(Exhibit.Persistence.resolveURL(v.toString()));
};

/**
 * @param {String} value
 * @param {Exhibit.Database}  database
 * @param {Function} visitor
 * @param {Array} bindings
 */
Exhibit.SettingsUtilities._evaluateBindings = function(value, database, visitor, bindings) {
    var f, maxIndex;
    maxIndex = bindings.length - 1;
    f = function(tuple, index) {
        var binding, visited, recurse, bindingName;
        binding = bindings[index];
        visited = false;
        recurse = (index === maxIndex) ?
            function() { visitor(tuple); } :
            function() { f(tuple, index + 1); };
        if (binding.isTuple) {
            /*
                The tuple accessor will copy existing fields out of "tuple" into a new
                object and then injects new fields into it before calling the visitor.
                This is so that the same tuple object is not reused for different
                tuple values, which would cause old tuples to be overwritten by new ones.
             */
            binding.accessor(
                value, 
                database, 
                function(tuple2) { visited = true; tuple = tuple2; recurse(); }, 
                tuple
            );
        } else {
            bindingName = binding.bindingName;
            binding.accessor(
                value, 
                database, 
                function(v) { visited = true; tuple[bindingName] = v; recurse(); }
            );
        }
        
        if (!visited) { recurse(); }
    };
    f({}, 0);
};
/**
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @fileOverview
 */

/**
 * @namespace Utility functions for working with built-in Date objects.
 */
Exhibit.NativeDateUnit = {};

/**
 * Return right now as a Date object.
 *
 * @static
 * @returns {Date} Right now.
 */
Exhibit.NativeDateUnit.makeDefaultValue = function() {
    return new Date();
};

/**
 * Make a new Date object with the same value as the argument.
 *
 * @static
 * @param {Date} v Original Date object.
 * @returns {Date} New Date object with the same value, not identical.
 */
Exhibit.NativeDateUnit.cloneValue = function(v) {
    return new Date(v.getTime());
};

/**
 * Based on a format, return a function that can take a string and parse
 * the format into a Date object.  Currently recognizes ISO-8601 as a
 * format; all others are treated as Gregorian.
 *
 * @requires Exhibit.DateTime
 * @see Exhibit.DateTime.parseIso8601DateTime
 * @see Exhibit.DateTime.parseGregorianDateTime
 * @static
 * @param {String} format Name of the date format, commonly ISO-8601.
 * @returns {Function} A function that takes a string in the given format
 *                     and returns a Date object.
 */
Exhibit.NativeDateUnit.getParser = function(format) {
    if (typeof format === "string") {
        format = format.toLowerCase();
    }
    return (format === "iso8601" || format === "iso 8601") ?
        Exhibit.DateTime.parseIso8601DateTime : 
        Exhibit.DateTime.parseGregorianDateTime;
};

/**
 * Returns the object if a Date or parses using native (Gregorian) date
 * parsing if a String.
 *
 * @static
 * @param {Date|String} o The object to return or parse.
 * @returns {Date} The parsed string or original object.
 */
Exhibit.NativeDateUnit.parseFromObject = function(o) {
    return Exhibit.DateTime.parseGregorianDateTime(o);
};

/**
 * Converts a Date object to its numeric representation in seconds since epoch.
 *
 * @static
 * @param {Date} v The Date object to convert.
 * @returns {Number} The date value in seconds since epoch.
 */
Exhibit.NativeDateUnit.toNumber = function(v) {
    return v.getTime();
};

/**
 * Converts seconds since epoch into a Date object.
 *
 * @static
 * @param {Number} n Seconds since epoch.
 * @returns {Date} The corresponding Date object.
 */
Exhibit.NativeDateUnit.fromNumber = function(n) {
    return new Date(n);
};

/**
 * Compares two Date objects.  If the values of the two are the same, returns
 * 0.  If v1 is earlier than v2, the return value is negative.  If v1 is
 * later than v2, the return value is positive.  Also compares anything that
 * can be converted to a Number, assuming the number is measured since epoch.
 *
 * @static
 * @param {Date|String|Number} v1 First Date object or raw time value to
                                  compare.
 * @param {Date|String|Number} v2 Second Date object or raw time value to
                                  compare.
 * @returns {Number} Integer with negative, zero, or positive value depending
 *                   on relative date values.
 */
Exhibit.NativeDateUnit.compare = function(v1, v2) {
    var n1, n2;
    if (typeof v1 === "object") {
        n1 = v1.getTime();
    } else {
        n1 = Number(v1);
    }
    if (typeof v2 === "object") {
        n2 = v2.getTime();
    } else {
        n2 = Number(v2);
    }
    
    return n1 - n2;
};

/**
 * Returns the earlier object of the two passed in as arguments.
 *
 * @static
 * @param {Date} v1 The first Date object to compare.
 * @param {Date} v2 The second Date object to compare.
 * @returns {Date} The earlier of the two arguments.
 */
Exhibit.NativeDateUnit.earlier = function(v1, v2) {
    return Exhibit.NativeDateUnit.compare(v1, v2) < 0 ? v1 : v2;
};

/**
 * Returns the later object of the two passed in as arguments.
 *
 * @static
 * @param {Date} v1 The first Date object to compare.
 * @param {Date} v2 The second Date object to compare.
 * @returns {Date} The later of the two arguments.
 */
Exhibit.NativeDateUnit.later = function(v1, v2) {
    return Exhibit.NativeDateUnit.compare(v1, v2) > 0 ? v1 : v2;
};

/**
 * Make a new Date object by adding a number of seconds to the original.
 *
 * @static
 * @param {Date} v The Date object to modify.
 * @param {Number} n The number of seconds, positive or negative, to add
 *                   to the Date object.
 * @returns {Date} A new Date object with the seconds added.
 */
Exhibit.NativeDateUnit.change = function(v, n) {
    return new Date(v.getTime() + n);
};
/**
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @fileOverview Base for Exhibit utilities and native datatype modifications.
 */

/**
 * @namespace For Exhibit utility classes and methods.
 */
Exhibit.Util = {};

/**
 * Round a number n to the nearest multiple of precision (any positive value),
 * such as 5000, 0.1 (one decimal), 1e-12 (twelve decimals), or 1024 (if you'd
 * want "to the nearest kilobyte" -- so round(66000, 1024) == "65536"). You are
 * also guaranteed to get the precision you ask for, so round(0, 0.1) == "0.0".
 *
 * @static
 * @param {Number} n Original number.
 * @param {Number} [precision] Rounding bucket, by default 1.
 * @returns {String} Rounded number into the nearest bucket at the bucket's
 *                   precision, in a form readable by users.
 */
Exhibit.Util.round = function(n, precision) {
    var lg;
    precision = precision || 1;
    lg = Math.floor( Math.log(precision) / Math.log(10) );
    n = (Math.round(n / precision) * precision).toString();
    if (lg >= 0) {
        return parseInt(n, 10).toString();
    }

    lg = -lg;
    return parseFloat(n).toFixed(lg);
};

/**
 * Modify the native String type.
 */
(function() {
    if (typeof String.prototype.trim === "undefined") {
        /**
         * Removes leading and trailing spaces.
         *
         * @returns {String} Trimmed string.
         */
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    if (typeof String.prototype.startsWith === "undefined") {
        /**
         * Test if a string begins with a prefix.
         *
         * @param {String} prefix Prefix to check.
         * @returns {Boolean} True if string starts with prefix, false if not.
         */
        String.prototype.startsWith = function(prefix) {
            return this.length >= prefix.length && this.substr(0, prefix.length) === prefix;
        };
    }

    if (typeof String.prototype.endsWith === "undefined") {
        /**
         * Test if a string ends with a suffix.
         *
         * @param {String} suffix Suffix to check.
         * @returns {Boolean} True if string ends with suffix, false if not.
         */
        String.prototype.endsWith = function(suffix) {
            return this.length >= suffix.length && this.substr(this.length - suffix.length) === suffix;
        };
    }
}());
/**
 * @fileOverview View helper functions and utilities.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.ViewUtilities = {};

/**
 * @static
 * @param {Element} anchorElmt
 * @param {Array} arrayOfItemIDs
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ViewUtilities.openBubbleForItems = function(anchorElmt, arrayOfItemIDs, uiContext) {
    var coords, bubble;
    coords = Exhibit.jQuery(anchorElmt).offset();
    bubble = Exhibit.jQuery.simileBubble("createBubbleForPoint",
        coords.left + Math.round(anchorElmt.offsetWidth / 2), 
        coords.top + Math.round(anchorElmt.offsetHeight / 2), 
        uiContext.getSetting("bubbleWidth"), // px
        uiContext.getSetting("bubbleHeight") // px
    );
    Exhibit.ViewUtilities.fillBubbleWithItems(bubble.content, arrayOfItemIDs, uiContext);
};

/**
 * @@@ possibly take and return jQuery instead of elements
 * @static
 * @param {Element} bubbleElmt
 * @param {Array} arrayOfItemIDs
 * @param {Exhibit.UIContext} uiContext
 * @returns {Element}
 */
Exhibit.ViewUtilities.fillBubbleWithItems = function(bubbleElmt, arrayOfItemIDs, uiContext) {
    var ul, i, itemLensDiv, itemLens;
    if (typeof bubbleElmt === "undefined" || bubbleElmt === null) {
        bubbleElmt = Exhibit.jQuery("<div>");
    }
    
    if (arrayOfItemIDs.length > 1) {
        Exhibit.jQuery(bubbleElmt).addClass("exhibit-views-bubbleWithItems");
        
        ul = Exhibit.jQuery("<ul>");
        makeItem = function(elmt) {
            Exhibit.jQuery("<li>")
                .append(elmt)
                .appendTo(ul);
        };
        for (i = 0; i < arrayOfItemIDs.length; i++) {
            uiContext.format(arrayOfItemIDs[i], "item", makeItem);
        }
        Exhibit.jQuery(bubbleElmt).append(ul);
    } else {
        itemLensDiv = Exhibit.jQuery("<div>").get(0);
        itemLens = uiContext.getLensRegistry().createLens(arrayOfItemIDs[0], itemLensDiv, uiContext);
        Exhibit.jQuery(bubbleElmt).append(itemLensDiv);
    }
    
    return Exhibit.jQuery(bubbleElmt).get(0);
};

/**
 * @static
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @param {Boolean} showSummary
 * @param {Object} resizableDivWidgetSettings
 * @param {Object} legendWidgetSettings
 * @returns {Object}
 */
Exhibit.ViewUtilities.constructPlottingViewDom = function(
    div,
    uiContext, 
    showSummary,
    resizableDivWidgetSettings, 
    legendWidgetSettings
) { 
    var dom = Exhibit.jQuery.simileDOM("string",
        div,
        '<div class="exhibit-views-header">' +
            (showSummary ? '<div id="collectionSummaryDiv"></div>' : "") +
            '<div id="unplottableMessageDiv" class="exhibit-views-unplottableMessage"></div>' +
        "</div>" +
        '<div id="resizableDiv"></div>' +
        '<div id="legendDiv"></div>',
        {}
    );
    
    if (showSummary) {
        dom.collectionSummaryWidget = Exhibit.CollectionSummaryWidget.create(
            {}, 
            dom.collectionSummaryDiv, 
            uiContext
        );
    }
    
    dom.resizableDivWidget = Exhibit.ResizableDivWidget.create(
        resizableDivWidgetSettings,
        dom.resizableDiv, 
        uiContext
    );
    dom.plotContainer = dom.resizableDivWidget.getContentDiv();
    
    if (legendWidgetSettings.colorGradient === true) {
        dom.legendGradientWidget = Exhibit.LegendGradientWidget.create(
            dom.legendDiv,
            uiContext
        );
    } else {
        dom.legendWidget = Exhibit.LegendWidget.create(
            legendWidgetSettings,
            dom.legendDiv, 
            uiContext
        );
    }
    
    dom.setUnplottableMessage = function(totalCount, unplottableItems) {
        Exhibit.ViewUtilities._setUnplottableMessage(dom, totalCount, unplottableItems, uiContext);
    };
    dom.dispose = function() {
        if (showSummary) {
            dom.collectionSummaryWidget.dispose();
        }
        dom.resizableDivWidget.dispose();
        dom.legendWidget.dispose();
    };

    return dom;
};

/**
 * @static
 * @param {Object} dom
 * @param {Number} totalCount
 * @param {Array} unplottableItems
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ViewUtilities._setUnplottableMessage = function(dom, totalCount, unplottableItems, uiContext) {
    var div;
    div = dom.unplottableMessageDiv;
    if (unplottableItems.length === 0) {
        Exhibit.jQuery(div).hide();
    } else {
        Exhibit.jQuery(div).empty();
    
        dom = Exhibit.jQuery.simileDOM("string",
            div,
            Exhibit.ViewUtilities.unplottableMessageFormatter(totalCount, unplottableItems),
            {}
        );
        Exhibit.jQuery(dom.unplottableCountLink).bind("click", function(evt) {
            Exhibit.ViewUtilities.openBubbleForItems(evt.target, unplottableItems, uiContext);
        });
        Exhibit.jQuery(div).show();
    }
};

/**
 * @param {Number} totalCount
 * @param {Array} unplottableItems
 */
Exhibit.ViewUtilities.unplottableMessageFormatter = function(totalCount, unplottableItems) {
    var count = unplottableItems.length;
    return Exhibit._("%views.unplottableTemplate", count, Exhibit._(count === 1 ? "%views.resultLabel" : "%views.resultsLabel"), totalCount);
};

/**
 * Return labels for sort ordering based on value type; "text" is the base
 * case that is assumed to always exist in the localization utiltiies.
 * @param {String} valueType
 * @returns {Object} An object of the form { "ascending": label,
 *      "descending": label}
 */
Exhibit.ViewUtilities.getSortLabels = function(valueType) {
    var asc, desc, labels, makeKey;
    makeKey = function(v, dir) {
        return "%database.sortLabels." + v + "." + dir;
    };
    asc = Exhibit._(makeKey(valueType, "ascending"));
    if (typeof asc !== "undefined" && asc !== null) {
        labels = {
            "ascending": asc,
            "descending": Exhibit._(makeKey(valueType, "descending"))
        };
    } else {
        labels = Exhibit.ViewUtilities.getSortLabels("text");
    }
    return labels;
};

/**
 * @param {Number} index
 * @returns {String}
 */
Exhibit.ViewUtilities.makePagingActionTitle = function(index) {
    return Exhibit._("%orderedViewFrame.pagingActionTitle", index + 1);
};

/**
 * @param {Number} index
 * @returns {String}
 */
Exhibit.ViewUtilities.makePagingLinkTooltip = function(index) {
    return Exhibit._("%orderedViewFrame.pagingLinkTooltip", index + 1);
};
/**
 * @fileOverview Database interface and local implementation, with helper
 *               classes.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace Database layer of Exhibit.
 */
Exhibit.Database = {
    defaultIgnoredProperties: [ "uri", "modified" ]
};

/**
 * Instantiate an Exhibit database object.
 *
 * @static
 * @returns {Object}
 */
Exhibit.Database.create = function(type) {
    if (typeof Exhibit.Database[type] !== "undefined") {
        return new Exhibit.Database[type]();
    } else {
        // warn?
        return new Exhibit.Database._LocalImpl();
    }
};

/**
 * Add or initialize an array entry in a two-level hash, such that
 * index[x][y].push(z), given z isn't already in index[x][y].
 *
 * @static
 * @private
 * @param {Object} index Base hash; may be modified as a side-effect.
 * @param {String} x First tier entry key in the base hash.
 * @param {String} y Second tier entry key in a subhash of the base hash.
 * @param {String} z Value to put into an array in the subhash key.
 */
Exhibit.Database._indexPut = function(index, x, y, z) {
    var hash, array, i;

    hash = index[x];
    if (typeof hash === "undefined") {
        hash = {};
        index[x] = hash;
    }

    array = hash[y];
    if (typeof array === "undefined") {
        array = [];
        hash[y] = array;
    } else {
        for (i = 0; i < array.length; i++) {
            if (z === array[i]) {
                return;
            }
        }
    }

    array.push(z);
};

/**
 * Add or initialize an array entry in a two-level hash, such that
 * index[x][y] = list if undefined or index[x][y].concat(list) if already
 * defined. 
 *
 * @static
 * @private
 * @param {Object} index Base hash; may be modified as a side-effect.
 * @param {String} x First tier entry key in the base hash.
 * @param {String} y Second tier entry key in a subhash of the base hash.
 * @param {Array} list List of values to add or assign to the subhash key.
 */
Exhibit.Database._indexPutList = function(index, x, y, list) {
    var hash, array;

    hash = index[x];
    if (typeof hash === "undefined") {
        hash = {};
        index[x] = hash;
    }
    
    array = hash[y];
    if (typeof array === "undefined") {
        hash[y] = list;
    } else {
        hash[y] = hash[y].concat(list);
    }
};

/**
 * Remove the element z from the array index[x][y]; also remove
 * index[x][y] if the array becomes empty and index[x] if the hash becomes
 * empty as a result.
 *
 * @static
 * @private
 * @param {Object} index Base hash; may be modified as a side-effect.
 * @param {String} x First tier entry key in the base hash.
 * @param {String} y Second tier entry key in a subhash of the base hash.
 * @param {String} z Value to remove from an array in the subhash key.
 * @returns {Boolean} True if value removed, false if not.
 */
Exhibit.Database._indexRemove = function(index, x, y, z) {
    var hash, array, i, prop, empty;

    hash = index[x];
    if (typeof hash === "undefined") {
        return false;
    }

    array = hash[y];
    if (typeof array === "undefined") {
        return false;
    }

    for (i = 0; i < array.length; i++) {
        if (z === array[i]) {
            array.splice(i, 1);

            if (array.length === 0) {
                delete hash[y];

                empty = true;
                for (prop in hash) {
                    if (hash.hasOwnProperty(prop)) {
                        empty = false;
                        break;
                    }
                }
                if (empty) {
                    delete index[x];
                }
            }

            return true;
        }
    }
};

/**
 * Removes index[x][y] and index[x] if it becomes empty.
 *
 * @static
 * @private
 * @param {Object} index Base hash; may be modified as a side-effect.
 * @param {String} x First tier entry key in the base hash.
 * @param {String} y Second tier entry key in a subhash of the base hash.
 * @returns {Array} The removed array, or null if nothing was removed.
 */
Exhibit.Database._indexRemoveList = function(index, x, y) {
    var hash, array, prop, empty;

    hash = index[x];
    if (typeof hash === "undefined") {
        return null;
    }

    array = hash[y];
    if (typeof array === "undefined") {
        return null;
    }

    delete hash[y];

    empty = true;
    for (prop in hash) {
        if (hash.hasOwnProperty(prop)) {
            empty = false;
            break;
        }
    }
    if (empty) {
        delete index[x];
    }
    
    return array;
};
/**
 * Local in-memory implementation of the Exhibit Database.  Other
 * implementations should fully implement the interface described by
 * this class.
 *
 * @public
 * @constructor
 * @class
 */
Exhibit.Database._LocalImpl = function() {
    this._types = {};
    this._properties = {};
    this._propertyArray = {};
    
    this._spo = {};
    this._ops = {};
    this._items = new Exhibit.Set();
    
    /*
     *  Predefined types and properties
     */
    var itemType, labelProperty, typeProperty, uriProperty;
     
    itemType = new Exhibit.Database.Type("Item");
    itemType._custom = {
        "label":       Exhibit._("%database.itemType.label"),
        "pluralLabel": Exhibit._("%database.itemType.pluralLabel"),
        "uri":         Exhibit.namespace + "Item"
    };
    this._types.Item = itemType;

    labelProperty = new Exhibit.Database.Property("label", this);
    labelProperty._uri = "http://www.w3.org/2000/01/rdf-schema#label";
    labelProperty._valueType            = "text";
    labelProperty._label                = Exhibit._("%database.labelProperty.label");
    labelProperty._pluralLabel          = Exhibit._("%database.labelProperty.pluralLabel");
    labelProperty._reverseLabel         = Exhibit._("%database.labelProperty.reverseLabel");
    labelProperty._reversePluralLabel   = Exhibit._("%database.labelProperty.reversePluralLabel");
    labelProperty._groupingLabel        = Exhibit._("%database.labelProperty.groupingLabel");
    labelProperty._reverseGroupingLabel = Exhibit._("%database.labelProperty.reverseGroupingLabel");
    this._properties.label              = labelProperty;
    
    typeProperty = new Exhibit.Database.Property("type", this);
    typeProperty._uri = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    typeProperty._valueType             = "text";
    typeProperty._label                 = Exhibit._("%database.typeProperty.label");
    typeProperty._pluralLabel           = Exhibit._("%database.typeProperty.pluralLabel");
    typeProperty._reverseLabel          = Exhibit._("%database.typeProperty.reverseLabel");
    typeProperty._reversePluralLabel    = Exhibit._("%database.typeProperty.reversePluralLabel");
    typeProperty._groupingLabel         = Exhibit._("%database.typeProperty.groupingLabel");
    typeProperty._reverseGroupingLabel  = Exhibit._("%database.typeProperty.reverseGroupingLabel");
    this._properties.type               = typeProperty;
    
    uriProperty = new Exhibit.Database.Property("uri", this);
    uriProperty._uri = "http://simile.mit.edu/2006/11/exhibit#uri";
    uriProperty._valueType              = "url";
    uriProperty._label                  = Exhibit._("%database.uriProperty.label");
    uriProperty._pluralLabel            = Exhibit._("%database.uriProperty.pluralLabel");
    uriProperty._reverseLabel           = Exhibit._("%database.uriProperty.reverseLabel");
    uriProperty._reversePluralLabel     = Exhibit._("%database.uriProperty.reversePluralLabel");
    uriProperty._groupingLabel          = Exhibit._("%database.uriProperty.groupingLabel");
    uriProperty._reverseGroupingLabel   = Exhibit._("%database.uriProperty.reverseGroupingLabel");
    this._properties.uri                = uriProperty;
};

/**
 * Creates a new database.
 *
 * @returns {Exhibit.Database} The new database.
 */
Exhibit.Database._LocalImpl.prototype.createDatabase = function() {
    return Exhibit.Database.create();
};

/**
 * Load an array of data links using registered importers into the database.
 *
 * @param {Function} fDone A function to call when finished.
 */
Exhibit.Database._LocalImpl.prototype.loadLinks = function(fDone) {
    var links = Exhibit.jQuery("head > link[rel='exhibit-data']")
        .add("head > link[rel='exhibit/data']");
    this._loadLinks(links.toArray(), this, fDone);
};

/**
 * Load data from the given object into the database.
 *
 * @param {Object} o An object that reflects the Exhibit JSON form.
 * @param {String} baseURI The base URI for normalizing URIs in the object.
 */
Exhibit.Database._LocalImpl.prototype.loadData = function(o, baseURI) {
    if (typeof o === "undefined" || o === null) {
        throw Error(Exhibit._("%database.error.unloadable"));
    }
    if (typeof baseURI === "undefined") {
        baseURI = location.href;
    }
    if (typeof o.types !== "undefined") {
        this.loadTypes(o.types, baseURI);
    }
    if (typeof o.properties !== "undefined") {
        this.loadProperties(o.properties, baseURI);
    }
    if (typeof o.items !== "undefined") {
        this.loadItems(o.items, baseURI);
    }
};

/**
 * Load just the types from a data object.
 * 
 * @param {Object} typeEntries The "types" subsection of Exhibit JSON.
 * @param {String} baseURI The base URI for normalizing URIs in the object.
 */
Exhibit.Database._LocalImpl.prototype.loadTypes = function(typeEntries, baseURI) {
    Exhibit.jQuery(document).trigger('onBeforeLoadingTypes.exhibit');
    var lastChar, typeID, typeEntry, type, p;
    try {
        lastChar = baseURI.substr(baseURI.length - 1);
        if (lastChar === "#") {
            baseURI = baseURI.substr(0, baseURI.length - 1) + "/";
        } else if (lastChar !== "/" && lastChar !== ":") {
            baseURI += "/";
        }
    
        for (typeID in typeEntries) {
            if (typeEntries.hasOwnProperty(typeID)) {
                if (typeof typeID === "string") {
                    typeEntry = typeEntries[typeID];
                    if (typeof typeEntry === "object") {
                        if (typeof this._types[typeID] !== "undefined") {
                            type = this._types[typeID];
                        } else {
                            type = new Exhibit.Database.Type(typeID);
                            this._types[typeID] = type;
                        }
            
                        for (p in typeEntry) {
                            if (typeEntry.hasOwnProperty(p)) {
                                type._custom[p] = typeEntry[p];
                            }
                        }
                        
                        if (typeof type._custom.uri === "undefined") {
                            type._custom.uri = baseURI + "type#" + encodeURIComponent(typeID);
                        }
                        
                        if (typeof type._custom.label === "undefined") {
                            type._custom.label = typeID;
                        }
                    }
                }
            }
        }
        
        Exhibit.jQuery(document).trigger('onAfterLoadingTypes.exhibit');
    } catch(e) {
        Exhibit.Debug.exception(e, Exhibit._("%database.error.loadTypesFailure"));
    }
};

/**
 * Load just the properties from the data.  The valid valueType values can be:
 * text, html, number, date, boolean, item, url.
 *
 * @param {Object} propertyEntries The "properties" subsection of Exhibit JSON.
 * @param {String} baseURI The base URI for normalizing URIs in the object.
 */
Exhibit.Database._LocalImpl.prototype.loadProperties = function(propertyEntries, baseURI) {
    Exhibit.jQuery(document).trigger("onBeforeLoadingProperties.exhibit");
    var lastChar, propertyID, prpoertyEntry, property;
    try {
        lastChar = baseURI.substr(baseURI.length - 1);
        if (lastChar === "#") {
            baseURI = baseURI.substr(0, baseURI.length - 1) + "/";
        } else if (lastChar !== "/" && lastChar !== ":") {
            baseURI += "/";
        }
    
        for (propertyID in propertyEntries) {
            if (propertyEntries.hasOwnProperty(propertyID)) {
                if (typeof propertyID === "string") {
                    propertyEntry = propertyEntries[propertyID];
                    if (typeof propertyEntry === "object") {
                        if (typeof this._properties[propertyID] !== "undefined") {
                            property = this._properties[propertyID];
                        } else {
                            property = new Exhibit.Database.Property(propertyID, this);
                            this._properties[propertyID] = property;
                        }
            
                        property._uri = typeof propertyEntry.uri !== "undefined" ?
                            propertyEntry.uri :
                            (baseURI + "property#" + encodeURIComponent(propertyID));

                        property._valueType = typeof propertyEntry.valueType !== "undefined" ?
                            propertyEntry.valueType :
                            "text";
            
                        property._label = typeof propertyEntry.label !== "undefined" ?
                            propertyEntry.label :
                            propertyID;

                        property._pluralLabel = typeof propertyEntry.pluralLabel !== "undefined" ?
                            propertyEntry.pluralLabel :
                            property._label;
            
                        property._reverseLabel = typeof propertyEntry.reverseLabel !== "undefined" ?
                            propertyEntry.reverseLabel :
                            ("!" + property._label);

                        property._reversePluralLabel = typeof propertyEntry.reversePluralLabel !== "undefined" ?
                            propertyEntry.reversePluralLabel :
                            ("!" + property._pluralLabel);
            
                        property._groupingLabel = typeof propertyEntry.groupingLabel !== "undefined" ?
                            propertyEntry.groupingLabel :
                            property._label;

                        property._reverseGroupingLabel = typeof propertyEntry.reverseGroupingLabel !== "undefined" ?
                            propertyEntry.reverseGroupingLabel :
                            property._reverseLabel;
            
                        if (typeof propertyEntry.origin !== "undefined") {
                            property._origin = propertyEntry.origin;
                        }
                    }
                }
            }
        }

        this._propertyArray = null;
        
        Exhibit.jQuery(document).trigger("onAfterLoadingProperties.exhibit");
    } catch(e) {
        Exhibit.Debug.exception(e, Exhibit._("%database.error.loadPropertiesFailure"));
    }
};

/**
 * Prevent browsers from spinning forever while loading data.
 *
 * @static
 * @private
 * @param {Function} worker Takes one argument, an item to work on
 * @param {Array} data An array of items fit to pass to the worker function
 * @param {Numeric} size Chunk size, the number of items to work on in one
 *     cycle
 * @param {Numeric} timeout In milliseconds, the time between cycles
 * @param {Function} [complete] Method to call when done with all data
 */
Exhibit.Database._LocalImpl._loadChunked = function(worker, data, size, timeout, complete) {
    var index, length;
    index = 0;
    length = data.length;
    (function() {
        var remnant, currentSize;
        remnant = length - index;
        currentSize = (remnant >= size) ? size : remnant;
        if (index < length) {
            while (currentSize-- > 0) {
                worker(data[index++]);
            }
            setTimeout(arguments.callee, timeout);
        } else if (typeof complete === "function") {
            complete();
        }
    }());
};

/**
 * Load just the items from the data.
 * 
 * @param {Object} itemEntries The "items" subsection of Exhibit JSON.
 * @param {String} baseURI The base URI for normalizing URIs in the object.
 */
Exhibit.Database._LocalImpl.prototype.loadItems = function(itemEntries, baseURI) {
    Exhibit.jQuery(document).trigger("onBeforeLoadingItems.exhibit");
    var self, lastChar, spo, ops, indexPut, indexTriple, finish, loader;
    self = this;
    try {
        lastChar = baseURI.substr(baseURI.length - 1);
        if (lastChar === "#") {
            baseURI = baseURI.substr(0, baseURI.length - 1) + "/";
        } else if (lastChar !== "/" && lastChar !== ":") {
            baseURI += "/";
        }
        
        spo = this._spo;
        ops = this._ops;
        indexPut = Exhibit.Database._indexPut;
        indexTriple = function(s, p, o) {
            indexPut(spo, s, p, o);
            indexPut(ops, o, p, s);
        };

        finish = function() {
            self._propertyArray = null;
            Exhibit.jQuery(document).trigger("onAfterLoadingItems.exhibit");
        };

        loader = function(item) {
            if (typeof item === "object") {
                self._loadItem(item, indexTriple, baseURI);
            }
        };

        Exhibit.Database._LocalImpl._loadChunked(loader, itemEntries, 1000, 10, finish);
    } catch(e) {
        Exhibit.Debug.exception(e, Exhibit._("%database.error.loadItemsFailure"));
    }
};

/**
 * Retrieve a database type given the type identifier, or null if the
 * type does not exist.
 *
 * @param {String} typeID The type identifier.
 * @returns {Exhibit.Database.Type} The corresponding database type.
 */
Exhibit.Database._LocalImpl.prototype.getType = function(typeID) {
    return typeof this._types[typeID] ?
        this._types[typeID] :
        null;
};

/**
 * Retrieve a database property given an identifier, or null if no such
 * property exists. 
 *
 * @param {String} propertyID The property identifier.
 * @returns {Exhibit.Database._Property} The corresponding database property.
 */
Exhibit.Database._LocalImpl.prototype.getProperty = function(propertyID) {
    return typeof this._properties[propertyID] !== "undefined" ?
        this._properties[propertyID] :
        null;
};

/**
 * Retrieve all database property identifiers in an array. 
 *
 * @returns {Array} The array of property identifiers.
 */
Exhibit.Database._LocalImpl.prototype.getAllProperties = function() {
    var propertyID;

    if (this._propertyArray === null) {
        this._propertyArray = [];
        for (propertyID in this._properties) {
            if (this._properties.hasOwnProperty(propertyID)) {
                this._propertyArray.push(propertyID);
            }
        }
    }
    
    return [].concat(this._propertyArray);
};

/**
 * Retrieve all items in the database.
 *
 * @returns {Exhibit.Set} The set of all items.
 */
Exhibit.Database._LocalImpl.prototype.getAllItems = function() {
    var items = new Exhibit.Set();
    items.addSet(this._items);

    return items;
};

/**
 * Count the number of items in the database.
 *
 * @returns {Number} The number of items in the database.
 */
Exhibit.Database._LocalImpl.prototype.getAllItemsCount = function() {
    return this._items.size();
};

/**
 * Returns true if an item identifier exists in the database, false otherwise.
 *
 * @param {String} itemID The item identifier.
 * @returns {Boolean} True if the item ID is in the database.
 */
Exhibit.Database._LocalImpl.prototype.containsItem = function(itemID) {
    return this._items.contains(itemID);
};

/**
 * Work through URIs of database properties and algorithmically extract
 * the best guess at all URI namespaces used in the data.  Modifies its
 * arguments, does not return anything.  idToQualifiedName is a hash for
 * helping translate a full URI into a QName (prefix:localName), where
 * idToQualifiedName[ID] = { base: baseURI, localName: localName, prefix:
 * baseNickname }.  prefixToBase maps the base nickname back to the prefix,
 * where prefixToBase[prefix] = baseURI.
 *
 * @param {Object} idToQualifiedName Maps URIs to QNames.
 * @param {Object} prefixToBase Maps prefixes to full base URIs.
 */
Exhibit.Database._LocalImpl.prototype.getNamespaces = function(idToQualifiedName, prefixToBase) {
    var bases = {}, propertyID, property, uri, hash, base, slash,
        baseToPrefix, letters, i, prefix, qname;
    for (propertyID in this._properties) {
        if (this._properties.hasOwnProperty(propertyID)) {
            property = this._properties[propertyID];
            uri = property.getURI();
        
            hash = uri.indexOf("#");
            slash = uri.lastIndexOf("/");
            if (hash > 0) {
                base = uri.substr(0, hash + 1);
                bases[base] = true;
            
                idToQualifiedName[propertyID] = {
                    base:       base,
                    localName:  uri.substr(hash + 1)
                };
            } else if (slash > 0) {
                base = uri.substr(0, slash + 1);
                bases[base] = true;
                
                idToQualifiedName[propertyID] = {
                    base:       base,
                    localName:  uri.substr(slash + 1)
                };
            }
        }
    }
    
    baseToPrefix = {};
    letters = "abcdefghijklmnopqrstuvwxyz";
    i = 0;
    
    for (base in bases) {
        if (bases.hasOwnProperty(base)) {
            prefix = letters.substr(i++,1);
            prefixToBase[prefix] = base;
            baseToPrefix[base] = prefix;
        }
    }
    
    for (propertyID in idToQualifiedName) {
        if (idToQualifiedName.hasOwnProperty(propertyID)) {
            qname = idToQualifiedName[propertyID];
            qname.prefix = baseToPrefix[qname.base];
        }
    }
};

/**
 * Fill a set with all objects for a given subject-predicate pair.
 * 
 * @param {String} s The subject identifier.
 * @param {String} p The predicate identifier.
 * @param {Exhibit.Set} [set] The set to fill.
 * @param {Exhibit.Set} [filter] Only include objects in this set.
 * @returns {Exhibit.Set} The filled set of objects.
 */
Exhibit.Database._LocalImpl.prototype.getObjects = function(s, p, set, filter) {
    return this._get(this._spo, s, p, set, filter);
};

/**
 * Count the distinct, unique objects (any repeated objects count as one)
 * for a subject-predicate pair. 
 *
 * @param {String} s The subject identifier.
 * @param {String} p The prediate identifier.
 * @param {Exhibit.Set} [filter] Only include objects in this filter.
 * @returns {Number} The count of distinct objects.
 */
Exhibit.Database._LocalImpl.prototype.countDistinctObjects = function(s, p, filter) {
    return this._countDistinct(this._spo, s, p, filter);
};

/**
 * Fill a set with all objects for all subject-predicate pairs from a set
 * of subjects. 
 *
 * @param {Exhibit.Set} subjects A set of subject identifiers.
 * @param {String} p The predicate identifier.
 * @param {Exhibit.Set} [set] The set to fill.
 * @param {Exhibit.Set} [filter] Only include objects in this filter.
 * @returns {Exhibit.Set} The filled set of objects.
 */
Exhibit.Database._LocalImpl.prototype.getObjectsUnion = function(subjects, p, set, filter) {
    return this._getUnion(this._spo, subjects, p, set, filter);
};

/**
 * Count the distinct, unique objects for subject-predicate pairs for all
 * subjects in a set.  Objects that repeat across subject-predicate pairs
 * are counted for each appearance. 
 *
 * @param {Exhibit.Set} subjects A set of subject identifiers.
 * @param {String} p The predicate identifier.
 * @param {Exhibit.Set} [filter] Only include objects in this filter.
 * @returns {Number} The count of distinct matching objects.
 */
Exhibit.Database._LocalImpl.prototype.countDistinctObjectsUnion = function(subjects, p, filter) {
    return this._countDistinctUnion(this._spo, subjects, p, filter);
};

/**
 * Fill a set with all the subjects with the matching object-predicate pair.
 *
 * @param {String} o The object.
 * @param {String} p The predicate identifier.
 * @param {Exhibit.Set} [set] The set to fill.
 * @param {Exhibit.Set} [filter] Only include subjects in this filter.
 * @returns {Exhibit.Set} The filled set of matching subject identifiers.
 */
Exhibit.Database._LocalImpl.prototype.getSubjects = function(o, p, set, filter) {
    return this._get(this._ops, o, p, set, filter);
};

/**
 * Count the distinct, unique subjects (any repeated subjects count as one)
 * for an object-predicate pair.
 *
 * @param {String} o The object.
 * @param {String} p The predicate identifier.
 * @param {Exhibit.Set} [filter] Only include subjects in this filter.
 * @returns {Number} The count of matching, distinct subjects.
 */
Exhibit.Database._LocalImpl.prototype.countDistinctSubjects = function(o, p, filter) {
    return this._countDistinct(this._ops, o, p, filter);
};

/**
 * Fill a set with all subjects for all object-predicate pairs from a set
 * of objects. 
 *
 * @param {Exhibit.Set} objects The set of objects.
 * @param {String} p The predicate identifier.
 * @param {Exhibit.Set} [set] The set to fill.
 * @param {Exhibit.Set} [filter] Only include subjects in this filter.
 * @returns {Exhibit.Set} The filled set of subjects.
 */
Exhibit.Database._LocalImpl.prototype.getSubjectsUnion = function(objects, p, set, filter) {
    return this._getUnion(this._ops, objects, p, set, filter);
};

/**
 * Count the distinct, unique subjects for object-predicate pairs for all
 * objects in a set. 
 * 
 * @param {Exhibit.Set} objects The set of objects.
 * @param {String} p The predicate identifier.
 * @param {Exhibit.Set} [filter] Only include subjects in this filter.
 * @returns {Number} The count of matching subjects.
 */
Exhibit.Database._LocalImpl.prototype.countDistinctSubjectsUnion = function(objects, p, filter) {
    return this._countDistinctUnion(this._ops, objects, p, filter);
};

/**
 * Return one (and only one) object given a subject-predicate pair, or null
 * if no such object exists.
 *
 * @param {String} s The subject identifier.
 * @param {String} p The predicate identifier.
 * @returns {String} One matching object.
 */
Exhibit.Database._LocalImpl.prototype.getObject = function(s, p) {
    var hash, array;

    hash = this._spo[s];
    if (hash) {
        array = hash[p];
        if (array) {
            return array[0];
        }
    }
    return null;
};

/**
 * Return one (and only one) subject from an object-predicate pair, or null
 * if no such subject exists.
 *
 * @param {String} o The object.
 * @param {String} p The predicate identifier.
 * @returns {String} One matching subject identifier.
 */
Exhibit.Database._LocalImpl.prototype.getSubject = function(o, p) {
    var hash, array;

    hash = this._ops[o];
    if (hash) {
        array = hash[p];
        if (array) {
            return array[0];
        }
    }
    return null;
};

/**
 * Return an array of predicates from triples with the given subject. 
 *
 * @param {String} s The subject identifier.
 * @returns {Array} The predicate identifiers.
 */
Exhibit.Database._LocalImpl.prototype.getForwardProperties = function(s) {
    return this._getProperties(this._spo, s);
};

/**
 * Return an array of predicates from triples for the given object. 
 *
 * @param {String} o The object identifier.
 * @returns {Array} The predicate identifiers.
 */
Exhibit.Database._LocalImpl.prototype.getBackwardProperties = function(o) {
    return this._getProperties(this._ops, o);
};

/**
 * Fill a set with subjects whose property values for the given property
 * fall within the min, max range.
 *
 * @param {String} p The predicate identifier.
 * @param {Number} min The minimum value for the range.
 * @param {Number} max The maximum value for the range.
 * @param {Boolean} inclusive Whether the maximum is a limit or included.
 * @param {Exhibit.Set} [set] The set to fill.
 * @param {Exhibit.Set} [filter] Only include subjects in this filter.
 * @returns {Exhibit.Set} The filled set of matching subject identifiers.
 */
Exhibit.Database._LocalImpl.prototype.getSubjectsInRange = function(p, min, max, inclusive, set, filter) {
    var property, rangeIndex;
    property = this.getProperty(p);
    if (property !== null) {
        rangeIndex = property.getRangeIndex();
        if (rangeIndex !== null) {
            return rangeIndex.getSubjectsInRange(min, max, inclusive, set, filter);
        }
    }
    return (!set) ? new Exhibit.Set() : set;
};

/**
 * Fill a set with all objects in the database of property "type" for
 * the given set of subjects.
 *
 * @param {Exhibit.Set} set A set of subject identifiers.
 * @returns {Exhibit.Set} A set of type identifiers.
 */
Exhibit.Database._LocalImpl.prototype.getTypeIDs = function(set) {
    return this.getObjectsUnion(set, "type", null, null);
};


/**
 * Add a triple to the database.
 *
 * @param {String} s The subject identifier.
 * @param {String} p The predicate identifier.
 * @param {String} o The object.
 */
Exhibit.Database._LocalImpl.prototype.addStatement = function(s, p, o) {
    var indexPut = Exhibit.Database._indexPut;
    indexPut(this._spo, s, p, o);
    indexPut(this._ops, o, p, s);
};

/**
 * Remove a triple from the database, returning either the object or the
 * subject that was removed.
 *
 * @param {String} s The subject identifier.
 * @param {String} p The predicate identifier.
 * @param {String} o The object.
 * @returns {String} Either the object or the subject.
 */
Exhibit.Database._LocalImpl.prototype.removeStatement = function(s, p, o) {
    var indexRemove, removedObject, removedSubject;
    indexRemove = Exhibit.Database._indexRemove;
    removedObject = indexRemove(this._spo, s, p, o);
    removedSubject = indexRemove(this._ops, o, p, s);
    return removedObject || removedSubject;
};

/**
 * Remove all objects associated with a subject-predicate pair,
 * returning a boolean for success. 
 * 
 * @param {String} s The subject identifier.
 * @param {String} p The predicate identifier.
 * @returns {Boolean} True if removed.
 */
Exhibit.Database._LocalImpl.prototype.removeObjects = function(s, p) {
    var indexRemove, indexRemoveList, objects, i;
    indexRemove = Exhibit.Database._indexRemove;
    indexRemoveList = Exhibit.Database._indexRemoveList;
    objects = indexRemoveList(this._spo, s, p);
    if (objects === null) {
        return false;
    } else {
        for (i = 0; i < objects.length; i++) {
            indexRemove(this._ops, objects[i], p, s);
        }
        return true;
    }
};

/**
 * Remove all subjects associated with an object-predicate pair,
 * returning a boolean for success.
 *
 * @param {String} o The object.
 * @param {String} p The predicate identifier.
 * @returns {Boolean} True if removed.
 */
Exhibit.Database._LocalImpl.prototype.removeSubjects = function(o, p) {
    var indexRemove, indexRemoveList, subjects, i;
    indexRemove = Exhibit.Database._indexRemove;
    indexRemoveList = Exhibit.Database._indexRemoveList;
    subjects = indexRemoveList(this._ops, o, p);
    if (subjects === null) {
        return false;
    } else {
        for (i = 0; i < subjects.length; i++) {
            indexRemove(this._spo, subjects[i], p, o);
        }
        return true;
    }
};

/**
 * Reset the entire database to its empty state.
 */
Exhibit.Database._LocalImpl.prototype.removeAllStatements = function() {
    Exhibit.jQuery(document).trigger("onBeforeRemovingAllStatements.exhibit");
    var propertyID;
    try {
        this._spo = {};
        this._ops = {};
        this._items = new Exhibit.Set();
    
        for (propertyID in this._properties) {
            if (this._properties.hasOwnProperty(propertyID)) {
                this._properties[propertyID]._onNewData();
            }
        }
        this._propertyArray = null;
        
        Exhibit.jQuery(document).trigger("onAfterRemovingAllStatements.exhibit");
    } catch(e) {
        Exhibit.Debug.exception(e, Exhibit._("%database.error.removeAllStatementsFailure"));
    }
};

/**
 * Use registered importers to load a link based on its stated MIME type.
 *
 * @param {Array} links An array of DOM link elements.
 * @param {Exhibit.Database} database The database to load into.
 * @param {Function} fDone The function to call when finished loading.
 */
Exhibit.Database._LocalImpl.prototype._loadLinks = function(links, database, fDone) {
    var fNext, link, type, importer;
    links = [].concat(links);
    fNext = function() {
        while (links.length > 0) {
            link = links.shift();
            type = Exhibit.jQuery(link).attr("type");
            if (typeof type === "undefined" || type === null || type.length === 0) {
                type = "application/json";
            }

            importer = Exhibit.Importer.getImporter(type);
            if (typeof importer !== "undefined" && importer !== null) {
                importer.load(link, database, fNext);
                return;
            } else {
                Exhibit.Debug.log(Exhibit._("%database.error.noImporterFailure", type));
            }
        }

        if (typeof fDone !== "undefined" && fDone !== null) {
            fDone();
        }
    };
    fNext();
};

/**
 * Called by data loading methods for each item being loaded.  Checks
 * viability and indexes when adding the item's triples to the database.
 *
 * @param {Object} itemEntry An object representing the item and its triples.
 * @param {Function} indexFunction A function that indexes new triples.
 * @param {String} baseURI The base URI to resolve URI fragments against.
 */
Exhibit.Database._LocalImpl.prototype._loadItem = function(itemEntry, indexFunction, baseURI) {
    var id, label, uri, type, isArray, p, v, j;

    if (typeof itemEntry.label === "undefined" &&
        typeof itemEntry.id === "undefined") {
        Exhibit.Debug.warn(Exhibit._("%database.error.itemSyntaxError",
                                     JSON.stringify(itemEntry)));
	    itemEntry.label = "item" + Math.ceil(Math.random()*1000000);
    }
    
    if (typeof itemEntry.label === "undefined") {
        id = itemEntry.id;
        if (!this._items.contains(id)) {
            Exhibit.Debug.warn(
                Exhibit._("%database.error.itemMissingLabelFailure",
                          JSON.stringify(itemEntry))
            );
        }
    } else {
        label = itemEntry.label;
        id = typeof itemEntry.id !== "undefined" ?
            itemEntry.id :
            label;
        uri = typeof itemEntry.uri !== "undefined" ?
            itemEntry.uri :
            (baseURI + "item#" + encodeURIComponent(id));
        type = typeof itemEntry.type !== "undefined" ?
            itemEntry.type :
            "Item";
                
        isArray = function(obj) {
            if (obj.constructor.toString().indexOf("Array") === -1) {
                return false;
            } else {
                return true;
            }
        };

        if (isArray(label)) {
            label = label[0];
        }

        if (isArray(id)) {
            id = id[0];
        }

        if (isArray(uri)) {
            uri = uri[0];
        }

        if (isArray(type)) {
            type = type[0];
        }
        
        this._items.add(id);
        
        indexFunction(id, "uri", uri);
        indexFunction(id, "label", label);
        indexFunction(id, "type", type);
        
        this._ensureTypeExists(type, baseURI);
    }
    
    for (p in itemEntry) {
        if (itemEntry.hasOwnProperty(p)) {
            if (typeof p === "string") {
                if (p !== "uri" && p !== "label" && p !== "id" && p !== "type") {
                    this._ensurePropertyExists(p, baseURI)._onNewData();
                                    
                    v = itemEntry[p];
                    if (v instanceof Array) {
                        for (j = 0; j < v.length; j++) {
                            indexFunction(id, p, v[j]);
                        }
                    } else if (v !== undefined && v !== null) {
                        indexFunction(id, p, v);
                    }
                }
            }
        }
    }
};

/**
 * Called during data load to make sure the schema for any types being added
 * exists, adding it if not. 
 *
 * @param {String} typeID The type identifier.
 * @param {String} baseURI The base URI to resolve URI fragments against.
 */
Exhibit.Database._LocalImpl.prototype._ensureTypeExists = function(typeID, baseURI) {
    var type;
    if (typeof this._types[typeID] === "undefined") {
        type = new Exhibit.Database.Type(typeID);
        
        type._custom.uri = baseURI + "type#" + encodeURIComponent(typeID);
        type._custom.label = typeID;
        
        this._types[typeID] = type;
    }
};

/**
 * Called during data load to make sure the schema for any property
 * being added exists, adding it if not. 
 *
 * @param {String} propertyID The property identifier.
 * @param {String} baseURI The base URI to resolve URI fragments against.
 * @returns {Exhibit.Database.Property} The corresponding database property.
 */
Exhibit.Database._LocalImpl.prototype._ensurePropertyExists = function(propertyID, baseURI) {
    var property;
    if (typeof this._properties[propertyID] === "undefined") {
        property = new Exhibit.Database.Property(propertyID, this);
        
        property._uri = baseURI + "property#" + encodeURIComponent(propertyID);
        property._valueType = "text";
        
        property._label = propertyID;
        property._pluralLabel = property._label;
        
        property._reverseLabel = Exhibit._("%database.reverseLabel", property._label);
        property._reversePluralLabel = Exhibit._("%database.reversePluralLabel", property._pluralLabel);
        
        property._groupingLabel = property._label;
        property._reverseGroupingLabel = property._reverseLabel;
        
        this._properties[propertyID] = property;
        
        this._propertyArray = null;
        return property;
    } else {
        return this._properties[propertyID];
    }
};

/**
 * Fills a set with any values that are contained in the two-level index,
 * index[x][y], only including those in the filter if the filter is provided. 
 *
 * @param {Object} index The two-level index.
 * @param {String} x The first level key.
 * @param {String} y The second level key.
 * @param {Exhibit.Set} set The set to fill.
 * @param {Exhibit.Set} [filter] Only include values in this filter.
 */
Exhibit.Database._LocalImpl.prototype._indexFillSet = function(index, x, y, set, filter) {
    var hash, array, i, z;
    hash = index[x];
    if (typeof hash !== "undefined") {
        array = hash[y];
        if (typeof array !== "undefined") {
            if (filter) {
                for (i = 0; i < array.length; i++) {
                    z = array[i];
                    if (filter.contains(z)) {
                        set.add(z);
                    }
                }
            } else {
                for (i = 0; i < array.length; i++) {
                    set.add(array[i]);
                }
            }
        }
    }
};

/**
 * Returns a count of the number of objects that would be returned from
 * _indexFillSet.
 *
 * @param {Object} index The two-level index.
 * @param {String} x The first-level key.
 * @param {String} y The second-level key.
 * @param {Exhibit.Set} [filter] Only include values in this filter.
 * @returns {Number} The count of values.
 */
Exhibit.Database._LocalImpl.prototype._indexCountDistinct = function(index, x, y, filter) {
    var count, hash, array, i;
    count = 0;
    hash = index[x];
    if (hash) {
        array = hash[y];
        if (array) {
            if (filter) {
                for (i = 0; i < array.length; i++) {
                    if (filter.contains(array[i])) {
                        count++;
                    }
                }
            } else {
                count = array.length;
            }
        }
    }
    return count;
};

/**
 * Passes through to _indexFillSet, providing an empty set if no set is
 * passed in as an argument.
 *
 * @param {Object} index The two-level index.
 * @param {String} x The first-level key.
 * @param {String} y The second-level key.
 * @param {Exhibit.Set} [set] The set to fill.
 * @param {Exhibit.Set} [filter] Only include values in this filter.
 * @returns {Exhibit.Set}
 */
Exhibit.Database._LocalImpl.prototype._get = function(index, x, y, set, filter) {
    if (typeof set === "undefined" || set === null) {
        set = new Exhibit.Set();
    }
    this._indexFillSet(index, x, y, set, filter);
    return set;
};

/**
 * Given a set of items, return values of index[x][y] for all values
 * of x in the set.
 *
 * @param {Object} index The two-level index.
 * @param {Exhibit.Set} xSet A set of first-level keys.
 * @param {String} y The second-level key.
 * @param {Exhibit.Set} [set] The set to fill.
 * @param {Exhibit.Set} [filter] Only include values in this filter.
 * @returns {Exhibit.Set} The filled set.
 */
Exhibit.Database._LocalImpl.prototype._getUnion = function(index, xSet, y, set, filter) {
    var database;
    if (typeof set === "undefined" || set === null) {
        set = new Exhibit.Set();
    }
    
    database = this;
    xSet.visit(function(x) {
        database._indexFillSet(index, x, y, set, filter);
    });
    return set;
};

/**
 * Counts all distinct values in index[x][y] for all x in a set.  Uniqueness
 * is for x-y-value triples; common values across triples will still be
 * counted.
 *
 * @param {Object} index The two-level index.
 * @param {Exhibit.Set} xSet The set of first-level keys.
 * @param {String} y the second-level key.
 * @param {Exhibit.Set} [filter] Only include values in this filter.
 * @returns {Number} The count of matching values.
 */
Exhibit.Database._LocalImpl.prototype._countDistinctUnion = function(index, xSet, y, filter) {
    var count, database;
    count = 0;
    database = this;
    xSet.visit(function(x) {
        count += database._indexCountDistinct(index, x, y, filter);
    });
    return count;
};

/**
 * Passed through to _indexCountDistinct.
 *
 * @param {Object} index The two-level index.
 * @param {String} x The first-level key.
 * @param {String} y The second-level key.
 * @param {Exhibit.Set} [filter] Only include values in this filter.
 * @returns {Number} The count of matching values.
 */
Exhibit.Database._LocalImpl.prototype._countDistinct = function(index, x, y, filter) {
    return this._indexCountDistinct(index, x, y, filter);
};

/**
 * Given an index, return all properties associated with index[x].
 *
 * @param {Object} index The two-level index.
 * @param {String} x The first-level key.
 * @returns {Array} An array of second-level keys, property identifiers.
 */
Exhibit.Database._LocalImpl.prototype._getProperties = function(index, x) {
    var hash, properties, p;
    hash = index[x];
    properties = [];
    if (typeof hash !== "undefined") {
        for (p in hash) {
            if (hash.hasOwnProperty(p)) {
                properties.push(p);
            }
        }
    }
    return properties;
};

/**
 * @param {Number} count
 * @param {String} typeID
 * @param {String} countStyleClass
 * @returns {jQuery}
 */
Exhibit.Database._LocalImpl.prototype.labelItemsOfType = function(count, typeID, countStyleClass) {
    var label, type, pluralLabel, span;
    label = Exhibit._((count === 1) ? "" : "");
    type = this.getType(typeID);
    if (typeof type !== "undefined" && type !== null) {
        label = type.getLabel();
        if (count !== 1) {
            pluralLabel = type.getProperty("pluralLabel");
            if (typeof pluralLabel !== "undefined" && pluralLabel !== null) {
                label = pluralLabel
            }
        }
    }

    span = Exhibit.jQuery("<span>").html(
        Exhibit.jQuery("<span>")
            .attr("class", countStyleClass)
            .html(count)
    ).append(" " + label);
    
    return span;
};

/**
 * Extension point, a no-op by default.  Clones and returns an item and
 * the graph immediately surrounding it.
 *
 * @param {String} id Identifier of database item to clone and return.
 */
Exhibit.Database._LocalImpl.prototype.getItem = function(id) {
};

/**
 * Extension point, a no-op by default.  Clones the argument and inserts
 * it into the database.
 *
 * @param {Object} item An object representing the item to add.
 */
Exhibit.Database._LocalImpl.prototype.addItem = function(item) {
};

/**
 * Extension point, a no-op by default.  Edit the object of a statement
 * given the subject and property.
 *
 * @param {String} id The identifier of the subject.
 * @param {String} prop The property identifier.
 * @param {String} value The new value for the object.
 */
Exhibit.Database._LocalImpl.prototype.editItem = function(id, prop, value) {
};

/**
 * Extension point, a no-op by default.  Remove the item identified by
 * identifier and all links in the graph from and to it.
 *
 * @param {String} id The identifier of the item to remove.
 */
Exhibit.Database._LocalImpl.prototype.removeItem = function(id) {
};
/**
 * @fileOverview Database property definition.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * Represents a property within a database.
 *
 * @public
 * @constructor
 * @class
 * @param {String} id Property identifier.
 * @param {Exhibit.Database} database Database the property is grounded in.
 */
Exhibit.Database.Property = function(id, database) {
    this._id = id;
    this._database = database;
    this._rangeIndex = null;
};

/**
 * Return the property database identifier.
 *
 * @returns {String} The property database identifier.
 */
Exhibit.Database.Property.prototype.getID = function() {
    return this._id;
};

/**
 * Return the property's URI.
 *
 * @returns {String} The property URI.
 */
Exhibit.Database.Property.prototype.getURI = function() {
    return this._uri;
};

/**
 * Return the property value data type.
 *
 * @returns {String} The property value data type.
 */
Exhibit.Database.Property.prototype.getValueType = function() {
    return this._valueType;
};

/**
 * Return the user-friendly property label.
 *
 * @returns {String} The property label.
 */
Exhibit.Database.Property.prototype.getLabel = function() {
    return this._label;
};

/**
 * Return the user-friendly property label for plural values.
 *
 * @returns {String} The plural property label.
 */
Exhibit.Database.Property.prototype.getPluralLabel = function() {
    return this._pluralLabel;
};

/**
 * Return the user-friendly label when the object is the subject of a
 * sentence (e.g., "is [property] of").
 *
 * @returns {String} The reverse property label.
 */
Exhibit.Database.Property.prototype.getReverseLabel = function() {
    return this._reverseLabel;
};

/**
 * Return the user-friendly label when the many objects are the subject of a
 * sentence (e.g., "are [properties] of").
 *
 * @returns {String} The plural reverse property label.
 */
Exhibit.Database.Property.prototype.getReversePluralLabel = function() {
    return this._reversePluralLabel;
};

/**
 * Return the user-friendly label when grouping values together.
 *
 * @returns {String} The property grouping label.
 */
Exhibit.Database.Property.prototype.getGroupingLabel = function() {
    return this._groupingLabel;
};

/**
 * Return the user-friendly label when values grouped together are the
 * subject of a sentence.
 *
 * @returns {String} The property reverse grouping label. 
 */
Exhibit.Database.Property.prototype.getReverseGroupingLabel = function() {
    return this._reverseGroupingLabel;
};

/**
 * Return the origin of the property.
 *
 * @returns {String} The property origin.
 */
Exhibit.Database.Property.prototype.getOrigin = function() {
    return this._origin;
};

/**
 * Return the index for the range of property values.
 *
 * @returns {Exhibit.Database.RangeIndex} An index for the range of
 *     property values.
 */
Exhibit.Database.Property.prototype.getRangeIndex = function() {
    if (this._rangeIndex === null) {
        this._buildRangeIndex();
    }
    return this._rangeIndex;
};

/**
 * Makes internal changes to representation if new data is added to
 * the database.
 *
 * @private
 */
Exhibit.Database.Property.prototype._onNewData = function() {
    this._rangeIndex = null;
};

/**
 * Constructs the cached RangeIndex retrieved in getRangeIndex.
 *
 * @private
 */
Exhibit.Database.Property.prototype._buildRangeIndex = function() {
    var getter, database, p;
    database = this._database;
    p = this._id;
    
    switch (this.getValueType()) {
    case "currency":
    case "number":
        getter = function(item, f) {
            database.getObjects(item, p, null, null).visit(function(value) {
                if (typeof value !== "number") {
                    value = parseFloat(value);
                }
                if (!isNaN(value)) {
                    f(value);
                }
            });
        };
        break;
    case "date":
        getter = function(item, f) {
            database.getObjects(item, p, null, null).visit(function(value) {
                if (typeof value !== "undefined" && value !== null && !(value instanceof Date)) {
                    value = Exhibit.DateTime.parseIso8601DateTime(value);
                }
                if (value instanceof Date) {
                    f(value.getTime());
                }
            });
        };
        break;
    default:
        getter = function(item, f) {};
    }
    
    this._rangeIndex = new Exhibit.Database.RangeIndex(
        database.getAllItems(),
        getter
    );
};
/**
 * @fileOverview Class for indexing sortable property value ranges.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * Builds a Exhibit.Database.RangeIndex object.
 *
 * @public
 * @constructor
 * @class
 * @param {Exhibit.Set} items Subjects with values to index.
 * @param {Function} getter Function to return a value given the item.
 */
Exhibit.Database.RangeIndex = function(items, getter) {
    var pairs = [];
    items.visit(function(item) {
        getter(item, function(value) {
            pairs.push({ item: item, value: value });
        });
    });
    
    pairs.sort(function(p1, p2) {
        var c = p1.value - p2.value;
        return (isNaN(c) === false) ? c : p1.value.localeCompare(p2.value);
    });
    
    this._pairs = pairs;
};

/**
 * Returns the number of values in the index.
 *
 * @returns {Number} The number of values in the index.
 */
Exhibit.Database.RangeIndex.prototype.getCount = function() {
    return this._pairs.length;
};

/**
 * Returns the smallest numeric value in the index, for numeric ranges.
 *
 * @returns {Number} The smallest value in the index.
 */
Exhibit.Database.RangeIndex.prototype.getMin = function() {
    return this._pairs.length > 0 ?
        this._pairs[0].value :
        Number.POSITIVE_INFINITY;
};

/**
 * Returns the largest numeric value in the index, for numeric ranges.
 *
 * @returns {Number} The largest value in the index.
 */
Exhibit.Database.RangeIndex.prototype.getMax = function() {
    return this._pairs.length > 0 ?
        this._pairs[this._pairs.length - 1].value :
        Number.NEGATIVE_INFINITY;
};

/**
 * Using a visitor function, provide it as an argument every item in
 * this index that falls in the provided open or closed range.
 *
 * @param {Function} visitor Function to handle each item with values in range.
 * @param {Number} min Lower bound of range.
 * @param {Number} max Upper bound of range.
 * @param {Boolean} inclusive Whether max is included in bounds or not.
 */
Exhibit.Database.RangeIndex.prototype.getRange = function(visitor, min, max, inclusive) {
    var startIndex, pairs, l, pair, value;

    startIndex = this._indexOf(min);
    pairs = this._pairs;
    l = pairs.length;

    inclusive = !!inclusive;
    while (startIndex < l) {
        pair = pairs[startIndex++];
        value = pair.value;
        if (value < max || (value === max && inclusive)) {
            visitor(pair.item);
        } else {
            break;
        }
    }
};

/**
 * Build a visitor function to construct a set to hand to getRange,
 * optionally with a filter of acceptable subjects.
 * 
 * @param {Number} min Lower bound of range.
 * @param {Number} max Upper bound of range.
 * @param {Boolean} inclusive Whether max is included in bounds or not.
 * @param {Exhibit.Set} [set] Result set
 * @param {Exhibit.Set} [filter] Only include items in the filter
 * @returns {Exhibit.Set} Filtered items in defined range.
 */
Exhibit.Database.RangeIndex.prototype.getSubjectsInRange = function(min, max, inclusive, set, filter) {
    if (typeof set === "undefined" || set === null) {
        set = new Exhibit.Set();
    }

    var f = (typeof filter !== "undefined" && filter !== null) ?
        function(item) {
            if (filter.contains(item)) {
                set.add(item);
            }
        } :
        function(item) {
            set.add(item);
        };

    this.getRange(f, min, max, inclusive);

    return set;
};

/**
 * Count the number of elements having values in this range between the
 * specified open or closed range of values.
 * 
 * @param {Number} min Lower bound of range.
 * @param {Number} max Upper bound of range.
 * @param {Boolean} inclusive Whether max is included in bounds or not.
 * @returns {Number} The number of items with values in the defined range.
 */
Exhibit.Database.RangeIndex.prototype.countRange = function(min, max, inclusive) {
    var startIndex, endIndex, pairs, l;
    startIndex = this._indexOf(min);
    endIndex = this._indexOf(max);

    if (inclusive) {
        pairs = this._pairs;
        l = pairs.length;
        while (endIndex < l) {
            if (pairs[endIndex].value === max) {
                endIndex++;
            } else {
                break;
            }
        }
    }
    return endIndex - startIndex;
};

/**
 * Find and return the closest preceding numeric index for a given value
 * if it falls inside this range.
 *
 * @private
 * @param {Number} v The value to find the closest index for.
 * @returns {Number} The closest preceding index to the given value.
 */
Exhibit.Database.RangeIndex.prototype._indexOf = function(v) {
    var pairs, from, to, middle, v2;

    pairs = this._pairs;
    if (pairs.length === 0 || pairs[0].value >= v) {
        return 0;
    }

    from = 0;
    to = pairs.length;
    while (from + 1 < to) {
        middle = (from + to) >> 1;
        v2 = pairs[middle].value;
        if (v2 >= v) {
            to = middle;
        } else {
            from = middle;
        }
    }

    return to;
};
/**
 * @fileOverview Database item type definition.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * Represents an item type.
 *
 * @public
 * @constructor
 * @class
 * @param {String} id Item type identifier.
 */
Exhibit.Database.Type = function(id) {
    this._id = id;
    this._custom = {};
};

/**
 * Returns the item type identifier.
 *
 * @returns {String} The item type identifier.
 */
Exhibit.Database.Type.prototype.getID = function() {
    return this._id;
};

/**
 * Returns the item type URI.
 *
 * @returns {String} The item type URI.
 */
Exhibit.Database.Type.prototype.getURI = function() {
    return this._custom["uri"];
};

/**
 * Returns the item type user-friendly label.
 *
 * @returns {String} The item type label.
 */
Exhibit.Database.Type.prototype.getLabel = function() {
    return this._custom["label"];
};

/**
 * Returns the item type origin.
 *
 * @returns {String} The item type origin.
 */
Exhibit.Database.Type.prototype.getOrigin = function() {
    return this._custom["origin"];
};

/**
 * Returns a custom defined item type attribute's value.
 *
 * @param {String} p The property name.
 * @returns {String} The item type attribute's value.
 */
Exhibit.Database.Type.prototype.getProperty = function(p) {
    return this._custom[p];
};
/**
 * @fileOverview Represents subsets of a database.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * Creates a new object with an identifier and the database it draws from. 
 * 
 * @class
 * @constructor
 * @param {String} id Collection identifier.
 * @param {Exhibit.Database} database Database associated with the collection.
 */
Exhibit.Collection = function(id, database) {
    this._id = id;
    this._database = database;
    this._elmt = null;
    
    this._facets = [];
    this._updating = false;
    
    this._items = null;
    this._restrictedItems = null;
};

/**
 * Generator, includes all items in the database.
 *
 * @static
 * @param {String} id Collection identifier.
 * @param {Exhibit.Database} database Database associated with the collection.
 * @returns {Exhibit.Collection} Newly created collection.
 */
Exhibit.Collection.createAllItemsCollection = function(id, database) {
    var collection = new Exhibit.Collection(id, database);
    collection._update = Exhibit.Collection._allItemsCollection_update;
    
    Exhibit.Collection._initializeBasicCollection(collection, database);
    collection._setElement();
    
    return collection;
};

/**
 * Generator, includes all items of certain type given in the
 * configuration, or all items if not configured. 
 * 
 * @static
 * @param {String} id Collection identifier.
 * @param {Object} configuration A hash of configuration options.
 * @param {Exhibit.Database} database Database associated with the collection.
 * @returns {Exhibit.Collection} Newly created collection.
 */
Exhibit.Collection.create = function(id, configuration, database) {
    var collection = new Exhibit.Collection(id, database);
    collection._setElement();
   
    if (typeof configuration["itemTypes"] !== "undefined") {
        collection._itemTypes = configuration.itemTypes;
        collection._update = Exhibit.Collection._typeBasedCollection_update;
    } else {
        collection._update = Exhibit.Collection._allItemsCollection_update;
    }
    
    Exhibit.Collection._initializeBasicCollection(collection, database);
    
    return collection;
};
/**
 * Generator, like create, but reads configuration from the DOM.
 *
 * @static
 * @param {String} id Collection identifier.
 * @param {Element} elmt DOM element configuring the collection.
 * @param {Exhibit.Database} database Database associated with the collection.
 * @returns {Exhibit.Collection} Newly created collection.
 */
Exhibit.Collection.createFromDOM = function(id, elmt, database) {
    var collection, itemTypes;

    collection = new Exhibit.Collection(id, database);
    collection._setElement(elmt);

    itemTypes = Exhibit.getAttribute(elmt, "itemTypes", ",");
    if (typeof itemTypes !== "undefined" && itemTypes !== null && itemTypes.length > 0) {
        collection._itemTypes = itemTypes;
        collection._update = Exhibit.Collection._typeBasedCollection_update;
    } else {
        collection._update = Exhibit.Collection._allItemsCollection_update;
    }
    
    Exhibit.Collection._initializeBasicCollection(collection, database);
    
    return collection;
};

/**
 * Generator, like create, but locate the database from the UI context.
 *
 * @static
 * @param {String} id Collection identifier.
 * @param {Object} configuration Hash with configuration options.
 * @param {Exhibit.UIContext} uiContext UI context for the collection.
 * @returns {Exhibit.Collection} Newly created collection.
 */
Exhibit.Collection.create2 = function(id, configuration, uiContext) {
    var database, collection;

    database = uiContext.getDatabase();
    
    if (typeof configuration["expression"] !== "undefined") {
        collection = new Exhibit.Collection(id, database);
        collection._setElement();
        
        collection._expression = Exhibit.ExpressionParser.parse(configuration.expression);
        collection._baseCollection = (typeof configuration["baseCollectionID"] !== "undefined") ? 
            uiContext.getMain().getCollection(configuration.baseCollectionID) : 
            uiContext.getCollection();
            
        collection._restrictBaseCollection = (typeof configuration["restrictBaseCollection"] !== "undefined") ? 
            configuration.restrictBaseCollection : false;
            
        if (collection._restrictBaseCollection) {
            Exhibit.Collection._initializeRestrictingBasedCollection(collection);
        } else {
            Exhibit.Collection._initializeBasedCollection(collection);
        }
        
        return collection;
    } else {
        return Exhibit.Collection.create(id, configuration, database);
    }
};

/**
 * Generator, like createFromDOM, but locate the database from the UI context.
 *
 * @static
 * @param {String} id Collection identifier.
 * @param {Element} elmt DOM element configuring the collection.
 * @param {Exhibit.UIContext} uiContext UI context for the collection.
 * @returns {Exhibit.Collection} Newly created collection.
 */
Exhibit.Collection.createFromDOM2 = function(id, elmt, uiContext) {
    var database, collection, expressionString, baseCollectionID;

    database = uiContext.getDatabase();

    expressionString = Exhibit.getAttribute(elmt, "expression");
    if (typeof expressionString !== "undefined" && expressionString !== null && expressionString.length > 0) {
        collection = new Exhibit.Collection(id, database);
        collection._setElement(elmt);
    
        collection._expression = Exhibit.ExpressionParser.parse(expressionString);
        
        baseCollectionID = Exhibit.getAttribute(elmt, "baseCollectionID");
        collection._baseCollection = (typeof baseCollectionID !== "undefined" && baseCollectionID !== null && baseCollectionID.length > 0) ? 
            uiContext.getMain().getCollection(baseCollectionID) : 
            uiContext.getCollection();
            
        collection._restrictBaseCollection = Exhibit.getAttribute(elmt, "restrictBaseCollection") === "true";
        if (collection._restrictBaseCollection) {
            Exhibit.Collection._initializeRestrictingBasedCollection(collection, database);
        } else {
            Exhibit.Collection._initializeBasedCollection(collection);
        }
    } else {
        collection = Exhibit.Collection.createFromDOM(id, elmt, database);
    }
    return collection;
};

/**
 * Method called by most generators to fill the collection and add database
 * listeners for its benefit. 
 *
 * @static
 * @private
 * @param {Exhibit.Collection} collection Collection to initialize.
 * @param {Exhibit.Database} database Source of data.
 */
Exhibit.Collection._initializeBasicCollection = function(collection, database) {
    var update = function() { collection._update(); };

    Exhibit.jQuery(document).bind('onAfterLoadingItems.exhibit', update);
    Exhibit.jQuery(document).bind('onAfterRemovingAllStatements.exhibit', update);
        
    collection._update();
};

/**
 * Method called by a generator where a collection on which this collection
 * is based exists. 
 * 
 * @static
 * @private
 * @param {Exhibit.Collection} collection Collection to initialize.
 */
Exhibit.Collection._initializeBasedCollection = function(collection) {
    collection._update = Exhibit.Collection._basedCollection_update;
    
    Exhibit.jQuery(this._elmt).bind('onItemsChanged.exhibit', function(evt) {
        collection._update();
    });
    
    collection._update();
};

/**
 * Used to initialize a collection based on another collection where
 * updates to this collection should affect the base collection (they do
 * not by default). 
 *
 * @static
 * @private
 * @param {Exhibit.Collection} collection Collection to initialize.
 * @param {Exhibit.Database} database Source of data.
 */
Exhibit.Collection._initializeRestrictingBasedCollection = function(collection, database) {
    collection._cache = new Exhibit.FacetUtilities.Cache(
        database,
        collection._baseCollection,
        collection._expression
    );
    collection._isUpdatingBaseCollection = false;
    
    collection.onFacetUpdated = Exhibit.Collection._restrictingBasedCollection_onFacetUpdated;
    collection.restrict = Exhibit.Collection._restrictingBasedCollection_restrict;
    collection.update = Exhibit.Collection._restrictingBasedCollection_update;
    collection.hasRestrictions = Exhibit.Collection._restrictingBasedCollection_hasRestrictions;
    
    collection._baseCollection.addFacet(collection);
};

/**
 * Assigned as a collection's update method when the collection is based
 * on all items in the database.  Not a static method.
 */
Exhibit.Collection._allItemsCollection_update = function() {
    this.setItems(this._database.getAllItems());
    this._onRootItemsChanged();
};

/**
 * Assigned as a collection's update method when the collection is based
 * on a set of item types.  Not a static method.
 */
Exhibit.Collection._typeBasedCollection_update = function() {
    var i, newItems = new Exhibit.Set();
    for (i = 0; i < this._itemTypes.length; i++) {
        this._database.getSubjects(this._itemTypes[i], "type", newItems);
    }
    
    this.setItems(newItems);
    this._onRootItemsChanged();
};

/**
 * Assigned as a collection's update method when the collection is based
 * on another collection.  Not a static method.
 */
Exhibit.Collection._basedCollection_update = function() {
    this.setItems(this._expression.evaluate(
        { "value" : this._baseCollection.getRestrictedItems() }, 
        { "value" : "item" }, 
        "value",
        this._database
    ).values);
    
    this._onRootItemsChanged();
};

/**
 * Substitutes for the common implementation of onFacetUpdated to deal with
 * the base collection.  Not a static method.
 */
Exhibit.Collection._restrictingBasedCollection_onFacetUpdated = function() {
    if (!this._updating) {
        /*
         *  This is called when one of our own facets is changed.
         */
        Exhibit.Collection.prototype.onFacetUpdated.call(this);
        
        /*
         *  We need to restrict the base collection.
         */
        this._isUpdatingBaseCollection = true;
        this._baseCollection.onFacetUpdated();
        this._isUpdatingBaseCollection = false;
    }
};

/**
 * Substitutes for the common restrict method to restrict the base
 * collection.  Not a static method.
 *
 * @param {Exhibit.Set} items Viable items.
 * @returns {Exhibit.Set} Possibly further constrained set of items.
 */
Exhibit.Collection._restrictingBasedCollection_restrict = function(items) {
    if (this._restrictedItems.size() === this._items.size()) {
        return items;
    }
    
    return this._cache.getItemsFromValues(this._restrictedItems, items);
};

/**
 * Assigned as the update method when a collection is based on another
 * collection and restricts it.  Not a static method.
 *
 * @param {Exhibit.Set} items Used to locate new items for the collection.
 */
Exhibit.Collection._restrictingBasedCollection_update = function(items) {
    if (!this._isUpdatingBaseCollection) {
        this.setItems(this._cache.getValuesFromItems(items));
        this._onRootItemsChanged();
    }
};

/**
 * Adds a hasRestrictions method to the collection, like a Exhibit.Facet has.
 * Not a static method.
 *
 * @returns {Boolean} True if this collection has restrictions.
 */
Exhibit.Collection._restrictingBasedCollection_hasRestrictions = function() {
    return (this._items !== null) && (this._restrictedItems !== null) && 
        (this._restrictedItems.size() !== this._items.size());
};

/**
 * Getter for the collection identifier.
 *
 * @returns {String} Collection identifier.
 */
Exhibit.Collection.prototype.getID = function() {
    return this._id;
};

/**
 * Create an element to associate with the collection if none
 * exists.
 *
 * @param {Element} el
 */
Exhibit.Collection.prototype._setElement = function(el) {
    if (typeof el === "undefined" || el === null) {
        if (this.getID() !== "default") {
            this._elmt = Exhibit.jQuery("<div>")
                .attr("id", this.getID())
                .attr(Exhibit.makeExhibitAttribute("role"), "exhibit-collection")
                .css("display", "none")
                .appendTo(document.body)
                .get(0);
        } else {
            this._elmt = document;
        }
    } else {
        this._elmt = el;
    }
};

/**
 * Returns the element, commonly used to bind against, associated with
 * the collection.
 * 
 * @returns {Element}
 */
Exhibit.Collection.prototype.getElement = function() {
    return this._elmt;
};

/**
 * Explicitly set which items are in this collection.
 *
 * @param {Exhibit.Set} items The collection's items.
 */ 
Exhibit.Collection.prototype.setItems = function(items) {
    this._items = items;
};

/**
 * Compare collections for equality.
 *
 * @param {Exhibit.Collection} collection
 * @returns {Boolean} True if collection is equal to this one.
 */
Exhibit.Collection.prototype.equals = function(collection) {
    return (this.getID() === collection.getID());
};

/**
 * Handle removing the collection from the local context.
 */
Exhibit.Collection.prototype.dispose = function() {
    if (typeof this["_baseCollection"] !== "undefined") {
        this._baseCollection = null;
        this._expression = null;
    }

    this._database = null;
    this._elmt = null;
    this._items = null;
    this._restrictedItems = null;
};

/**
 * Register a facet with a collection.
 * 
 * @param {Exhibit.Facet} facet The new facet.
 */
Exhibit.Collection.prototype.addFacet = function(facet) {
    this._facets.push(facet);
    
    if (facet.hasRestrictions()) {
        this._computeRestrictedItems();
        this._updateFacets();
        Exhibit.jQuery(this._elmt).trigger("onItemsChanged.exhibit");
    } else {
        facet.update(this.getRestrictedItems());
    }
};

/**
 * Remove a previously registered facet from the collection. Generally
 * called by the facet itself when it is disposed. 
 *
 * @param {Exhibit.Facet} facet The facet to be removed.
 */
Exhibit.Collection.prototype.removeFacet = function(facet) {
    var i;
    for (i = 0; i < this._facets.length; i++) {
        if (facet === this._facets[i]) {
            this._facets.splice(i, 1);
            if (facet.hasRestrictions()) {
                this._computeRestrictedItems();
                this._updateFacets();
                Exhibit.jQuery(this._elmt).trigger("onItemsChanged.exhibit");
            }
            break;
        }
    }
};

/**
 * Signal all registered facets to clear any currently set restrictions.
 * 
 * @returns {Array} A list of objects returned by clearing restrictions.
 */
Exhibit.Collection.prototype.clearAllRestrictions = function() {
    var i, state;
    state = Exhibit.History.getState();
    
    this._updating = true;
    for (i = 0; i < this._facets.length; i++) {
        Exhibit.History.setComponentState(
            state,
            this._facets[i],
            Exhibit.Facet._registryKey,
            this._facets[i].exportEmptyState(),
            true
        );
    }
    this._updating = false;
    
    this.onFacetUpdated();

    return state;
};

/**
 * Given an array of restrictions, signal each registered facets to
 * implement any applicable restriction.
 *
 * @param {Array} restrictions List of objects used for applying restrictions.
 */
Exhibit.Collection.prototype.applyRestrictions = function(restrictions) {
    var i;
    this._updating = true;
    for (i = 0; i < this._facets.length; i++) {
        this._facets[i].applyRestrictions(restrictions[i]);
    }
    this._updating = false;
    
    this.onFacetUpdated();
};

/**
 * Return all items in the collection regardless of restrictions.
 *
 * @returns {Exhibit.Set} All collection items.
 */
Exhibit.Collection.prototype.getAllItems = function() {
    return new Exhibit.Set(this._items);
};

/**
 * Return the count of all items in the collection regardless of restrictions. 
 *
 * @returns {Number} The count of all collection items.
 */
Exhibit.Collection.prototype.countAllItems = function() {
    return this._items.size();
};

/**
 * Return only the items that match current restrictions.
 *
 * @returns {Exhibit.Set} Restricted items.
 */
Exhibit.Collection.prototype.getRestrictedItems = function() {
    return new Exhibit.Set(this._restrictedItems);
};


/**
 * Return the count of only the items that match current restrictions. 
 *
 * @returns {Number} The count of restricted items.
 */
Exhibit.Collection.prototype.countRestrictedItems = function() {
    return this._restrictedItems.size();
};

/**
 * Modifies the set of items matching the restriction based on changes
 * to a facet, sending the signal onItemsChanged when finished.
 */
Exhibit.Collection.prototype.onFacetUpdated = function() {
    if (!this._updating) {
        this._computeRestrictedItems();
        this._updateFacets();
        Exhibit.jQuery(this._elmt).trigger("onItemsChanged.exhibit");
    }
};

/**
 * Called when the base set of items the collection includes have changed,
 * called by the update methods. Fires onRootItemsChanged and onItemsChanged
 * during execution.
 *
 * @private
 */
Exhibit.Collection.prototype._onRootItemsChanged = function() {
    Exhibit.jQuery(this._elmt).trigger("onRootItemsChanged.exhibit");
    
    this._computeRestrictedItems();
    this._updateFacets();
    
    Exhibit.jQuery(this._elmt).trigger("onItemsChanged.exhibit");
};

/**
 * Signals registered facets to make updates based on one facet's
 * restrictions changing, called by onFacetUpdated.
 *
 * @private
 */ 
Exhibit.Collection.prototype._updateFacets = function() {
    var restrictedFacetCount, i, facet, items, j;
    restrictedFacetCount = 0;
    for (i = 0; i < this._facets.length; i++) {
        if (this._facets[i].hasRestrictions()) {
            restrictedFacetCount++;
        }
    }
    
    for (i = 0; i < this._facets.length; i++) {
        facet = this._facets[i];
        if (facet.hasRestrictions()) {
            if (restrictedFacetCount <= 1) {
                facet.update(this.getAllItems());
            } else {
                items = this.getAllItems();
                for (j = 0; j < this._facets.length; j++) {
                    if (i !== j) {
                        items = this._facets[j].restrict(items);
                    }
                }
                facet.update(items);
            }
        } else {
            facet.update(this.getRestrictedItems());
        }
    }
};

/**
 * Calculates the new set of items based on restrictions, caching the
 * result for later use.
 * 
 * @private
 */
Exhibit.Collection.prototype._computeRestrictedItems = function() {
    var i, facet;
    this._restrictedItems = this._items;
    for (i = 0; i < this._facets.length; i++) {
        facet = this._facets[i];
        if (facet.hasRestrictions()) {
            this._restrictedItems = facet.restrict(this._restrictedItems);
        }
    }
};
/**
 * @fileOverview Base class for database query language.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Expression = {};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.Expression.Path} rootNode
 */
Exhibit.Expression._Impl = function(rootNode) {
    this._rootNode = rootNode;
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Object}
 */
Exhibit.Expression._Impl.prototype.evaluate = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    var collection = this._rootNode.evaluate(roots, rootValueTypes, defaultRootName, database);
    return {
        values:     collection.getSet(),
        valueType:  collection.valueType,
        size:       collection.size
    };
};

/**
 * @param {String} itemID
 * @param {Exhibit.Database} database
 * @returns {Object}
 */
Exhibit.Expression._Impl.prototype.evaluateOnItem = function(itemID, database) {
    return this.evaluate(
        { "value" : itemID }, 
        { "value" : "item" }, 
        "value",
        database
    );
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Object}
 */
Exhibit.Expression._Impl.prototype.evaluateSingle = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    var collection, result;
    collection = this._rootNode.evaluate(roots, rootValueTypes, defaultRootName, database);
    result = { value: null,
               valueType: collection.valueType };
    collection.forEachValue(function(v) {
        result.value = v;
        return true;
    });
    
    return result;
};

/**
 * @param {String} itemID
 * @param {Exhibit.Database} database
 * @returns {Object}
 */
Exhibit.Expression._Impl.prototype.evaluateSingleOnItem = function(itemID, database) {
    return this.evaluateSingle(
        { "value" : itemID }, 
        { "value" : "item" }, 
        "value",
        database
    );
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Boolean}
 */
Exhibit.Expression._Impl.prototype.testExists = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    return this.isPath() ?
        this._rootNode.testExists(roots, rootValueTypes, defaultRootName, database) :
        this.evaluate(roots, rootValueTypes, defaultRootName, database).values.size() > 0;
};

/**
 * @returns {Boolean}
 */
Exhibit.Expression._Impl.prototype.isPath = function() {
    return this._rootNode instanceof Exhibit.Expression.Path;
};

/**
 * @returns {Exhibit.Expression.Path}
 */
Exhibit.Expression._Impl.prototype.getPath = function() {
    return this.isPath() ?
        this._rootNode :
        null;
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {Array|Exhibit.Set} values
 * @param {String} valueType
 */
Exhibit.Expression._Collection = function(values, valueType) {
    this._values = values;
    this.valueType = valueType;
    
    if (values instanceof Array) {
        this.forEachValue = Exhibit.Expression._Collection._forEachValueInArray;
        this.getSet = Exhibit.Expression._Collection._getSetFromArray;
        this.contains = Exhibit.Expression._Collection._containsInArray;
        this.size = values.length;
    } else {
        this.forEachValue = Exhibit.Expression._Collection._forEachValueInSet;
        this.getSet = Exhibit.Expression._Collection._getSetFromSet;
        this.contains = Exhibit.Expression._Collection._containsInSet;
        this.size = values.size();
    }
};

/**
 * @param {Function} f
 */
Exhibit.Expression._Collection._forEachValueInSet = function(f) {
    this._values.visit(f);
};

/**
 * @param {Function} f
 */
Exhibit.Expression._Collection._forEachValueInArray = function(f) {
    var a, i;
    a = this._values;
    for (i = 0; i < a.length; i++) {
        if (f(a[i])) {
            break;
        }
    }
};

/**
 * @returns {Exhibit.Set}
 */
Exhibit.Expression._Collection._getSetFromSet = function() {
    return this._values;
};

/**
 * @returns {Exhibit.Set}
 */
Exhibit.Expression._Collection._getSetFromArray = function() {
    return new Exhibit.Set(this._values);
};

/**
 * @param {String|Number} v
 * @returns {Boolean}
 */
Exhibit.Expression._Collection._containsInSet = function(v) {
    return this._values.contains(v);
};

/**
 * @param {String|Number} v
 * @returns {Boolean}
 */
Exhibit.Expression._Collection._containsInArray = function(v) {
    var a, i;
    a = this._values;
    for (i = 0; i < a.length; i++) {
        if (a[i] === v) {
            return true;
        }
    }
    return false;
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @public
 * @param {String|Number} value
 * @param {String} valueType
 */
Exhibit.Expression._Constant = function(value, valueType) {
    this._value = value;
    this._valueType = valueType;
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Exhibit.Expression._Collection}
 */
Exhibit.Expression._Constant.prototype.evaluate = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    return new Exhibit.Expression._Collection([ this._value ], this._valueType);
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @public
 * @param {String} name
 * @param {Array} args
 */
Exhibit.Expression._ControlCall = function(name, args) {
    this._name = name;
    this._args = args;
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Exhibit.Expression._Collection}
 */
Exhibit.Expression._ControlCall.prototype.evaluate = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    return Exhibit.Controls[this._name].f(this._args, roots, rootValueTypes, defaultRootName, database);
};
/**
 * @fileOverview Implementation of query language control features.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Controls = {};

Exhibit.Controls["if"] = {
    f: function(
        args,
        roots, 
        rootValueTypes, 
        defaultRootName, 
        database
    ) {
        var conditionCollection = args[0].evaluate(roots, rootValueTypes, defaultRootName, database), condition;
        condition = false;
        conditionCollection.forEachValue(function(v) {
            if (v) {
                condition = true;
                return true;
            }
        });
        
        if (condition) {
            return args[1].evaluate(roots, rootValueTypes, defaultRootName, database);
        } else {
            return args[2].evaluate(roots, rootValueTypes, defaultRootName, database);
        }
    }
};

Exhibit.Controls["foreach"] = {
    f: function(
        args,
        roots, 
        rootValueTypes, 
        defaultRootName, 
        database
    ) {
        var collection, oldValue, oldValueType, results, valueType;
        collection = args[0].evaluate(roots, rootValueTypes, defaultRootName, database);
        
        oldValue = roots["value"];
        oldValueType = rootValueTypes["value"];
        rootValueTypes["value"] = collection.valueType;
        
        results = [];
        valueType = "text";
        
        collection.forEachValue(function(element) {
            roots["value"] = element;
            
            var collection2 = args[1].evaluate(roots, rootValueTypes, defaultRootName, database);
            valueType = collection2.valueType;
            
            collection2.forEachValue(function(result) {
                results.push(result);
            });
        });
        
        roots["value"] = oldValue;
        rootValueTypes["value"] = oldValueType;
        
        return new Exhibit.Expression._Collection(results, valueType);
    }
};

Exhibit.Controls["default"] = {
    f: function(
        args,
        roots, 
        rootValueTypes, 
        defaultRootName, 
        database
    ) {
        var i, collection;
        for (i = 0; i < args.length; i++) {
            collection = args[i].evaluate(roots, rootValueTypes, defaultRootName, database);
            if (collection.size > 0) {
                return collection;
            }
        }
        return new Exhibit.Expression._Collection([], "text");
    }
};

Exhibit.Controls["filter"] = {
    f: function(
        args,
        roots,
        rootValueTypes,
        defaultRootName,
        database
    ) {
        var collection, oldValue, oldValueType, results;
        collection = args[0].evaluate(roots, rootValueTypes, defaultRootName, database);
       
        oldValue = roots["value"];
        oldValueType = rootValueTypes["value"];
       
        results = new Exhibit.Set();
        rootValueTypes["value"] = collection.valueType;
       
        collection.forEachValue(function(element) {
            roots["value"] = element;
           
            var collection2 = args[1].evaluate(roots, rootValueTypes, defaultRootName, database);
            if (collection2.size > 0 && collection2.contains("true")) {
                results.add(element);
            }
        });
       
        roots["value"] = oldValue;
        rootValueTypes["value"] = oldValueType;
       
        return new Exhibit.Expression._Collection(results, collection.valueType);
    }
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @public
 * @param {String} name
 * @param {Array} args
 */
Exhibit.Expression._FunctionCall = function(name, args) {
    this._name = name;
    this._args = args;
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Exhibit.Expression._Collection}
 * @throws Error
 */
Exhibit.Expression._FunctionCall.prototype.evaluate = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    var args = [], i;
    for (i = 0; i < this._args.length; i++) {
        args.push(this._args[i].evaluate(roots, rootValueTypes, defaultRootName, database));
    }
    
    if (typeof Exhibit.Functions[this._name] !== "undefined") {
        return Exhibit.Functions[this._name].f(args);
    } else {
        throw new Error(Exhibit._("%expression.noSuchFunction", this._name));
    }
};
/**
 * @fileOverview Implementation of query language function features.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Functions = {};

/**
 * @namespace
 */
Exhibit.FunctionUtilities = {};

/**
 * @static
 * @param {String} name
 * @param {Function} f
 * @param {String} valueType
 */
Exhibit.FunctionUtilities.registerSimpleMappingFunction = function(name, f, valueType) {
    Exhibit.Functions[name] = {
        f: function(args) {
            var set = new Exhibit.Set(), i, fn;
            fn = function() {
                return function(v) {
                    var v2 = f(v);
                    if (typeof v2 !== "undefined") {
                        set.add(v2);
                    }
                };
            };
            for (i = 0; i < args.length; i++) {
                args[i].forEachValue(fn());
            }
            return new Exhibit.Expression._Collection(set, valueType);
        }
    };
};

Exhibit.Functions["union"] = {
    f: function(args) {
        var set, valueType, i, arg;
        set = new Exhibit.Set();
        valueType = null;
        
        if (args.length > 0) {
            valueType = args[0].valueType;
            for (i = 0; i < args.length; i++) {
                arg = args[i];
                if (arg.size > 0) {
                    if (typeof valueType === "undefined" || valueType === null) {
                        valueType = arg.valueType;
                    }
                    set.addSet(arg.getSet());
                }
            }
        }
        return new Exhibit.Expression._Collection(set, (typeof valueType !== "undefined" && valueType !== null) ? valueType : "text");
    }
};

Exhibit.Functions["contains"] = {
    f: function(args) {
        var result, set;
        result = args[0].size > 0;
        set = args[0].getSet();
        
        args[1].forEachValue(function(v) {
            if (!set.contains(v)) {
                result = false;
                return true;
            }
        });
        
        return new Exhibit.Expression._Collection([ result ], "boolean");
    }
};

Exhibit.Functions["exists"] = {
    f: function(args) {
        return new Exhibit.Expression._Collection([ args[0].size > 0 ], "boolean");
    }
};

Exhibit.Functions["count"] = {
    f: function(args) {
        return new Exhibit.Expression._Collection([ args[0].size ], "number");
    }
};

Exhibit.Functions["not"] = {
    f: function(args) {
        return new Exhibit.Expression._Collection([ !args[0].contains(true) ], "boolean");
    }
};

Exhibit.Functions["and"] = {
    f: function(args) {
        var r = true, i;
        for (i = 0; r && i < args.length; i++) {
            r = r && args[i].contains(true);
        }
        return new Exhibit.Expression._Collection([ r ], "boolean");
    }
};

Exhibit.Functions["or"] = {
    f: function(args) {
        var r = false, i;
        for (i = 0; !r && i < args.length; i++) {
            r = r || args[i].contains(true);
        }
        return new Exhibit.Expression._Collection([ r ], "boolean");
    }
};

Exhibit.Functions["add"] = {
    f: function(args) {
        var total, i, fn;
        total = 0;
        fn = function() {
            return function(v) {
                if (typeof v !== "undefined" && v !== null) {
                    if (typeof v === "number") {
                        total += v;
                    } else {
                        var n = parseFloat(v);
                        if (!isNaN(n)) {
                            total += n;
                        }
                    }
                }
            };
        };
        for (i = 0; i < args.length; i++) {
            args[i].forEachValue(fn());
        }
        
        return new Exhibit.Expression._Collection([ total ], "number");
    }
};

// Note: arguments expanding to multiple items get concatenated in random order
Exhibit.Functions["concat"] = {
    f: function(args) {
        var result = [], i, fn;
        fn = function() {
            return function(v) {
                if (typeof v !== "undefined" && v !== null) {
                    result.push(v);
                }
            };
        };
        for (i = 0; i < args.length; i++) {
            args[i].forEachValue(fn());
        }

        return new Exhibit.Expression._Collection([ result.join('') ], "text");
    }
};

Exhibit.Functions["multiply"] = {
    f: function(args) {
        var product = 1, i, fn;
        fn = function() {
            return function(v) {
                var n;
                if (typeof v !== "undefined" && v !== null) {
                    if (typeof v === "number") {
                        product *= v;
                    } else {
                        n = parseFloat(v);
                        if (!isNaN(n)) {
                            product *= n;
                        }
                    }
                }
            };
        };
        for (i = 0; i < args.length; i++) {
            args[i].forEachValue(fn());
        }
        
        return new Exhibit.Expression._Collection([ product ], "number");
    }
};

Exhibit.Functions["date-range"] = {
    _parseDate: function (v) {
        if (typeof v === "undefined" || v === null) {
            return Number.NEGATIVE_INFINITY;
        } else if (v instanceof Date) {
            return v.getTime();
        } else {
            try {
                return Exhibit.DateTime.parseIso8601DateTime(v).getTime();
            } catch (e) {
                return Number.NEGATIVE_INFINITY;
            }
        }
    },
    _computeRange: function(from, to, interval) {
        var range = to - from;
        if (isFinite(range)) {
            if (typeof Exhibit.DateTime[interval.toUpperCase()] !== "undefined") {
                range = Math.round(range / Exhibit.DateTime.gregorianUnitLengths[Exhibit.DateTime[interval.toUpperCase()]]);
            }
            return range;
        }
        return null;
    },
    f: function(args) {
        var self = this, from, to, interval, range;
        
        from = Number.POSITIVE_INFINITY;
        args[0].forEachValue(function(v) {
            from = Math.min(from, self._parseDate(v));
        });
        
        to = Number.NEGATIVE_INFINITY;
        args[1].forEachValue(function(v) {
            to = Math.max(to, self._parseDate(v));
        });
        
        interval = "day";
        args[2].forEachValue(function(v) {
            interval = v;
        });
            
        range = this._computeRange(from, to, interval);
        return new Exhibit.Expression._Collection((typeof range !== "undefined" && range !== null) ? [ range ] : [], "number");
    }
};

Exhibit.Functions["distance"] = {
    _units: {
        km:         1e3,
        mile:       1609.344
    },
    _computeDistance: function(from, to, unit, roundTo) {
        var range = from.distanceFrom(to);
        if (!roundTo) {
            roundTo = 1;
        }
        if (isFinite(range)) {
            if (typeof this._units[unit] !== "undefined") {
                range = range / this._units[unit];
            }
            return Exhibit.Util.round(range, roundTo);
        }
        return null;
    },
    f: function(args) {
        var self = this, data, name, i, latlng, from, to, range, fn;
        data = {};
        name = ["origo", "lat", "lng", "unit", "round"];
        fn = function(nm) {
            return function(v) {
                data[nm] = v;
            };
        };
        for (i = 0, n = name[i]; i < name.length; i++) {
            args[i].forEachValue(fn(n));
        }

        latlng = data.origo.split(",");
        from = new GLatLng( latlng[0], latlng[1] );
        to = new GLatLng( data.lat, data.lng );
        
        range = this._computeDistance(from, to, data.unit, data.round);
        return new Exhibit.Expression._Collection((typeof range !== "undefined" && range !== null) ? [ range ] : [], "number");
    }
};

Exhibit.Functions["min"] = {
    f: function(args) {
        /** @ignore */
        var returnMe = function (val) { return val; }, min, valueType, i, arg, currentValueType, parser, fn;
        min = Number.POSITIVE_INFINITY;
        valueType = null;
        fn = function(p, c) {
            return function(v) {
                var parsedV = p(v, returnMe);
                if (parsedV < min || min === Number.POSITIVE_INFINITY) {
                    min = parsedV;
                    valueType = (valueType === null) ? c : 
                        (valueType === c ? valueType : "text") ;
                }
            };
        };
        for (i = 0; i < args.length; i++) {
            arg = args[i];
            currentValueType = arg.valueType ? arg.valueType : 'text';
            parser = Exhibit.SettingsUtilities._typeToParser(currentValueType);
                
            arg.forEachValue(fn(parser, currentValueType));
        }
        
        return new Exhibit.Expression._Collection([ min ], (typeof valueType !== "undefined" && valueType !== null) ? valueType : "text");
    }
};

Exhibit.Functions["max"] = {
    f: function(args) {
        var returnMe = function (val) { return val; }, max, valueType, i, arg, currentValueType, parser, fn;
        max = Number.NEGATIVE_INFINITY;
        valueType = null;
        fn = function(p, c) {
            return function(v) {
                var parsedV = p(v, returnMe);
                if (parsedV > max || max === Number.NEGATIVE_INFINITY) {
                    max = parsedV;
                    valueType = (valueType === null) ? c : 
                        (valueType === c ? valueType : "text") ;
                }
            };
        };
        
        for (i = 0; i < args.length; i++) {
            arg = args[i];
            currentValueType = arg.valueType ? arg.valueType : 'text';
            parser = Exhibit.SettingsUtilities._typeToParser(currentValueType);
            
            arg.forEachValue(fn(parser, c));
        }
        return new Exhibit.Expression._Collection([ max ], (typeof valueType !== "undefined" && valueType !== null) ? valueType : "text");
    }
};

Exhibit.Functions["remove"] = {
    f: function(args) {
        var set, valueType, i, arg;
        set = args[0].getSet();
        valueType = args[0].valueType;
        for (i = 1; i < args.length; i++) {
            arg = args[i];
            if (arg.size > 0) {
                set.removeSet(arg.getSet());
            }
        }
        return new Exhibit.Expression._Collection(set, valueType);
    }
};

Exhibit.Functions["now"] = {
    f: function(args) {
        return new Exhibit.Expression._Collection([ new Date() ], "date");
    }
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @public
 * @param {String} operator
 * @param {Array} args
 */
Exhibit.Expression._Operator = function(operator, args) {
    this._operator = operator;
    this._args = args;
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Exhibit.Expression._Collection}
 */
Exhibit.Expression._Operator.prototype.evaluate = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    var values = [], args = [], i, operator, f;
    
    for (i = 0; i < this._args.length; i++) {
        args.push(this._args[i].evaluate(roots, rootValueTypes, defaultRootName, database));
    }
    
    operator = Exhibit.Expression._operators[this._operator];
    f = operator.f;
    if (operator.argumentType === "number") {
        args[0].forEachValue(function(v1) {
            if (typeof v1 !== "number") {
                v1 = parseFloat(v1);
            }
        
            args[1].forEachValue(function(v2) {
                if (typeof v2 !== "number") {
                    v2 = parseFloat(v2);
                }
                
                values.push(f(v1, v2));
            });
        });
    } else {
        args[0].forEachValue(function(v1) {
            args[1].forEachValue(function(v2) {
                values.push(f(v1, v2));
            });
        });
    }
    
    return new Exhibit.Expression._Collection(values, operator.valueType);
};

/**
 * @private
 */
Exhibit.Expression._operators = {
    "+" : {
        argumentType: "number",
        valueType: "number",
        /** @ignore */
        f: function(a, b) { return a + b; }
    },
    "-" : {
        argumentType: "number",
        valueType: "number",
        /** @ignore */
        f: function(a, b) { return a - b; }
    },
    "*" : {
        argumentType: "number",
        valueType: "number",
        /** @ignore */
        f: function(a, b) { return a * b; }
    },
    "/" : {
        argumentType: "number",
        valueType: "number",
        /** @ignore */
        f: function(a, b) { return a / b; }
    },
    "=" : {
        valueType: "boolean",
        /** @ignore */
        f: function(a, b) { return a === b; }
    },
    "<>" : {
        valueType: "boolean",
        /** @ignore */
        f: function(a, b) { return a !== b; }
    },
    "><" : {
        valueType: "boolean",
        /** @ignore */
        f: function(a, b) { return a !== b; }
    },
    "<" : {
        argumentType: "number",
        valueType: "boolean",
        /** @ignore */
        f: function(a, b) { return a < b; }
    },
    ">" : {
        argumentType: "number",
        valueType: "boolean",
        /** @ignore */
        f: function(a, b) { return a > b; }
    },
    "<=" : {
        argumentType: "number",
        valueType: "boolean",
        /** @ignore */
        f: function(a, b) { return a <= b; }
    },
    ">=" : {
        argumentType: "number",
        valueType: "boolean",
        /** @ignore */
        f: function(a, b) { return a >= b; }
    }
};
/**
 * @fileOverview Query language class representing graph paths.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 */
Exhibit.Expression.Path = function() {
    this._rootName = null;
    this._segments = [];
};

/**
 * @param {String} property
 * @param {Boolean} forward
 * @returns {Exhibit.Expression.Path}
 */
Exhibit.Expression.Path.create = function(property, forward) {
    var path = new Exhibit.Expression.Path();
    path._segments.push({ property: property,
                          forward: forward,
                          isArray: false });
    return path;
};

/**
 * @param {String} rootName
 */
Exhibit.Expression.Path.prototype.setRootName = function(rootName) {
    this._rootName = rootName;
};

/**
 * @param {String} property
 * @param {String} hopOperator
 */
Exhibit.Expression.Path.prototype.appendSegment = function(property, hopOperator) {
    this._segments.push({
        property:   property,
        forward:    hopOperator.charAt(0) === ".",
        isArray:    hopOperator.length > 1
    });
};

/**
 * @param {Number} index
 * @returns {Object}
 */
Exhibit.Expression.Path.prototype.getSegment = function(index) {
    var segment;
    if (index < this._segments.length) {
        segment = this._segments[index];
        return {
            property:   segment.property,
            forward:    segment.forward,
            isArray:    segment.isArray
        };
    } else {
        return null;
    }
};

/**
 * @returns {Object}
 */
Exhibit.Expression.Path.prototype.getLastSegment = function() {
    return this.getSegment(this._segments.length - 1);
};

/**
 * @returns {Number}
 */
Exhibit.Expression.Path.prototype.getSegmentCount = function() {
    return this._segments.length;
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Exhibit.Expression._Collection}
 * @throws Error
 */
Exhibit.Expression.Path.prototype.evaluate = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    var rootName, valueType, collection, root;
    rootName = (typeof this._rootName !== "undefined" && this._rootName !== null) ?
        this._rootName :
        defaultRootName;
    valueType = typeof rootValueTypes[rootName] !== "undefined" ?
        rootValueTypes[rootName] :
        "text";
    
    collection = null;
    if (typeof roots[rootName] !== "undefined") {
        root = roots[rootName];
        if (root instanceof Exhibit.Set || root instanceof Array) {
            collection = new Exhibit.Expression._Collection(root, valueType);
        } else {
            collection = new Exhibit.Expression._Collection([root], valueType);
        }
        
        return this._walkForward(collection, database);
    } else {
        throw new Error(Exhibit._("%expression.error.noSuchVariable", rootName));
    }
};

/**
 * @param {String|Number} value
 * @param {String} valueType
 * @param {Exhibit.Set} filter
 * @param {Exhibit.Database} database
 */
Exhibit.Expression.Path.prototype.evaluateBackward = function(
    value,
    valueType,
    filter,
    database
) {
    var collection = new Exhibit.Expression._Collection([ value ], valueType);
    
    return this._walkBackward(collection, filter, database);
};

/**
 * @param {Exhibit.Set|Array} values
 * @param {String} valueType
 * @param {Exhibit.Database} database
 */
Exhibit.Expression.Path.prototype.walkForward = function(
    values,
    valueType,
    database
) {
    return this._walkForward(new Exhibit.Expression._Collection(values, valueType), database);
};

/**
 * @param {Exhibit.Set|Array} values
 * @param {String} valueType
 * @param {Exhibit.Set} filter
 * @param {Exhibit.Database} database
 */
Exhibit.Expression.Path.prototype.walkBackward = function(
    values,
    valueType,
    filter,
    database
) {
    return this._walkBackward(new Exhibit.Expression._Collection(values, valueType), filter, database);
};

/**
 * @private
 * @param {Exhibit.Expression._Collection} collection
 * @param {Exhibit.Database} database
 * @returns {Exhibit.Expression._Collection}
 */
Exhibit.Expression.Path.prototype._walkForward = function(collection, database) {
    var i, segment, a, valueType, property, values, makeForEach;
    makeForEach = function(forward, as, s) {
        var fn = forward ? database.getObjects : database.getSubjects;
        return function(v) {
            fn(v, s.property).visit(function(v2) {
                as.push(v2);
            });
        };
    };
    for (i = 0; i < this._segments.length; i++) {
        segment = this._segments[i];
        if (segment.isArray) {
            a = [];
            collection.forEachValue(makeForEach(segment.forward, a, segment));
            if (segment.forward) {
                property = database.getProperty(segment.property);
                valueType = (typeof property !== "undefined" && property !== null) ?
                    property.getValueType() :
                    "text";
            } else {
                valueType = "item";
            }
            collection = new Exhibit.Expression._Collection(a, valueType);
        } else {
            if (segment.forward) {
                values = database.getObjectsUnion(collection.getSet(), segment.property);
                property = database.getProperty(segment.property);
                valueType = (typeof property !== "undefined" && property !== null) ?
                    property.getValueType() :
                    "text";
                collection = new Exhibit.Expression._Collection(values, valueType);
            } else {
                values = database.getSubjectsUnion(collection.getSet(), segment.property);
                collection = new Exhibit.Expression._Collection(values, "item");
            }
        }
    }
    
    return collection;
};

/**
 * @private
 * @param {Exhibit.Expression._Collection} collection
 * @param {Exhiibt.Set} filter
 * @param {Exhibit.Database} database
 * @param {Exhibit.Expression._Collection}
 */
Exhibit.Expression.Path.prototype._walkBackward = function(collection, filter, database) {
    var i, segment, a, valueType, property, values, makeForEach;
    makeForEach = function(forward, as, s, idx) {
        var fn = forward ? database.getObjects : database.getSubjects;
        return function(v) {
            fn(v, s.property).visit(function(v2) {
                if (idx > 0 || typeof filter === "undefined" || filter === null || filter.contains(v2)) {
                    as.push(v2);
                }
            });
        };
    };
    for (i = this._segments.length - 1; i >= 0; i--) {
        segment = this._segments[i];
        if (segment.isArray) {
            a = [];
            collection.forEachValue(makeForEach(segment.forward, a, segment, i));
            if (segment.forward) {
                property = database.getProperty(segment.property);
                valueType = (typeof property !== "undefined" && property !== null) ?
                    property.getValueType() :
                    "text";
            } else {
                valueType = "item";
            }
            collection = new Exhibit.Expression._Collection(a, valueType);
        } else {
            if (segment.forward) {
                values = database.getSubjectsUnion(collection.getSet(), segment.property, null, i === 0 ? filter : null);
                collection = new Exhibit.Expression._Collection(values, "item");
            } else {
                values = database.getObjectsUnion(collection.getSet(), segment.property, null, i === 0 ? filter : null);
                property = database.getProperty(segment.property);
                valueType = (typeof property !== "undefined" && property !== null) ? property.getValueType() : "text";
                collection = new Exhibit.Expression._Collection(values, valueType);
            }
        }
    }
    
    return collection;
};

/**
 * @param {Number} from
 * @param {Number} to
 * @param {Boolean} inclusive
 * @param {Exhibit.Set} filter
 * @param {Exhibit.Database} database
 * @returns {Object}
 * @throws Error
 */
Exhibit.Expression.Path.prototype.rangeBackward = function(
    from,
    to,
    inclusive,
    filter,
    database
) {
    var set, valueType, segment, i, property;
    set = new Exhibit.Set();
    valueType = "item";
    if (this._segments.length > 0) {
        segment = this._segments[this._segments.length - 1];
        if (segment.forward) {
            database.getSubjectsInRange(segment.property, from, to, inclusive, set, this._segments.length === 1 ? filter : null);
        } else {
            throw new Error(Exhibit._("%expression.error.mustBeForward"));
        }
                
        for (i = this._segments.length - 2; i >= 0; i--) {
            segment = this._segments[i];
            if (segment.forward) {
                set = database.getSubjectsUnion(set, segment.property, null, i === 0 ? filter : null);
                valueType = "item";
            } else {
                set = database.getObjectsUnion(set, segment.property, null, i === 0 ? filter : null);
                
                property = database.getProperty(segment.property);
                valueType = (typeof property !== "undefined" && property !== null) ? property.getValueType() : "text";
            }
        }
    }
    return {
        valueType:  valueType,
        values:     set,
        count:      set.size()
    };
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {String} defaultRootName
 * @param {Exhibit.Database} database
 * @returns {Boolean}
 */
Exhibit.Expression.Path.prototype.testExists = function(
    roots, 
    rootValueTypes, 
    defaultRootName, 
    database
) {
    return this.evaluate(roots, rootValueTypes, defaultRootName, database).size > 0;
};
/**
 * @fileOverview All classes and support methods for parsing queries.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.ExpressionParser = {};

/**
 * @static
 * @param {String} s
 * @param {Number} startIndex
 * @param {Object} results
 * @returns {Exhibit.Expression._Impl}
 */
Exhibit.ExpressionParser.parse = function(s, startIndex, results) {
    startIndex = startIndex || 0;
    results = results || {};
    
    var scanner = new Exhibit.ExpressionScanner(s, startIndex);
    try {
        return Exhibit.ExpressionParser._internalParse(scanner, false);
    } finally {
        results.index = scanner.token() !== null ? scanner.token().start : scanner.index();
    }
};

/**
 * @static
 * @param {String} s
 * @param {Number} startIndex
 * @param {Object} results
 * @returns {Array}
 */
Exhibit.ExpressionParser.parseSeveral = function(s, startIndex, results) {
    startIndex = startIndex || 0;
    results = results || {};
    
    var scanner = new Exhibit.ExpressionScanner(s, startIndex);
    try {
        return Exhibit.ExpressionParser._internalParse(scanner, true);
    } finally {
        results.index = scanner.token() !== null ? scanner.token().start : scanner.index();
    }
};

/**
 * @static
 * @param {Exhibit.ExpressionScanner} scanner
 * @param {Boolean} several
 * @returns {Exhibit.Expression._Impl|Array}
 */
Exhibit.ExpressionParser._internalParse = function(scanner, several) {
    var Scanner, token, next, makePosition, parsePath, parseFactor, parseTerm, parseSubExpression, parseExpresion, parseExpressionList, roots, expressions, r;
    Scanner = Exhibit.ExpressionScanner;
    token = scanner.token();
    next = function() { scanner.next(); token = scanner.token(); };
    makePosition = function() { return token !== null ? token.start : scanner.index(); };
    
    parsePath = function() {
        var path = new Exhibit.Expression.Path(), hopOperator;
        while (token !== null && token.type === Scanner.PATH_OPERATOR) {
            hopOperator = token.value;
            next();
            
            if (token !== null && token.type === Scanner.IDENTIFIER) {
                path.appendSegment(token.value, hopOperator);
                next();

            } else {
                throw new Error(Exhibit._("%expression.error.missingPropertyID", makePosition()));
            }
        }
        return path;
    };
    parseFactor = function() {
        var result = null, identifier, args;
        if (typeof token === "undefined" || token === null) {
            throw new Error(Exhibit._("%expression.error.missingFactor"));
        }
        
        switch (token.type) {
        case Scanner.NUMBER:
            result = new Exhibit.Expression._Constant(token.value, "number");
            next();
            break;
        case Scanner.STRING:
            result = new Exhibit.Expression._Constant(token.value, "text");
            next();
            break;
        case Scanner.PATH_OPERATOR:
            result = parsePath();
            break;
        case Scanner.IDENTIFIER:
            identifier = token.value;
            next();
            
            if (typeof Exhibit.Controls[identifier] !== "undefined") {
                if (token !== null && token.type === Scanner.DELIMITER && token.value === "(") {
                    next();
                    
                    args = (token !== null && token.type === Scanner.DELIMITER && token.value === ")") ? 
                        [] :
                        parseExpressionList();
                        
                    result = new Exhibit.Expression._ControlCall(identifier, args);
                    
                    if (token !== null && token.type === Scanner.DELIMITER && token.value === ")") {
                        next();
                    } else {
                        throw new Error(Exhibit._("%expression.error.missingParenEnd", identifier, makePosition()));
                    }
                } else {
                    throw new Error(Exhibit._("%expression.error.missingParenStart", identifier, makePosition()));
                }
            } else {
                if (token !== null && token.type === Scanner.DELIMITER && token.value === "(") {
                    next();
                    
                    args = (token !== null && token.type === Scanner.DELIMITER && token.value === ")") ? 
                        [] :
                        parseExpressionList();
                        
                    result = new Exhibit.Expression._FunctionCall(identifier, args);
                    
                    if (token !== null && token.type === Scanner.DELIMITER && token.value === ")") {
                        next();
                    } else {
                        throw new Error(Exhibit._("%expression.error.missingParenFunction", identifier, makePosition()));
                    }
                } else {
                    result = parsePath();
                    result.setRootName(identifier);
                }
            }
            break;
        case Scanner.DELIMITER:
            if (token.value === "(") {
                next();
                
                result = parseExpression();
                if (token !== null && token.type === Scanner.DELIMITER && token.value === ")") {
                    next();
                    break;
                } else {
                    throw new Error(Exhibit._("%expression.error.missingParen", + makePosition()));
                }
            } else {
                throw new Error(Exhibit._("%expression.error.unexpectedSyntax", token.value, makePosition()));
            }
        default:
            throw new Error(Exhibit._("%expression.error.unexpectedSyntax", token.value, makePosition()));
        }
        
        return result;
    };
    parseTerm = function() {
        var term = parseFactor(), operator;
        while (token !== null && token.type === Scanner.OPERATOR && 
            (token.value === "*" || token.value === "/")) {
            operator = token.value;
            next();
            
            term = new Exhibit.Expression._Operator(operator, [ term, parseFactor() ]);
        }
        return term;
    };
    parseSubExpression = function() {
        var subExpression = parseTerm(), operator;
        while (token !== null && token.type === Scanner.OPERATOR && 
            (token.value === "+" || token.value === "-")) {
            
            operator = token.value;
            next();
            
            subExpression = new Exhibit.Expression._Operator(operator, [ subExpression, parseTerm() ]);
        }
        return subExpression;
    };
    parseExpression = function() {
        var expression = parseSubExpression(), operator;
        while (token !== null && token.type === Scanner.OPERATOR && 
            (token.value === "=" || token.value === "<>" || 
             token.value === "<" || token.value === "<=" || 
             token.value === ">" || token.value === ">=")) {
            
            operator = token.value;
            next();
            
            expression = new Exhibit.Expression._Operator(operator, [ expression, parseSubExpression() ]);
        }
        return expression;
    };
    parseExpressionList = function() {
        var expressions = [ parseExpression() ];
        while (token !== null && token.type === Scanner.DELIMITER && token.value === ",") {
            next();
            expressions.push(parseExpression());
        }
        return expressions;
    };
    
    if (several) {
        roots = parseExpressionList();
        expressions = [];
        for (r = 0; r < roots.length; r++) {
            expressions.push(new Exhibit.Expression._Impl(roots[r]));
        }
        return expressions;
    } else {
        return new Exhibit.Expression._Impl(parseExpression());
    }
};

/**
 * @class 
 * @constructor
 * @param {String} text
 * @param {Number} startIndex
 */
Exhibit.ExpressionScanner = function(text, startIndex) {
    this._text = text + " "; // make it easier to parse
    this._maxIndex = text.length;
    this._index = startIndex;
    this.next();
};

/** @constant */
Exhibit.ExpressionScanner.DELIMITER     = 0;
/** @constant */
Exhibit.ExpressionScanner.NUMBER        = 1;
/** @constant */
Exhibit.ExpressionScanner.STRING        = 2;
/** @constant */
Exhibit.ExpressionScanner.IDENTIFIER    = 3;
/** @constant */
Exhibit.ExpressionScanner.OPERATOR      = 4;
/** @constant */
Exhibit.ExpressionScanner.PATH_OPERATOR = 5;

/**
 * @returns {Object}
 */
Exhibit.ExpressionScanner.prototype.token = function() {
    return this._token;
};

/**
 * @returns {Number}
 */
Exhibit.ExpressionScanner.prototype.index = function() {
    return this._index;
};

/**
 * @throws Error
 */
Exhibit.ExpressionScanner.prototype.next = function() {
    var c1, c2, i, c;
    this._token = null;
    
    while (this._index < this._maxIndex &&
        " \t\r\n".indexOf(this._text.charAt(this._index)) >= 0) {
        this._index++;
    }
    
    if (this._index < this._maxIndex) {
        c1 = this._text.charAt(this._index);
        c2 = this._text.charAt(this._index + 1);
        
        if (".!".indexOf(c1) >= 0) {
            if (c2 === "@") {
                this._token = {
                    type:   Exhibit.ExpressionScanner.PATH_OPERATOR,
                    value:  c1 + c2,
                    start:  this._index,
                    end:    this._index + 2
                };
                this._index += 2;
            } else {
                this._token = {
                    type:   Exhibit.ExpressionScanner.PATH_OPERATOR,
                    value:  c1,
                    start:  this._index,
                    end:    this._index + 1
                };
                this._index++;
            }
        } else if ("<>".indexOf(c1) >= 0) {
            if ((c2 === "=") || ("<>".indexOf(c2) >= 0 && c1 !== c2)) {
                this._token = {
                    type:   Exhibit.ExpressionScanner.OPERATOR,
                    value:  c1 + c2,
                    start:  this._index,
                    end:    this._index + 2
                };
                this._index += 2;
            } else {
                this._token = {
                    type:   Exhibit.ExpressionScanner.OPERATOR,
                    value:  c1,
                    start:  this._index,
                    end:    this._index + 1
                };
                this._index++;
            }
        } else if ("+-*/=".indexOf(c1) >= 0) {
            this._token = {
                type:   Exhibit.ExpressionScanner.OPERATOR,
                value:  c1,
                start:  this._index,
                end:    this._index + 1
            };
            this._index++;
        } else if ("(),".indexOf(c1) >= 0) {
            this._token = {
                type:   Exhibit.ExpressionScanner.DELIMITER,
                value:  c1,
                start:  this._index,
                end:    this._index + 1
            };
            this._index++;
        } else if ("\"'".indexOf(c1) >= 0) { // quoted strings
            i = this._index + 1;
            while (i < this._maxIndex) {
                if (this._text.charAt(i) === c1 && this._text.charAt(i - 1) !== "\\") {
                    break;
                }
                i++;
            }
            
            if (i < this._maxIndex) {
                this._token = {
                    type:   Exhibit.ExpressionScanner.STRING,
                    value:  this._text.substring(this._index + 1, i).replace(/\\'/g, "'").replace(/\\"/g, '"'),
                    start:  this._index,
                    end:    i + 1
                };
                this._index = i + 1;
            } else {
                throw new Error(Exhibit._("%expression.error.unterminatedString", + this._index));
            }
        } else if (this._isDigit(c1)) { // number
            i = this._index;
            while (i < this._maxIndex && this._isDigit(this._text.charAt(i))) {
                i++;
            }
            
            if (i < this._maxIndex && this._text.charAt(i) === ".") {
                i++;
                while (i < this._maxIndex && this._isDigit(this._text.charAt(i))) {
                    i++;
                }
            }
            
            this._token = {
                type:   Exhibit.ExpressionScanner.NUMBER,
                value:  parseFloat(this._text.substring(this._index, i)),
                start:  this._index,
                end:    i
            };
            this._index = i;
        } else { // identifier
            i = this._index;
            while (i < this._maxIndex) {
                c = this._text.charAt(i);
                if ("(),.!@ \t".indexOf(c) < 0) {
                    i++;
                } else {
                    break;
                }
            }
            this._token = {
                type:   Exhibit.ExpressionScanner.IDENTIFIER,
                value:  this._text.substring(this._index, i),
                start:  this._index,
                end:    i
            };
            this._index = i;
        }
    }
};

/**
 * @private
 * @static
 * @param {String} c
 * @returns {Boolean}
 */
Exhibit.ExpressionScanner.prototype._isDigit = function(c) {
    return "0123456789".indexOf(c) >= 0;
};
/**
 * @fileOverview General class for data exporter.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {String} mimeType
 * @param {String} label
 * @param {Function} wrap Function taking at minimum a string and a database,
 *    returning a string.
 * @param {Function} wrapOne Function taking at minimum a string, a boolean
 *    for first, and a boolean for last, returning a string.
 * @param {Function} exportOne Function taking at minimum an item identifier,
 *    the item itself, and a hash of properties, returning a string.
 * @param {Function} [exportMany] Function taking a set and a database,
 *    returning a string, which overrides the default exportMany that uses
 *    the other three functions in conjunction.
 */
Exhibit.Exporter = function(mimeType, label, wrap, wrapOne, exportOne, exportMany) {
    this._mimeType = mimeType;
    this._label = label;
    this._wrap = wrap;
    this._wrapOne = wrapOne;
    this._exportOne = exportOne;
    this._exportMany = exportMany;
    this._registered = this.register();
};

/**
 * @private
 * @constant
 */
Exhibit.Exporter._registryKey = "exporter";

/**
 * @private
 */
Exhibit.Exporter._registry = null;

/**
 * @static
 * @param {Exhibit._Impl} ex
 */
Exhibit.Exporter._registerComponent = function(evt, reg) {
    Exhibit.Exporter._registry = reg;
    if (!reg.hasRegistry(Exhibit.Exporter._registryKey)) {
        reg.createRegistry(Exhibit.Exporter._registryKey);
        Exhibit.jQuery(document).trigger("registerExporters.exhibit");
    }
};

/**
 * @returns {Boolean}
 */
Exhibit.Exporter.prototype.register = function() {
    var reg = Exhibit.Exporter._registry;
    if (!reg.isRegistered(
        Exhibit.Exporter._registryKey,
        this._mimeType
    )) {
        reg.register(
            Exhibit.Exporter._registryKey,
            this._mimeType,
            this
        );
        return true;
    } else {
        return false;
    }
};

/**
 *
 */
Exhibit.Exporter.prototype.dispose = function() {
    Exhibit.Exporter._registry.unregister(
        Exhibit.Exporter._registryKey,
        this._mimeType
    );
};

/**
 * @returns {Boolean}
 */
Exhibit.Exporter.prototype.isRegistered = function() {
    return this._registered;
};

/**
 * @returns {String}
 */
Exhibit.Exporter.prototype.getLabel = function() {
    return this._label;
};

/**
 * @param {String} itemID
 * @param {Exhibit.Database} database
 * @returns {Object}
 */
Exhibit.Exporter.prototype.exportOneFromDatabase = function(itemID, database) {
    var allProperties, fn, i, propertyID, property, values, valueType, item;

    fn = function(vt, s) {
        if (vt === "item") {
            return function(value) {
                s.push(database.getObject(value, "label"));
            };
        } else if (vt === "url") {
            return function(value) {
                s.push(Exhibit.Persistence.resolveURL(value));
            };
        }
    };

    allProperties = database.getAllProperties();
    item = {};

    for (i = 0; i < allProperties.length; i++) {
        propertyID = allProperties[i];
        property = database.getProperty(propertyID);
        values = database.getObjects(itemID, propertyID);
        valueType = property.getValueType();

        if (values.size() > 0) {
            if (valueType === "item" || valueType === "url") {
                strings = [];
                values.visit(fn(valueType, strings));
            } else {
                strings = values.toArray();
            }
            item[propertyID] = strings;
        }
    }

    return item;
};

/**
 * @param {String} itemID
 * @param {Exhibit.Database} database
 * @returns {String}
 */
Exhibit.Exporter.prototype.exportOne = function(itemID, database) {
    return this._wrap(
        this._exportOne(
            itemID,
            this.exportOneFromDatabase(itemID, database),
            Exhibit.Exporter._getPropertiesWithValueTypes(database)
        ),
        database
    );
};

/**
 * @param {Exhibit.Set} set
 * @param {Exhibit.Database} database
 * @returns {String}
 */
Exhibit.Exporter.prototype.exportMany = function(set, database) {
    if (typeof this._exportMany !== "undefined" && typeof this._exportMany === "function") {
        this.exportMany = this._exportMany;
        return this._exportMany(set, database);
    }

    var s = "", self = this, count = 0, size = set.size(), props;

    props = Exhibit.Exporter._getPropertiesWithValueTypes(database);
    set.visit(function(itemID) {
        s += self._wrapOne(
            self._exportOne(
                itemID,
                self.exportOneFromDatabase(itemID, database),
                props)
            ,
            count === 0,
            count++ === size - 1
        );
    });
    return this._wrap(s, database);
};

/**
 * @private
 * @static
 * @param {Exhibit.Database} database
 */
Exhibit.Exporter._getPropertiesWithValueTypes = function(database) {
    var properties, i, propertyID, property, valueType, map;
    map = {};
    properties = database.getAllProperties();
    for (i = 0; i < properties.length; i++) {
        propertyID = properties[i];
        property = database.getProperty(propertyID);
        valueType = property.getValueType();
        map[propertyID] = { "valueType": valueType,
                            "uri": property.getURI() };
    }
    return map;
};

Exhibit.jQuery(document).one(
    "registerStaticComponents.exhibit",
    Exhibit.Exporter._registerComponent
);
/**
 * @fileOverview Instance of Exhibit.Exporter for BibTex.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Exporter.BibTex = {
    /**
     * @private
     * @constant
     */
    _excludeProperties: {
        "pub-type": true,
        "type": true,
        "uri": true,
        "key": true
    },
    _mimeType: "application/x-bibtex",
    exporter: null
};

/**
 * @param {String} s
 * @returns {String}
 */
Exhibit.Exporter.BibTex.wrap = function(s) {
    return s;
};

/**
 * @param {String} s
 * @returns {String}
 */
Exhibit.Exporter.BibTex.wrapOne = function(s, first, last) {
    return s + "\n";
};

/**
 * @param {String} itemID
 * @param {Object} o
 * @returns {String}
 */
Exhibit.Exporter.BibTex.exportOne = function(itemID, o) {
    var type, key, prop, s = "";

    if (typeof o["pub-type"] !== "undefined") {
        type = o["pub-type"];
    } else if (typeof o.type !== "undefined") {
        type = o.type;
    }

    if (typeof o.key !== "undefined") {
        key = o.key;
    } else {
        key = itemID;
    }

    key = key.replace(/[\s,]/g, "-");

    s += "@" + type + "{" + key + ",\n";

    for (prop in o) {
        if (o.hasOwnProperty(prop)) {
            if (typeof Exhibit.Exporter.BibTex._excludeProperties[prop] === "undefined") {
                s += "\t" + (prop === "label" ?
                         "title" :
                         prop) + " = \"";
                s += o[prop].join(" and ") + "\",\n";
            }
        }
    }

    s += "\torigin = \"" + Exhibit.Persistence.getItemLink(itemID) + "\"\n";
    s += "}\n";

    return s;
};

/**
 * @private
 */
Exhibit.Exporter.BibTex._register = function() {
    Exhibit.Exporter.BibTex.exporter = new Exhibit.Exporter(
        Exhibit.Exporter.BibTex._mimeType,
        Exhibit._("%export.bibtexExporterLabel"),
        Exhibit.Exporter.BibTex.wrap,
        Exhibit.Exporter.BibTex.wrapOne,
        Exhibit.Exporter.BibTex.exportOne
    );
};

Exhibit.jQuery(document).one("registerExporters.exhibit",
                Exhibit.Exporter.BibTex._register);
/**
 * @fileOverview Instance of Exhibit.Exporter for Exhibit JSON.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Exporter.ExhibitJSON = {
    _mimeType: "application/json",
    exporter: null
};

/**
 * @param {String} s
 * @returns {String}
 */
Exhibit.Exporter.ExhibitJSON.wrap = function(s) {
    return "{\n" +
        "    \"items\": [\n" +
            s +
        "    ]\n" +
        "}\n";
};

/**
 * @param {String} s
 * @param {Boolean} first
 * @param {Boolean} last
 * @returns {String}
 */
Exhibit.Exporter.ExhibitJSON.wrapOne = function(s, first, last) {
    return s + (last ? "" : ",")  +"\n";
};

/**
 * @param {String} itemID
 * @param {Object} o
 * @returns {String}
 * @depends JSON
 */
Exhibit.Exporter.ExhibitJSON.exportOne = function(itemID, o) {
    return JSON.stringify(o);
};

/**
 * @private
 */
Exhibit.Exporter.ExhibitJSON._register = function() {
    Exhibit.Exporter.ExhibitJSON.exporter = new Exhibit.Exporter(
        Exhibit.Exporter.ExhibitJSON._mimeType,
        Exhibit._("%export.exhibitJsonExporterLabel"),
        Exhibit.Exporter.ExhibitJSON.wrap,
        Exhibit.Exporter.ExhibitJSON.wrapOne,
        Exhibit.Exporter.ExhibitJSON.exportOne
    );
};

Exhibit.jQuery(document).one("registerExporters.exhibit",
                Exhibit.Exporter.ExhibitJSON._register);
/**
 * @fileOverview Instance of Exhibit.Exporter for RDF/XML.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Exporter.RDFXML = {
    _mimeType: "application/rdf+xml",
    exporter: null
};

/**
 * @param {String} s
 * @param {Object} prefixToBase
 * @returns {String}
 */
Exhibit.Exporter.RDFXML.wrap = function(s, prefixToBase) {
    var s2, prefix;

    s2 = "<?xml version=\"1.0\"?>\n" +
        "<rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n"+
        "\txmlns:exhibit=\"http://simile.mit.edu/2006/11/exhibit#\"";

    for (prefix in prefixToBase) {
        if (prefixToBase.hasOwnProperty(prefix)) {
            s2 += "\n\txmlns:" + prefix + "=\"" + prefixToBase[prefix] + "\"";
        }
    }

    s2 += ">\n" + s + "\n</rdf:RDF>\n";

    return s2;
};

/**
 * @param {String} s
 * @returns {String}
 */
Exhibit.Exporter.RDFXML.wrapOne = function(s, first, last) {
    return s + "\n";
};

/**
 * @param {String} itemID
 * @param {Object} o
 * @param {Object} properties
 * @param {Object} propertyIDToQualifiedName
 * @param {Object} prefixToBase
 * @returns {String}
 */
Exhibit.Exporter.RDFXML.exportOne = function(itemID, o, properties, propertyIDToQualifiedName, prefixToBase) {
    var s = "", uri, i, propertyID, valueType, propertyString, j, values;
    uri = o["uri"];
    s += "<rdf:Description rdf:about=\"" + uri + "\">\n";

    for (propertyID in o) {
        if (o.hasOwnProperty(propertyID) && typeof properties[propertyID] !== "undefined") {
            valueType = properties[propertyID].valueType;
            if (typeof propertyIDToQualifiedName[propertyID] !== "undefined") {
                qname = propertyIDToQualifiedName[propertyID];
                propertyString = qname.prefix + ":" + qname.localName;
            } else {
                propertyString = properties[propertyID].uri;
            }

            if (valueType === "item") {
                values = o[propertyID];
                for (j = 0; j < values.length; j++) {
                    s += "\t<" + propertyString + " rdf:resource=\"" + values[j] + "\" />\n";
                }
            } else if (propertyID !== "uri") {
                values = o[propertyID];
                for (j = 0; j < values.length; j++) {
                    s += "\t<" + propertyString + ">" + values[j] + "</" + propertyString + ">\n";
                }
            }
        }
    }
         
    s += "\t<exhibit:origin>" + Exhibit.Persistence.getItemLink(itemID) + "</exhibit:origin>\n";
    s += "</rdf:Description>";

    return s;
};

Exhibit.Exporter.RDFXML.exportMany = function(set, database) {
    var propertyIDToQualifiedName, prefixToBase, s, self, properties, ps, i, p;
    propertyIDToQualifiedName = {};
    prefixToBase = {};
    s = "";
    self = this;
    database.getNamespaces(propertyIDToQualifiedName, prefixToBase);
    properties = {};
    ps = database.getAllProperties();
    for (i = 0; i < ps.length; i++) {
        p = database.getProperty(ps[i]);
        properties[ps[i]] = {}
        properties[ps[i]].valueType = p.getValueType();
        properties[ps[i]].uri = p.getURI();
    }
    set.visit(function(itemID) {
        s += self._wrapOne(self._exportOne(
            itemID,
            self.exportOneFromDatabase(itemID, database),
            properties,
            propertyIDToQualifiedName,
            prefixToBase
        ));
    });
    return this._wrap(s, prefixToBase);
};

/**
 * @private
 */
Exhibit.Exporter.RDFXML._register = function() {
    Exhibit.Exporter.RDFXML.exporter = new Exhibit.Exporter(
        Exhibit.Exporter.RDFXML._mimeType,
        Exhibit._("%export.rdfXmlExporterLabel"),
        Exhibit.Exporter.RDFXML.wrap,
        Exhibit.Exporter.RDFXML.wrapOne,
        Exhibit.Exporter.RDFXML.exportOne,
        Exhibit.Exporter.RDFXML.exportMany
    );
};

Exhibit.jQuery(document).one("registerExporters.exhibit",
                Exhibit.Exporter.RDFXML._register);
/**
 * @fileOverview Instance of Exhibit.Exporter for Semantic MediaWiki text.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Exporter.SemanticWikiText = {
    _type: "semantic-mediawiki",
    exporter: null
};

/**
 * @param {String} s
 * @param {Exhibit.Database} database
 * @returns {String}
 */
Exhibit.Exporter.SemanticWikiText.wrap = function(s, database) {
    return s;
};

/**
 * @param {String} s
 * @returns {String}
 */
Exhibit.Exporter.SemanticWikiText.wrapOne = function(s, first, last) {
    return s + "\n";
};

/**
 * @param {String} itemID
 * @param {Object} o
 * @param {Object} properties
 * @returns {String}
 */
Exhibit.Exporter.SemanticWikiText.exportOne = function(itemID, o, properties) {
    var uri, prop, valueType, values, i, s = "";

    uri = o.uri;
    s += uri + "\n";

    for (prop in o) {
        if (o.hasOwnProperty(prop) && typeof properties[prop] !== "undefined") {
            valueType = properties[prop].valueType;
            values = o[prop];
            if (valueType === "item") {
                for (i = 0; i < values.length; i++) {
                    s += "[[" + prop + "::" + values[i] + "]]\n";
                }
            } else {
                for (i = 0; i < values.length; i++) {
                    s += "[[" + prop + ":=" + values[i] + "]]\n";
                }
            }
        }
    }

    s += "[[origin:=" + Exhibit.Persistence.getItemLink(itemID) + "]]\n\n";

    return s;
};

/**
 * @private
 */
Exhibit.Exporter.SemanticWikiText._register = function() {
    Exhibit.Exporter.SemanticWikiText.exporter = new Exhibit.Exporter(
        Exhibit.Exporter.SemanticWikiText._type,
        Exhibit._("%export.smwExporterLabel"),
        Exhibit.Exporter.SemanticWikiText.wrap,
        Exhibit.Exporter.SemanticWikiText.wrapOne,
        Exhibit.Exporter.SemanticWikiText.exportOne
    );
};

Exhibit.jQuery(document).one("registerExporters.exhibit",
                Exhibit.Exporter.SemanticWikiText._register);
/**
 * @fileOverview Instance of Exhibit.Exporter for tab-separated values.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Exporter.TSV = {
    _mimeType: "text/tab-separated-values",
    exporter: null
};

/**
 * @param {String} s
 * @param {Exhibit.Database} database
 * @returns {String}
 */
Exhibit.Exporter.TSV.wrap = function(s, database) {
    var header, i, allProperties, propertyID, property, valueType;

    header = "";

    allProperties = database.getAllProperties();
    for (i = 0; i < allProperties.length; i++) {
        propertyID = allProperties[i];
        property = database.getProperty(propertyID);
        valueType = property.getValueType();
        header += propertyID + ":" + valueType + "\t";
    }

    return header + "\n" + s;
};

/**
 * @param {String} s
 * @returns {String}
 */
Exhibit.Exporter.TSV.wrapOne = function(s, first, last) {
    return s + "\n";
};

/**
 * @param {String} itemID
 * @param {Object} o
 * @returns {String}
 */
Exhibit.Exporter.TSV.exportOne = function(itemID, o) {
    var prop, s = "";

    for (prop in o) {
        if (o.hasOwnProperty(prop)) {
            s += o[prop].join("; ") + "\t";
        }
    }

    return s;
};

/**
 * @private
 */
Exhibit.Exporter.TSV._register = function() {
    Exhibit.Exporter.TSV.exporter = new Exhibit.Exporter(
        Exhibit.Exporter.TSV._mimeType,
        Exhibit._("%export.tsvExporterLabel"),
        Exhibit.Exporter.TSV.wrap,
        Exhibit.Exporter.TSV.wrapOne,
        Exhibit.Exporter.TSV.exportOne
    );
};

Exhibit.jQuery(document).one("registerExporters.exhibit",
                Exhibit.Exporter.TSV._register);
/**
 * @fileOverview General class for data importer.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {String|Array} mimeType
 * @param {String} loadType
 * @param {String} label
 * @param {Function} parse
 */
Exhibit.Importer = function(mimeType, loadType, parse) {
    if (typeof mimeType === "string") {
        this._mimeTypes = [mimeType];
    } else {
        this._mimeTypes = mimeType;
    }
    this._loadType = loadType;
    this._parse = parse;
    this._registered = this.register();
};

/**
 * @private
 * @constant
 */
Exhibit.Importer._registryKey = "importer";

/**
 * @private
 */
Exhibit.Importer._registry = null;

/**
 * @static
 * @param {Exhibit._Impl} ex
 */
Exhibit.Importer._registerComponent = function(evt, reg) {
    Exhibit.Importer._registry = reg;
    if (!reg.hasRegistry(Exhibit.Importer._registryKey)) {
        reg.createRegistry(Exhibit.Importer._registryKey);
        Exhibit.jQuery(document).trigger("registerImporters.exhibit", reg);
    }
};

/**
 * @static
 * @param {String} mimeType
 * @returns {Exhibit.Importer}
 */
Exhibit.Importer.getImporter = function(mimeType) {
    return Exhibit.Importer._registry.get(
        Exhibit.Importer._registryKey,
        mimeType
    );
};

/**
 * @static
 * @string {String} url
 * @returns {Boolean}
 */
Exhibit.Importer.checkFileURL = function(url) {
    return url.startsWith("file:");
};

/**
 * @returns {Boolean}
 */
Exhibit.Importer.prototype.register = function() {
    var reg, i, registered;
    reg = Exhibit.Importer._registry;
    registered = false;
    for (i = 0; i < this._mimeTypes.length; i++) {
        if (!reg.isRegistered(
            Exhibit.Importer._registryKey,
            this._mimeTypes[i]
        )) {
            reg.register(
                Exhibit.Importer._registryKey,
                this._mimeTypes[i],
                this
            );
            registered = registered || true;
        } else {
            registered = registered || false;
        }
    }
    return registered;
};

/**
 *
 */
Exhibit.Importer.prototype.dispose = function() {
    var i;
    for (i = 0; i < this._mimeTypes.length; i++) {
        Exhibit.Importer._registry.unregister(
            Exhibit.Importer._registryKey,
            this._mimeTypes[i]
        );
    }
};

/**
 * @returns {Boolean}
 */
Exhibit.Importer.prototype.isRegistered = function() {
    return this._registered;
};

/**
 * @param {String} type
 * @param {Element|String} link
 * @param {Exhibit.Database} database
 * @param {Function} callback
 */
Exhibit.Importer.prototype.load = function(link, database, callback) {
    var resolver, url, postLoad, postParse, self;
    url = typeof link === "string" ? link : Exhibit.jQuery(link).attr("href");
    url = Exhibit.Persistence.resolveURL(url);

    switch(this._loadType) {
    case "babel":
        resolver = this._loadBabel;
        break;
    case "jsonp":
        resolver = this._loadJSONP;
        break;
    default:
        resolver = this._loadURL;
        break;
    }

    postParse = function(o) {
        try {
            database.loadData(o, Exhibit.Persistence.getBaseURL(url));
        } catch(e) {
            Exhibit.Debug.exception(e);
            Exhibit.jQuery(document).trigger("error.exhibit", [e, Exhibit._("%import.couldNotLoad", url)]);
        } finally {
            if (typeof callback === "function") {
                callback();
            }
        }
    };

    self = this;
    postLoad = function(s, textStatus, jqxhr) {
        Exhibit.UI.hideBusyIndicator();
        try {
            self._parse(url, s, postParse);
        } catch(e) {
            Exhibit.jQuery(document).trigger("error.exhibit", [e, Exhibit._("%import.couldNotParse", url)]);
        }
    };

    Exhibit.UI.showBusyIndicator();
    resolver(url, database, postLoad, link);
};

/**
 * @param {String} url
 * @param {Exhibit.Database} database
 * @param {Function} callback
 */
Exhibit.Importer.prototype._loadURL = function(url, database, callback) {
    var self = this,
        callbackOrig = callback,
        fragmentStart = url.indexOf('#'),
        fragmentId = url.substring(fragmentStart),

        fError = function(jqxhr, textStatus, e) {
            var msg;
            if (Exhibit.Importer.checkFileURL(url) && jqxhr.status === 404) {
                msg = Exhibit._("%import.missingOrFilesystem", url);
            } else {
                msg = Exhibit._("%import.httpError", url, jqxhr.status);
            }
            Exhibit.jQuery(document).trigger("error.exhibit", [e, msg]);
        };

    if ((fragmentStart >= 0) && (fragmentStart < url.length - 1)) {
        url = url.substring(0, fragmentStart);

        callback = function(data, status, jqxhr) {
            var msg,
                fragment = Exhibit.jQuery(data).find(fragmentId)
	                          .andSelf()
	                          .filter(fragmentId);
            if (fragment.length < 1) {
                msg = Exhibit._("%import.missingFragment", url);
                Exhibit.jQuery(document).trigger("error.exhibit", [new Error(msg), msg]);
            } else {
                callbackOrig(fragment.text(), status, jqxhr);
            }
        };
    }

    Exhibit.jQuery.ajax({
        "url": url,
        "dataType": "text",
        "error": fError,
        "success": callback
    });
};

/**
 * @param {String} url
 * @param {Exhibit.Database} database
 * @param {Function} callback
 * @param {Element} link
 */
Exhibit.Importer.prototype._loadJSONP = function(url, database, callback, link) {
    var charset, convertType, jsonpCallback, converter, fDone, fError, ajaxArgs;

    if (typeof link !== "string") {
        convertType = Exhibit.getAttribute(link, "converter");
        jsonpCallback = Exhibit.getAttribute(link, "jsonp-callback");
        charset = Exhibit.getAttribute(link, "charset");
    }

    converter = Exhibit.Importer._registry.get(
        Exhibit.Importer.JSONP._registryKey,
        convertType
    );

    if (converter !== null && typeof converter.preprocessURL !== "undefined") {
        url = converter.preprocessURL(url);
    }
    
    fDone = function(s, textStatus, jqxhr) {
        callback(converter.transformJSON(s), textStatus, jqxhr);
    };

    fError = function(jqxhr, textStatus, e) {
        var msg;
        msg = Exhibit._(
            "%import.failedAccess",
            url,
            (typeof jqxhr.status !== "undefined") ? Exhibit._("%import.failedAccessHttpStatus", jqxhr.status) : "");
        Exhibit.jQuery(document).trigger("error.exhibit", [e, msg]);
    };

    ajaxArgs = {
        "url": url,
        "dataType": "jsonp",
        "success": fDone,
        "error": fError
    };

    if (jsonpCallback !== null) {
        ajaxArgs.jsonp = false;
        ajaxArgs.jsonpCallback = jsonpCallback;
    }

    if (charset !== null) {
        ajaxArgs.scriptCharset = charset;
    }

    Exhibit.jQuery.ajax(ajaxArgs);
};

/**
 * @param {String} url
 * @param {Exhibit.Database} database
 * @param {Function} callback
 * @param {Element} link
 */
Exhibit.Importer.prototype._loadBabel = function(url, database, callback, link) {
    var mimeType = null;
    if (typeof link !== "string") {
        mimeType = Exhibit.jQuery(link).attr("type");
    }
    this._loadJSONP(
        Exhibit.Importer.BabelBased.makeURL(url, mimeType),
        database,
        callback,
        link
    );
};

Exhibit.jQuery(document).one(
    "registerStaticComponents.exhibit",
    Exhibit.Importer._registerComponent
);
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Importer.ExhibitJSON = {
    _importer: null
};

/**
 * @param {String} url
 * @param {String} s
 * @param {Function} callback
 * @depends JSON
 */
Exhibit.Importer.ExhibitJSON.parse = function(url, s, callback) {
    var o = null;

    try {
        o = JSON.parse(s);
    } catch(e) {
        Exhibit.UI.showJsonFileValidation(Exhibit._("%general.badJsonMessage", url, e.message), url);
    }

    if (typeof callback === "function") {
        callback(o);
    }
};

/**
 * @private
 */
Exhibit.Importer.ExhibitJSON._register = function() {
    Exhibit.Importer.ExhibitJSON._importer = new Exhibit.Importer(
        "application/json",
        "get",
        Exhibit.Importer.ExhibitJSON.parse
    );
};

Exhibit.jQuery(document).one("registerImporters.exhibit",
                Exhibit.Importer.ExhibitJSON._register);
/**
 * @fileOverview Handle generic JSONP importing.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Importer.JSONP = {
    _importer: null,
    _registryKey: "jsonpImporter"
};

/**
 * @param {String} url
 * @param {Object} s
 * @param {Function} callback
 */
Exhibit.Importer.JSONP.parse = function(url, s, callback) {
    if (typeof callback === "function") {
        callback(s);
    }
};

/**
 * A generic JSONP feed converter to Exhibit JSON.
 * Does 90% of the feed conversion for 90% of all (well designed) JSONP feeds.
 * Pass the raw json object, an optional index to drill into to get at the
 * array of items ("feed.entry", in the case of Google Spreadsheets -- pass
 * null, if the array is already the top container, as in a Del.icio.us feed),
 * an object mapping the wanted item property name to the properties to pick
 * them up from, and an optional similar mapping with conversion callbacks to
 * perform on the data value before storing it in the item property. These
 * callback functions are invoked with the value, the object it was picked up
 * from, its index in the items array, the items array and the feed as a whole
 * (for the cases where you need to look up properties from the surroundings).
 * Returning the undefined value your converter means the property is not set.
 *
 * @param {Object} json Result of JSONP call
 * @param {String} index
 * @param {Object} mapping
 * @param {Object} converters
 * @returns {Object}
 */
Exhibit.Importer.JSONP.transformJSON = function(json, index, mapping, converters) {
    var objects, items, i, object, item, name, index, property;
    objects = json;
    items = [];
    if (typeof index !== "undefined" && index !== null) {
        index = index.split(".");
        while (index.length > 0) {
            objects = objects[index.shift()];
        }
    }
    for (i = 0, object = objects[i]; i < objects.length; i++) {
        item = {};
        for (name in mapping) {
            if (mapping.hasOwnProperty(name)) {
                index = mapping[name];
                // gracefully handle poisoned Object.prototype
                if (!mapping.hasOwnProperty(name) ||
                    !object.hasOwnProperty(index)) {
                    continue;
                }

                property = object[index];
                if (typeof converters !== "undefined"
                    && converters !== null
                    && converters.hasOwnProperty(name)) {
                    property = converters[name](property, object, i, objects, json);
                }
                if (typeof property !== "undefined") {
                    item[name] = property;
                }
            }
        }
        items.push(item);
    }
    return items;    
};

/**
 * @private
 * @static
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.Importer.JSONP._register = function(evt, reg) {
    Exhibit.Importer.JSONP._importer = new Exhibit.Importer(
        "application/jsonp",
        "jsonp",
        Exhibit.Importer.JSONP.parse
    );
    if (!reg.hasRegistry(Exhibit.Importer.JSONP._registryKey)) {
        reg.createRegistry(Exhibit.Importer.JSONP._registryKey);
        Exhibit.jQuery(document).trigger(
            "registerJSONPImporters.exhibit",
            reg
        );
    }
};

Exhibit.jQuery(document).one(
    "registerImporters.exhibit",
    Exhibit.Importer.JSONP._register
);
/**
 * @fileOverview Read Google Docs Spreadsheet JSONP feed.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Importer.JSONP.GoogleSpreadsheet = {
    _type: "googleSpreadsheets",
    _dateRegex: /^\d{1,2}\/\d{1,2}\/\d{4}$/
};

/**
 * @private
 * @static
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.Importer.JSONP.GoogleSpreadsheet._register = function(evt, reg) {
    if (!reg.isRegistered(
        Exhibit.Importer.JSONP._registryKey,
        Exhibit.Importer.JSONP.GoogleSpreadsheet._type)) {
        reg.register(
            Exhibit.Importer.JSONP._registryKey,
            Exhibit.Importer.JSONP.GoogleSpreadsheet._type,
            Exhibit.Importer.JSONP.GoogleSpreadsheet
        );
    }
};

/**
 * @static
 * @param {Object} json
 * @param {String} url
 * @param {String|Element} link
 * @returns {Object}
 */
Exhibit.Importer.JSONP.GoogleSpreadsheet.transformJSON = function(json, url, link) {
    var separator, s, items, properties, types, valueTypes, entries, i, entry, id, c, r, cellIndex, getNextRow, propertyRow, propertiesByColumn, cell, fieldSpec, fieldName, fieldDetails, property, d, detail, row, fieldValues, v;
    separator = ";";

    if (typeof link !== "undefined" && link !== null && typeof link !== "string") {
        s = Exhibit.getAttribute(link, "separator");
        if (s !== null && s.length > 0) {
            separator = s;
        }
    }
    
    items = [];
    properties = {};
    types = {};
    valueTypes = {
        "text" : true,
        "number" : true,
        "item" : true,
        "url" : true,
        "boolean" : true,
        "date" : true
    };

    entries = json.feed.entry || []; // if no entries in feed
    for (i = 0; i < entries.length; i++) {
        entry = entries[i];
        id = entry.id.$t;
        c = id.lastIndexOf("C");
        r = id.lastIndexOf("R");
        
        entries[i] = {
            "row": parseInt(id.substring(r + 1, c), 10) - 1,
            "col": parseInt(id.substring(c + 1), 10) - 1,
            "val": entry.content.$t
        };
    };
    
    cellIndex = 0;
    getNextRow = function() {
        var firstEntry, row, nextEntry;
        if (cellIndex < entries.length) {
            firstEntry = entries[cellIndex++];
            row = [ firstEntry ];
            while (cellIndex < entries.length) {
                nextEntry = entries[cellIndex];
                if (nextEntry.row == firstEntry.row) {
                    row.push(nextEntry);
                    cellIndex++;
                } else {
                    break;
                }
            }
            return row;
        }
        return null;
    };
    
    propertyRow = getNextRow();
    if (propertyRow != null) {
        propertiesByColumn = [];
        for (i = 0; i < propertyRow.length; i++) {
            cell = propertyRow[i];
            
            fieldSpec = cell.val.trim().replace(/^\{/g, "").replace(/\}$/g, "").split(":");
            fieldName = fieldSpec[0].trim();
            fieldDetails = fieldSpec.length > 1 ? fieldSpec[1].split(",") : [];
            
            property = { single: false };
            
            for (d = 0; d < fieldDetails.length; d++) {
                detail = fieldDetails[d].trim();
                if (typeof valueTypes[detail] !== null) {
                    property.valueType = detail;
                } else if (detail === "single") {
                    property.single = true;
                }
            }
            
            propertiesByColumn[cell.col] = fieldName;
            properties[fieldName] = property;
        }
        
        row = null;
        while ((row = getNextRow()) !== null) {
            item = {};
            
            for (i = 0; i < row.length; i++) {
                cell = row[i];
                fieldName = propertiesByColumn[cell.col];
                if (typeof fieldName === "string") {
                    // ensure round-trip iso8601 date strings through google docs
                    if (Exhibit.Importer.JSONP.GoogleSpreadsheet._dateRegex.exec(cell.val)) {
                        cell.val = Exhibit.Database.makeISO8601DateString(new Date(cell.val));
                    }

                    item[fieldName] = cell.val;
                    
                    property = properties[fieldName];
                    if (!property.single) {
                        fieldValues = cell.val.split(separator);
                        for (v = 0; v < fieldValues.length; v++) {
                            fieldValues[v] = fieldValues[v].trim();
                        }
                        item[fieldName] = fieldValues;
                    } else {
                        item[fieldName] = cell.val.trim();
                    }
                }
            }
            
            items.push(item);
        }
    }
    
    return {
        "types": types,
        "properties": properties,
        "items": items
    };    
};

/**
 * @param {String} url
 * @returns {String}
 */
Exhibit.Importer.JSONP.GoogleSpreadsheet.preprocessURL = function(url) {
    return url.replace(/\/list\//g, "/cells/");
};

Exhibit.jQuery(document).one(
    "registerJSONPImporters.exhibit",
    Exhibit.Importer.JSONP.GoogleSpreadsheet._register
);
/**
 * @fileOverview Babel service-based data conversion and import.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Importer.BabelBased = {
    _importer: null,

    _mimeTypeToReader: {
        "application/rdf+xml" : "rdf-xml",
        "application/n3" : "n3",
        
        "application/msexcel" : "xls",
        "application/x-msexcel" : "xls",
        "application/x-ms-excel" : "xls",
        "application/vnd.ms-excel" : "xls",
        "application/x-excel" : "xls",
        "application/xls" : "xls",
        "application/x-xls" : "xls",
        
        "application/x-bibtex" : "bibtex"        
    },

    _translatorPrefix: (typeof Exhibit.babelPrefix !== "undefined") ?
        Exhibit.babelPrefix + "translator?" :
        undefined
};

/**
 * @param {String} url
 * @param {Object} s
 * @param {Function} callback
 */
Exhibit.Importer.BabelBased.parse = function(url, s, callback) {
    if (typeof callback === "function") {
        callback(s);
    }
};

/**
 * @param {String} url
 * @param {String} mimeType
 * @returns {String}
 */
Exhibit.Importer.BabelBased.makeURL = function(url, mimeType) {
    if (typeof Exhibit.Importer.BabelBased._translatorPrefix === "undefined") {
        return null;
    }

    var reader, writer;
    reader = Exhibit.Importer.BabelBased._defaultReader;
    writer = Exhibit.Importer.BabelBased._defaultWriter;

    if (typeof Exhibit.Importer.BabelBased._mimeTypeToReader[mimeType] !== "undefined") {
        reader = Exhibit.Importer.BabelBased._mimeTypeToReader[mimeType];
    }

    if (reader === "bibtex") {
        writer = "bibtex-exhibit-jsonp";
    }

    return Exhibit.Importer.BabelBased._translatorPrefix + [
        "reader=" + reader,
        "writer=" + writer,
        "url=" + encodeURIComponent(url)
    ].join("&");
};

/**
 * @private
 * @static
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.Importer.BabelBased._register = function(evt, reg) {
    if (typeof Exhibit.Importer.BabelBased._translatorPrefix === "undefined") {
        return;
    }

    var types, type;
    types = [];
    for (type in Exhibit.Importer.BabelBased._mimeTypeToReader) {
        if (Exhibit.Importer.BabelBased._mimeTypeToReader.hasOwnProperty(type)) {
            types.push(type);
        }
    }
    
    Exhibit.Importer.BabelBased._importer = new Exhibit.Importer(
        types,
        "babel",
        Exhibit.Importer.BabelBased.parse
    );
};

Exhibit.jQuery(document).one(
    "registerImporters.exhibit",
    Exhibit.Importer.BabelBased._register
);
/**
 * @fileOverview Provides a holding place for Exhibit-wide controls.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ControlPanel = function(elmt, uiContext) {
    this._uiContext = uiContext;
    this._widgets = [];
    this._div = elmt;
    this._settings = {};
    this._hovering = false;
    this._id = null;
    this._registered = false;
    this._childOpen = false;
    this._createdAsDefault = false;
};

/**
 * @static
 * @private
 */
Exhibit.ControlPanel._settingSpecs = {
    "showBookmark":         { type: "boolean", defaultValue: true },
    "developerMode":        { type: "boolean", defaultvalue: false },
    "hoverReveal":          { type: "boolean", defaultValue: false }
};

/**
 * @private
 * @constant
 */
Exhibit.ControlPanel._registryKey = "controlPanel";

/**
 * @static
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ControlPanel}
 */
Exhibit.ControlPanel.create = function(configuration, elmt, uiContext) {
    var panel = new Exhibit.ControlPanel(
        elmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    Exhibit.ControlPanel._configure(panel, configuration);
    panel._setIdentifier();
    panel.register();
    panel._initializeUI();
    return panel;
};

/**
 * @static
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Coordinator}
 */
Exhibit.ControlPanel.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, panel;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    panel = new Exhibit.ControlPanel(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt :
            configElmt,
        Exhibit.UIContext.createFromDOM(configElmt, uiContext)
    );
    Exhibit.ControlPanel._configureFromDOM(panel, configuration);
    panel._setIdentifier();
    panel.register();
    panel._initializeUI();
    return panel;
};

/**
 * @static
 * @private
 * @param {Exhibit.ControlPanel} panel
 * @param {Object} configuration
 */
Exhibit.ControlPanel._configure = function(panel, configuration) {
    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        Exhibit.ControlPanel._settingSpecs,
        panel._settings
    );
};

/**
 * @static
 * @private
 * @param {Exhibit.ControlPanel} panel
 * @param {Object} configuration
 */
Exhibit.ControlPanel._configureFromDOM = function(panel, configuration) {
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        panel._div,
        Exhibit.ControlPanel._settingSpecs,
        panel._settings
    );
};

/**
 * @private
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.ControlPanel.registerComponent = function(evt, reg) {
    if (!reg.hasRegistry(Exhibit.ControlPanel._registryKey)) {
        reg.createRegistry(Exhibit.ControlPanel._registryKey);
    }
};

/**
 * @static
 * @param {jQuery.Event} evt
 * @param {jQuery} elmt
 */
Exhibit.ControlPanel.mouseOutsideElmt = function(evt, elmt) {
    var coords = Exhibit.jQuery(elmt).offset();
    return (
        evt.pageX < coords.left
            || evt.pageX > coords.left + Exhibit.jQuery(elmt).outerWidth()
            || evt.pageY < coords.top
            || evt.pageY > coords.top + Exhibit.jQuery(elmt).outerHeight()
    );
};

/**
 * @private
 */
Exhibit.ControlPanel.prototype._initializeUI = function() {
    var widget, self;
    self = this;
    if (this._settings.hoverReveal) {
        Exhibit.jQuery(this.getContainer()).fadeTo(1, 0);
        Exhibit.jQuery(this.getContainer()).bind("mouseover", function(evt) {
            self._hovering = true;
            Exhibit.jQuery(this).fadeTo("fast", 1);
        });
        Exhibit.jQuery(document.body).bind("mousemove", function(evt) {
            if (self._hovering
                && !self._childOpen
                && Exhibit.ControlPanel.mouseOutsideElmt(
                    evt,
                    self.getContainer()
                )) {
                self._hovering = false;
                Exhibit.jQuery(self.getContainer()).fadeTo("fast", 0);
            }
        });
    }
    if (this._settings.showBookmark) {
        widget = Exhibit.BookmarkWidget.create(
            { },
            this.getContainer(),
            this._uiContext
        );
        this.addWidget(widget, true);
    }
    if (this._settings.developerMode) {
        widget = Exhibit.ResetHistoryWidget.create(
            { },
            this.getContainer(),
            this._uiContext
        );
        this.addWidget(widget, true);
    }
    Exhibit.jQuery(this.getContainer()).addClass("exhibit-controlPanel");
};

/**
 *
 */
Exhibit.ControlPanel.prototype._setIdentifier = function() {
    this._id = Exhibit.jQuery(this._div).attr("id");
    if (typeof this._id === "undefined" || this._id === null) {
        this._id = Exhibit.ControlPanel._registryKey
            + "-"
            + this._uiContext.getCollection().getID()
            + "-"
            + this._uiContext.getMain().getRegistry().generateIdentifier(
                Exhibit.ControlPanel._registryKey
            );
    }
};

/**
 *
 */
Exhibit.ControlPanel.prototype.register = function() {
    if (!this._uiContext.getMain().getRegistry().isRegistered(
        Exhibit.ControlPanel._registryKey,
        this.getID()
    )) {
        this._uiContext.getMain().getRegistry().register(
            Exhibit.ControlPanel._registryKey,
            this.getID(),
            this
        );
        this._registered = true;
    }
};

/**
 *
 */
Exhibit.ControlPanel.prototype.unregister = function() {
    this._uiContext.getMain().getRegistry().unregister(
        Exhibit.ControlPanel._registryKey,
        this.getID()
    );
    this._registered = false;
};

/**
 * @returns {jQuery}
 */
Exhibit.ControlPanel.prototype.getContainer = function() {
    return Exhibit.jQuery(this._div);
};

/**
 * @returns {String}
 */
Exhibit.ControlPanel.prototype.getID = function() {
    return this._id;
};

/**
 *
 */
Exhibit.ControlPanel.prototype.childOpened = function() {
    this._childOpen = true;
};

/**
 *
 */
Exhibit.ControlPanel.prototype.childClosed = function() {
    this._childOpen = false;
};

/**
 * 
 */
Exhibit.ControlPanel.prototype.setCreatedAsDefault = function() {
    var self;
    self = this;
    this._createdAsDefault = true;
    Exhibit.jQuery(this._div).hide();
    Exhibit.jQuery(document).one("exhibitConfigured.exhibit", function(evt, ex) {
        var keys, component, i, place;
        component = Exhibit.ViewPanel._registryKey;
        keys = ex.getRegistry().getKeys(component);
        if (keys.length === 0) {
            component = Exhibit.View._registryKey;
            keys = ex.getRegistry().getKeys(component);
        }
        if (keys.length !== 0) {
            // Places default control panel before the "first" one - ideally,
            // this is the first of its kind presentationally to the user,
            // but it may not be.  If not, authors should be placing it
            // themselves.
            place = ex.getRegistry().get(component, keys[0]);
            if (typeof place._div !== "undefined") {
                Exhibit.jQuery(place._div).before(self._div);
                Exhibit.jQuery(self._div).show();
            }
        }
    });
};

/**
 * @returns {Boolean}
 */
Exhibit.ControlPanel.prototype.createdAsDefault = function() {
    return this._createdAsDefault;
};

/**
 *
 */
Exhibit.ControlPanel.prototype.dispose = function() {
    this.unregister();
    this._uiContext.dispose();
    this._uiContext = null;
    this._div = null;
    this._widgets = null;
    this._settings = null;
};

/**
 * @param {Object} widget
 * @param {Boolean} initial
 */
Exhibit.ControlPanel.prototype.addWidget = function(widget, initial) {
    this._widgets.push(widget);
    if (typeof widget.setControlPanel === "function") {
        widget.setControlPanel(this);
    }
    if (typeof initial === "undefined" || !initial) {
        this.reconstruct();
    }
};

/**
 * @param {Object} widget
 * @returns {Object}
 */
Exhibit.ControlPanel.prototype.removeWidget = function(widget) {
    var i, removed;
    removed = null;
    for (i = 0; i < this._widgets.length; i++) {
        if (this._widgets[i] === widget) {
            removed = this._widgets.splice(i, 1);
            break;
        }
    }
    this.reconstruct();
    return removed;
};

/**
 *
 */
Exhibit.ControlPanel.prototype.reconstruct = function() {
    var i;
    Exhibit.jQuery(this._div).empty();
    for (i = 0; i < this._widgets.length; i++) {
        if (typeof this._widgets[i].reconstruct === "function") {
            this._widgets[i].reconstruct(this);
        }
    }
};

Exhibit.jQuery(document).one(
    "registerComponents.exhibit",
    Exhibit.ControlPanel.registerComponent
);
/**
 * @fileOverview Helps bind and trigger events between views.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Coordinator = function(uiContext) {
    this._uiContext = uiContext;
    this._listeners = [];
};

/**
 * @static
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Coordinator}
 */
Exhibit.Coordinator.create = function(configuration, uiContext) {
    return new Exhibit.Coordinator(uiContext);
};

/**
 * @static
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Coordinator}
 */
Exhibit.Coordinator.createFromDOM = function(div, uiContext) {
    return new Exhibit.Coordinator(Exhibit.UIContext.createFromDOM(div, uiContext, false));
};

/**
 *
 */
Exhibit.Coordinator.prototype.dispose = function() {
    this._uiContext.dispose();
    this._uiContext = null;
};

/**
 * @param {Function} callback
 * @returns {Exhibit.Coordinator._Listener}
 */
Exhibit.Coordinator.prototype.addListener = function(callback) {
    var listener = new Exhibit.Coordinator._Listener(this, callback);
    this._listeners.push(listener);
    
    return listener;
};

/**
 * @param {Exhibit.Coordinator._Listener} listener
 */
Exhibit.Coordinator.prototype._removeListener = function(listener) {
    var i;
    for (i = 0; i < this._listeners.length; i++) {
        if (this._listeners[i] === listener) {
            this._listeners.splice(i, 1);
            return;
        }
    }
};

/**
 * @param {Exhibit.Coordinator._Listener} listener
 * @param {Object} o
 */
Exhibit.Coordinator.prototype._fire = function(listener, o) {
    var i, listener2;
    for (i = 0; i < this._listeners.length; i++) {
        listener2 = this._listeners[i];
        if (listener2 !== listener) {
            listener2._callback(o);
        }
    }
};

/**
 * @constructor
 * @class
 * @param {Exhibit.Coordinator} coordinator
 * @param {Function} callback
 */
Exhibit.Coordinator._Listener = function(coordinator, callback) {
    this._coordinator = coordinator;
    this._callback = callback;
};

/**
 */
Exhibit.Coordinator._Listener.prototype.dispose = function() {
    this._coordinator._removeListener(this);
};

/**
 * @param {Object} o
 */
Exhibit.Coordinator._Listener.prototype.fire = function(o) {
    this._coordinator._fire(this, o);
};
/**
 * @fileOverview Format parsing
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.FormatParser = {};

/**
 * @constant
 */
Exhibit.FormatParser._valueTypes = {
    "list" : true,
    "number" : true,
    "date" : true,
    "item" : true,
    "text" : true,
    "url" : true,
    "image" : true,
    "currency" : true
};

/**
 * @static
 * @param {Exhibit.UIContext} uiContext
 * @param {String} s
 * @param {Number} startIndex
 * @param {Object} results
 * @returns {Number}
 */
Exhibit.FormatParser.parse = function(uiContext, s, startIndex, results) {
    startIndex = startIndex || 0;
    results = results || {};
    
    var scanner = new Exhibit.FormatScanner(s, startIndex);
    try {
        return Exhibit.FormatParser._internalParse(uiContext, scanner, results, false);
    } finally {
        results.index = scanner.token() !== null ? scanner.token().start : scanner.index();
    }
};

/**
 * @param {Exhibit.UIContext} uiContext
 * @param {String} s
 * @param {Number} startIndex
 * @param {Object} results
 * @returns {Number}
 */ 
Exhibit.FormatParser.parseSeveral = function(uiContext, s, startIndex, results) {
    startIndex = startIndex || 0;
    results = results || {};
    
    var scanner = new Exhibit.FormatScanner(s, startIndex);
    try {
        return Exhibit.FormatParser._internalParse(uiContext, scanner, results, true);
    } finally {
        results.index = scanner.token() !== null ? scanner.token().start : scanner.index();
    }
};

/**
 * @param {Exhibit.UIContext} uiContext
 * @param {Exhibit.FormatScanner} scanner
 * @param {Object} results
 * @param {Boolean} several
 * @returns {}
 */
Exhibit.FormatParser._internalParse = function(uiContext, scanner, results, several) {
    var Scanner, token, next, makePosition, enterSetting, checkKeywords, parseNumber, parseInteger, parseNonnegativeInteger, parseString, parseURL, parseExpression, parseExpressionOrString, parseChoices, parseFlags, parseSetting, parseSettingList, parseRule, parseRuleList;
    Scanner = Exhibit.FormatScanner;
    token = scanner.token();
    next = function() { scanner.next(); token = scanner.token(); };
    makePosition = function() {
        return token !== null ?
            token.start :
            scanner.index();
    };
    enterSetting = function(valueType, settingName, value) {
        uiContext.putSetting("format/" + valueType + "/" + settingName, value);
    };
    checkKeywords = function(valueType, settingName, keywords) {
        if (token !== null &&
            token.type !== Scanner.IDENTIFIER &&
            typeof keywords[token.value] !== "undefined") {
            enterSetting(valueType, settingName, keywords[token.value]);
            next();
            return false;
        }
        return true;
    };
    
    parseNumber = function(valueType, settingName, keywords) {
        if (checkKeywords(valueType, settingName, keywords)) {
            if (typeof token === "undefined" || token === null || token.type !== Scanner.NUMBER) {
                throw new Error(Exhibit._("%format.error.missingNumber", makePosition()));
            }
            enterSetting(valueType, settingName, token.value);
            next();
        }
    };
    parseInteger = function(valueType, settingName, keywords) {
        if (checkKeywords(valueType, settingName, keywords)) {
            if (typeof token === "undefined" || token === null || token.type !== Scanner.NUMBER) {
                throw new Error(Exhibit._("%format.error.missingInteger", makePosition()));
            }
            enterSetting(valueType, settingName, Math.round(token.value));
            next();
        }
    };
    parseNonnegativeInteger = function(valueType, settingName, keywords) {
        if (checkKeywords(valueType, settingName, keywords)) {
            if (typeof token === "undefined" || token === null || token.type !== Scanner.NUMBER || token.value < 0) {
                throw new Error(Exhibit._("%format.error.missingNonNegativeInteger",  makePosition()));
            }
            enterSetting(valueType, settingName, Math.round(token.value));
            next();
        }
    };
    parseString = function(valueType, settingName, keywords) {
        if (checkKeywords(valueType, settingName, keywords)) {
            if (typeof token === "undefined" || token === null || token.type !== Scanner.STRING) {
                throw new Error(Exhibit._("%format.error.missingString", makePosition()));
            }
            enterSetting(valueType, settingName, token.value);
            next();
        }
    };
    parseURL = function(valueType, settingName, keywords) {
        if (checkKeywords(valueType, settingName, keywords)) {
            if (typeof token === "undefined" || token === null || token.type !== Scanner.URL) {
                throw new Error(Exhibit._("%format.error.missingURL", makePosition()));
            }
            enterSetting(valueType, settingName, token.value);
            next();
        }
    };
    parseExpression = function(valueType, settingName, keywords) {
        if (checkKeywords(valueType, settingName, keywords)) {
            if (typeof token === "undefined" || token === null || token.type !== Scanner.EXPRESSION) {
                throw new Error(Exhibit._("%format.error.missingExpression", makePosition()));
            }
            enterSetting(valueType, settingName, token.value);
            next();
        }
    };
    parseExpressionOrString = function(valueType, settingName, keywords) {
        if (checkKeywords(valueType, settingName, keywords)) {
            if (typeof token === "undefined" || token === null || (token.type !== Scanner.EXPRESSION && token.type !== Scanner.STRING)) {
                throw new Error(Exhibit._("%format.error.missingExpressionOrString", makePosition()));
            }
            enterSetting(valueType, settingName, token.value);
            next();
        }
    };
    parseChoices = function(valueType, settingName, choices) {
        var i;
        if (typeof token === "undefined" || token === null || token.type !== Scanner.IDENTIFIER) {
            throw new Error(Exhibit._("%format.error.missingOption", makePosition()));
        }
        for (i = 0; i < choices.length; i++) {
            if (token.value === choices[i]) {
                enterSetting(valueType, settingName, token.value);
                next();
                return;
            }
        }
        throw new Error(Exhibit._("%format.error.unsupportedOption", token.value, settingName, valueType, makePosition()));
    };
    parseFlags = function(valueType, settingName, flags, counterFlags) {
        var i, flagSet, counterFlagSet;
        while (token !== null && token.type === Scanner.IDENTIFIER) {
            flagSet = false;
            counterFlagSet = false;
            for (i = 0; i < flags.length && !flagSet; i++) {
                if (token.value === flags[i]) {
                    enterSetting(valueType, settingName + "/" + token.value, true);
                    next();
                    flagSet = true;
                }
            }
            if (!flagSet && typeof counterFlags[token.value] !== "undefined") {
                enterSetting(valueType, settingName + "/" + counterFlags[token.value], false);
                next();
                counterFlagSet = true;
            }
            if (!counterFlagSet) {
                throw new Error(Exhibit._("%format.error.unsupportedFlag", token.value, settingName, valueType, makePosition()));
            }
        }
    };
    
    parseSetting = function(valueType, settingName) {
        switch (valueType) {
        case "number":
            switch (settingName) {
            case "decimal-digits":
                parseNonnegativeInteger(valueType, settingName, { "default": -1 });
                return;
            }
            break;
        case "date":
            switch (settingName) {
            case "time-zone":
                parseNumber(valueType, settingName, { "default" : null });
                return;
            case "show":
                parseChoices(valueType, settingName, [ "date", "time", "date-time" ]);
                return;
            case "mode":
                parseChoices(valueType, settingName, [ "short", "medium", "long", "full" ]);
                enterSetting(valueType, "template", null); // mode and template are exclusive
                return;
            case "template":
                parseString(valueType, settingName, {});
                enterSetting(valueType, "mode", null); // mode and template are exclusive
                return;
            }
            break;
        case "boolean":
            break;
        case "text":
            switch (settingName) {
            case "max-length":
                parseInteger(valueType, settingName, { "none" : 0 });
                return;
            }
            break;
        case "image":
            switch (settingName) {
            case "tooltip":
                parseExpressionOrString(valueType, settingName, { "none" : null });
                return;
            case "max-width":
            case "max-height":
                parseInteger(valueType, settingName, { "none" : -1 });
                return;
            }
            break;
        case "url":
            switch (settingName) {
            case "target":
                parseString(valueType, settingName, { "none" : null });
                return;
            case "external-icon":
                parseURL(valueType, settingName, { "none" : null });
                return;
            }
            break;
        case "item":
            switch (settingName) {
            case "title":
                parseExpression(valueType, settingName, { "default" : null });
                return;
            }
            break;
        case "currency":
            switch (settingName) {
            case "negative-format":
                parseFlags(valueType, settingName, 
                    [ "red", "parentheses", "signed" ], 
                    { "unsigned" : "signed", "no-parenthesis" : "parentheses", "black" : "red" }
                );
                return;
            case "symbol":
                parseString(valueType, settingName, { "default" : "$", "none" : null });
                return;
            case "symbol-placement":
                parseChoices(valueType, settingName, [ "first", "last", "after-sign" ]);
                return;
            case "decimal-digits":
                parseNonnegativeInteger(valueType, settingName, { "default" : -1 });
                return;
            }
            break;
        case "list":
            switch (settingName) {
            case "separator":
            case "last-separator":
            case "pair-separator":
            case "empty-text":
                parseString(valueType, settingName, {});
                return;
            }
            break;
        }
        throw new Error(Exhibit._("%format.error.unsupportedSetting", settingName, valueType, makePosition()));
    };
    parseSettingList = function(valueType) {

        while (token !== null && token.type === Scanner.IDENTIFIER) {
            var settingName = token.value;

            next();
            

            if (typeof token === "undefined" || token === null || token.type !== Scanner.DELIMITER || token.value !== ":") {
                throw new Error(Exhibit._("%format.error.missingColon", makePosition()));
            }
            next();
            
            parseSetting(valueType, settingName);
            

            if (typeof token === "undefined" || token === null || token.type !== Scanner.DELIMITER || token.value !== ";") {
                break;
            } else {
                next();
            }
        }

    };
    parseRule = function() {
        if (typeof token === "undefined" || token === null || token.type !== Scanner.IDENTIFIER) {
            throw new Error(Exhibit._("%format.error.missingValueType", makePosition()));
        }
        
        var valueType = token.value;
        if (typeof Exhibit.FormatParser._valueTypes[valueType] === "undefined") {
            throw new Error(Exhibit._("%format.error.unsupportedValueType", valueType, makePosition()));
        }
        next();
        
        if (token !== null && token.type === Scanner.DELIMITER && token.value === "{") {
            next();
            parseSettingList(valueType);
            
            if (typeof token === "undefined" || token === null || token.type !== Scanner.DELIMITER || token.value !== "}") {
                throw new Error(Exhibit._("%format.error.missingBrace", makePosition()));
            }
            next();
        }
        return valueType;
    };
    parseRuleList = function() {
        var valueType = "text";
        while (token !== null && token.type === Scanner.IDENTIFIER) {
            valueType = parseRule();
        }
        return valueType;
    };
    
    if (several) {
        return parseRuleList();
    } else {
        return parseRule();
    }
};

/**
 * @class
 * @constructor
 * @param {String} text
 * @param {Number} startIndex
 */
Exhibit.FormatScanner = function(text, startIndex) {
    this._text = text + " "; // make it easier to parse
    this._maxIndex = text.length;
    this._index = startIndex;
    this.next();
};

/**
 * @constant
 */
Exhibit.FormatScanner.DELIMITER     = 0;
/**
 * @constant
 */
Exhibit.FormatScanner.NUMBER        = 1;
/**
 * @constant
 */
Exhibit.FormatScanner.STRING        = 2;
/**
 * @constant
 */
Exhibit.FormatScanner.IDENTIFIER    = 3;
/**
 * @constant
 */
Exhibit.FormatScanner.URL           = 4;
/**
 * @constant
 */
Exhibit.FormatScanner.EXPRESSION    = 5;
/**
 * @constant
 */
Exhibit.FormatScanner.COLOR         = 6;

/**
 * @returns {Object}
 */
Exhibit.FormatScanner.prototype.token = function() {
    return this._token;
};

/**
 * @returns {Number}
 */
Exhibit.FormatScanner.prototype.index = function() {
    return this._index;
};

/**
 *
 */
Exhibit.FormatScanner.prototype.next = function() {
    this._token = null;

    var self, skipSpaces, i, c1, c2, identifier, openParen, closeParen, j, o, expression;
    
    self = this;
    skipSpaces = function(x) {
        while (x < self._maxIndex &&
            " \t\r\n".indexOf(self._text.charAt(x)) >= 0) {
            
            x++;
        }
        return x;
    };
    this._index = skipSpaces(this._index);
    
    if (this._index < this._maxIndex) {
        c1 = this._text.charAt(this._index);
        c2 = this._text.charAt(this._index + 1);
        
        if ("{}(),:;".indexOf(c1) >= 0) {
            this._token = {
                type:   Exhibit.FormatScanner.DELIMITER,
                value:  c1,
                start:  this._index,
                end:    this._index + 1
            };
            this._index++;
        } else if ("\"'".indexOf(c1) >= 0) { // quoted strings
            i = this._index + 1;
            while (i < this._maxIndex) {
                if (this._text.charAt(i) === c1 && this._text.charAt(i - 1) !== "\\") {
                    break;
                }
                i++;
            }
            
            if (i < this._maxIndex) {
                this._token = {
                    type:   Exhibit.FormatScanner.STRING,
                    value:  this._text.substring(this._index + 1, i).replace(/\\'/g, "'").replace(/\\"/g, '"'),
                    start:  this._index,
                    end:    i + 1
                };
                this._index = i + 1;
            } else {
                throw new Error(Exhibit._("%format.error.unterminatedString", this._index));
            }
        } else if (c1 === "#") { // color
            i = this._index + 1;
            while (i < this._maxIndex && this._isHexDigit(this._text.charAt(i))) {
                i++;
            }
            
            this._token = {
                type:   Exhibit.FormatScanner.COLOR,
                value:  this._text.substring(this._index, i),
                start:  this._index,
                end:    i
            };
            this._index = i;
        } else if (this._isDigit(c1)) { // number
            i = this._index;
            while (i < this._maxIndex && this._isDigit(this._text.charAt(i))) {
                i++;
            }
            
            if (i < this._maxIndex && this._text.charAt(i) === ".") {
                i++;
                while (i < this._maxIndex && this._isDigit(this._text.charAt(i))) {
                    i++;
                }
            }
            
            this._token = {
                type:   Exhibit.FormatScanner.NUMBER,
                value:  parseFloat(this._text.substring(this._index, i)),
                start:  this._index,
                end:    i
            };
            this._index = i;
        } else { // identifier
            i = this._index;
            while (i < this._maxIndex) {
                j = this._text.substr(i).search(/\W/);
                if (j > 0) {
                    i += j;
                } else if ("-".indexOf(this._text.charAt(i)) >= 0) {
                    i++;
                } else {
                    break;
                }
            }
            
            identifier = this._text.substring(this._index, i);
            if (identifier === "url") {
                openParen = skipSpaces(i);
                if (this._text.charAt(openParen) === "(") {
                    closeParen = this._text.indexOf(")", openParen);
                    if (closeParen > 0) {
                        this._token = {
                            type:   Exhibit.FormatScanner.URL,
                            value:  this._text.substring(openParen + 1, closeParen),
                            start:  this._index,
                            end:    closeParen + 1
                        };
                        this._index = closeParen + 1;
                    } else {
                        throw new Error(Exhibit._("%format.error.missingCloseURL", this._index));
                    }
                }
            } else if (identifier === "expression") {
                openParen = skipSpaces(i);
                if (this._text.charAt(openParen) === "(") {
                    o = {};
                    expression = Exhibit.ExpressionParser.parse(this._text, openParen + 1, o);
                    
                    closeParen = skipSpaces(o.index);
                    if (this._text.charAt(closeParen) === ")") {
                        this._token = {
                            type:   Exhibit.FormatScanner.EXPRESSION,
                            value:  expression,
                            start:  this._index,
                            end:    closeParen + 1
                        };
                        this._index = closeParen + 1;
                    } else {
                        throw new Error("Missing ) to close expression at " + o.index);
                    }
                }
            } else {
                this._token = {
                    type:   Exhibit.FormatScanner.IDENTIFIER,
                    value:  identifier,
                    start:  this._index,
                    end:    i
                };
                this._index = i;
            }
        }
    }
};

/**
 * @param {String} c
 * @returns {Boolean}
 */
Exhibit.FormatScanner.prototype._isDigit = function(c) {
    return "0123456789".indexOf(c) >= 0;
};

/**
 * @param {String} c
 * @returns {Boolean}
 */
Exhibit.FormatScanner.prototype._isHexDigit = function(c) {
    return "0123456789abcdefABCDEF".indexOf(c) >= 0;
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.Formatter = {
    /**
     * @constant
     */
    "_lessThanRegex": /</g,
    /**
     * @constant
     */
    "_greaterThanRegex": />/g
};


/**
 * @static
 * @param {jQuery} parentElmt
 * @param {Number} count
 * @param {Exhibit.UIContext} uiContext
 * @returns {Function}
 */
Exhibit.Formatter.createListDelimiter = function(parentElmt, count, uiContext) {
    var separator, lastSeparator, pairSeparator, f;
    separator = uiContext.getSetting("format/list/separator");
    lastSeparator = uiContext.getSetting("format/list/last-separator");
    pairSeparator = uiContext.getSetting("format/list/pair-separator");
    
    if (typeof separator !== "string") {
        separator = Exhibit._("%formatter.listSeparator");
    }
    if (typeof lastSeparator !== "string") {
        lastSeparator = Exhibit._("%formatter.listLastSeparator");
    }
    if (typeof pairSeparator !== "string") {
        pairSeparator = Exhibit._("%formatter.listPairSeparator");
    }

    f = function() {
        if (f.index > 0 && f.index < count) {
            if (count > 2) {
                Exhibit.jQuery(parentElmt).append(document.createTextNode(
                (f.index === count - 1) ? lastSeparator : separator));
            } else {
                Exhibit.jQuery(parentElmt).append(document.createTextNode(pairSeparator));
            }
        }
        f.index++;
    };
    f.index = 0;
    
    return f;
};

/**
 * @param {String} s
 * @returns {String}
 */
Exhibit.Formatter.encodeAngleBrackets = function(s) {
    return s.replace(Exhibit.Formatter._lessThanRegex, "&lt;").
        replace(Exhibit.Formatter._greaterThanRegex, "&gt;");
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._ListFormatter = function(uiContext) {
    this._uiContext = uiContext;
    this._separator = uiContext.getSetting("format/list/separator");
    this._lastSeparator = uiContext.getSetting("format/list/last-separator");
    this._pairSeparator = uiContext.getSetting("format/list/pair-separator");
    this._emptyText = uiContext.getSetting("format/list/empty-text");
    
    if (typeof this._separator !== "string") {
        this._separator = Exhibit._("%formatter.listSeparator");
    }
    if (typeof this._lastSeparator !== "string") {
        this._lastSeparator = Exhibit._("%formatter.listLastSeparator");
    }
    if (typeof this._pairSeparator !== "string") {
        this._pairSeparator = Exhibit._("%formatter.listPairSeparator");
    }
};

/**
 * @param {Exhibit.Set} values
 * @param {Number} count
 * @param {String} valueType
 * @param {Function} appender
 */
Exhibit.Formatter._ListFormatter.prototype.formatList = function(values, count, valueType, appender) {
    var uiContext, self, index;
    uiContext = this._uiContext;
    self = this;
    if (count === 0) {
        if (typeof this._emptyText !== "undefined" && this._emptyText !== null && this._emptyText.length > 0) {
            appender(document.createTextNode(this._emptyText));
        }
    } else if (count === 1) {
        values.visit(function(v) {
            uiContext.format(v, valueType, appender);
        });
    } else {
        index = 0;
        if (count === 2) {
            values.visit(function(v) {
                uiContext.format(v, valueType, appender);
                index++;
                
                if (index === 1) {
                    appender(document.createTextNode(self._pairSeparator));
                }
            });
        } else {
            values.visit(function(v) {
                uiContext.format(v, valueType, appender);
                index++;
                
                if (index < count) {
                    appender(document.createTextNode(
                        (index === count - 1) ? self._lastSeparator : self._separator));
                }
            });
        }
    }
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._TextFormatter = function(uiContext) {
    this._maxLength = uiContext.getSetting("format/text/max-length");
    
    if (typeof this._maxLength === "number") {
        this._maxLength = Math.max(3, Math.round(this._maxLength));
    } else {
        this._maxLength = 0; // zero means no limit
    }
};

/**
 * @param {String} value
 * @param {Function} appender
 */
Exhibit.Formatter._TextFormatter.prototype.format = function(value, appender) {
    var span = Exhibit.jQuery("<span>").html(this.formatText(value));
    appender(span);
};

/**
 * @param {String} value
 * @returns {String}
 */
Exhibit.Formatter._TextFormatter.prototype.formatText = function(value) {
    if (Exhibit.params.safe) {
        value = Exhibit.Formatter.encodeAngleBrackets(value);
    }
    
    if (this._maxLength === 0 || value.length <= this._maxLength) {
        return value;
    } else {
        return Exhibit._("%formatter.textEllipsis", value.substr(0, this._maxLength));
    }
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._BooleanFormatter = function(uiContext) {
};

/**
 * @param {String|Boolean} value
 * @param {Function} appender
 */
Exhibit.Formatter._BooleanFormatter.prototype.format = function(value, appender) {
    var span = Exhibit.jQuery("<span>").html(this.formatText(value));
    appender(span);
};

/**
 * @param {String|Boolean} value
 * @returns {String}
 */
Exhibit.Formatter._BooleanFormatter.prototype.formatText = function(value) {
    return (typeof value === "boolean" ? value : (typeof value === "string" ? (value === "true") : false)) ? 
        Exhibit._("%formatter.booleanTrue") : Exhibit._("%formatter.booleanFalse");
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._NumberFormatter = function(uiContext) {
    this._decimalDigits = uiContext.getSetting("format/number/decimal-digits");
    
    if (typeof this._decimalDigits === "number") {
        this._decimalDigits = Math.max(-1, Math.round(this._decimalDigits));
    } else {
        this._decimalDigits = -1; // -1 means no limit
    }
};

/**
 * @param {Number} value
 * @param {Function} appender
 */
Exhibit.Formatter._NumberFormatter.prototype.format = function(value, appender) {
    appender(document.createTextNode(this.formatText(value)));
};

/**
 * @param {Number} value
 * @returns {String}
 */
Exhibit.Formatter._NumberFormatter.prototype.formatText = function(value) {
    if (this._decimalDigits === -1) {
        return value.toString();
    } else {
        return value.toFixed(this._decimalDigits);
    }
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._ImageFormatter = function(uiContext) {
    this._uiContext = uiContext;
    
    this._maxWidth = uiContext.getSetting("format/image/max-width");
    if (typeof this._maxWidth === "number") {
        this._maxWidth = Math.max(-1, Math.round(this._maxWidth));
    } else {
        this._maxWidth = -1; // -1 means no limit
    }
    
    this._maxHeight = uiContext.getSetting("format/image/max-height");
    if (typeof this._maxHeight === "number") {
        this._maxHeight = Math.max(-1, Math.round(this._maxHeight));
    } else {
        this._maxHeight = -1; // -1 means no limit
    }
    
    this._tooltip = uiContext.getSetting("format/image/tooltip");
};

/**
 * @param {String} value
 * @param {Function} appender
 */
Exhibit.Formatter._ImageFormatter.prototype.format = function(value, appender) {
    if (Exhibit.params.safe) {
        value = value.trim().startsWith("javascript:") ? "" : value;
    }
    
    var img = Exhibit.jQuery("<img>").attr("src", value);
    
    if (this._tooltip !== null) {
        if (typeof this._tooltip === "string") {
            img.attr("title", this._tootlip);
        } else {
            img.attr("title",
                     this._tooltip.evaluateSingleOnItem(
                         this._uiContext.getSetting("itemID"),
                         this._uiContext.getDatabase()
                     ).value);
        }
    }
    appender(img);
};

/**
 * @param {String} value
 * @returns {String}
 */
Exhibit.Formatter._ImageFormatter.prototype.formatText = function(value) {
    return value;
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._URLFormatter = function(uiContext) {
    this._target = uiContext.getSetting("format/url/target");
    this._externalIcon = uiContext.getSetting("format/url/external-icon");
};

/**
 * @param {String} value
 * @param {Function} appender
 */
Exhibit.Formatter._URLFormatter.prototype.format = function(value, appender) {
    var a = Exhibit.jQuery("a").attr("href", value).html(value);
    
    if (this._target !== null) {
        a.attr("target", this._target);
    }
    // Unused
    //if (this._externalIcon !== null) {
    //
    //}
    appender(a);
};

/**
 * @param {String} value
 * @returns {String}
 */
Exhibit.Formatter._URLFormatter.prototype.formatText = function(value) {
    if (Exhibit.params.safe) {
        value = value.trim().startsWith("javascript:") ? "" : value;
    }
    return value;
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._CurrencyFormatter = function(uiContext) {
    this._decimalDigits = uiContext.getSetting("format/currency/decimal-digits");
    if (typeof this._decimalDigits === "number") {
        this._decimalDigits = Math.max(-1, Math.round(this._decimalDigits)); // -1 means no limit
    } else {
        this._decimalDigits = 2;
    }
    
    this._symbol = uiContext.getSetting("format/currency/symbol");
    if (typeof this._symbol === "undefined" || this._symbol === null) {
        this._symbol = Exhibit._("%formatter.currencySymbol");
    }
    
    this._symbolPlacement = uiContext.getSetting("format/currency/symbol-placement");
    if (typeof this._symbolPlacement === "undefined" || this._symbolPlacement === null) {
        this._symbol = Exhibit._("%formatter.currencySymbolPlacement");
    }
    
    this._negativeFormat = {
        signed :      uiContext.getBooleanSetting("format/currency/negative-format/signed", Exhibit._("%formatter.currencyShowSign")),
        red :         uiContext.getBooleanSetting("format/currency/negative-format/red", Exhibit._("%formatter.currencyShowRed")),
        parentheses : uiContext.getBooleanSetting("format/currency/negative-format/parentheses", Exhibit._("%formatter.currencyShowParentheses"))
    };
};

/**
 * @param {Number} value
 * @param {Function} appender
 */
Exhibit.Formatter._CurrencyFormatter.prototype.format = function(value, appender) {
    var text, span;
    text = this.formatText(value);
    if (value < 0 && this._negativeFormat.red) {
        span = Exhibit.jQuery("<span>").html(text).css("color", "red");
        appender(span);
    } else {
        appender(document.createTextNode(text));
    }
};

/**
 * @param {Number} value
 * @returns {String}
 */
Exhibit.Formatter._CurrencyFormatter.prototype.formatText = function(value) {
    var negative, text, sign;
    negative = value < 0;
    if (this._decimalDigits === -1) {
        text = Math.abs(value);
    } else {
        text = Math.abs(value).toFixed(this._decimalDigits);
    }
    
    sign = (negative && this._negativeFormat.signed) ? "-" : "";
    if (negative && this._negativeFormat.parentheses) {
        text = "(" + text + ")";
    }
    
    switch (this._negativeFormat) {
    case "first":       text = this._symbol + sign + text; break;
    case "after-sign":  text = sign + this._symbol + text; break;
    case "last":        text = sign + text + this._symbol; break;
    }
    return text;
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._ItemFormatter = function(uiContext) {
    this._uiContext = uiContext;
    this._title = uiContext.getSetting("format/item/title");
};

/**
 * @param {String} value
 * @param {Function} appender
 */
Exhibit.Formatter._ItemFormatter.prototype.format = function(value, appender) {
    var self, title, a, handler;
    self = this;
    title = this.formatText(value);
    
    a = Exhibit.jQuery("<a href=\"" + Exhibit.Persistence.getItemLink(value) + "\" class=\"exhibit-item\">" + title + "</a>");

    handler = function(evt) {
        Exhibit.UI.showItemInPopup(value, a.get(0), self._uiContext);
        evt.preventDefault();
        evt.stopPropagation();
    };

    a.bind("click", handler);
    
    appender(a);
};

/**
 * @param {String} value
 * @returns {String}
 */
Exhibit.Formatter._ItemFormatter.prototype.formatText = function(value) {
    var database, title;
    database = this._uiContext.getDatabase();
    title = null;
    
    if (typeof this._title === "undefined" || this._title === null) {
        title = database.getObject(value, "label");
    } else {
        title = this._title.evaluateSingleOnItem(value, database).value;
    }
    
    if (typeof title === "undefined" || title === null) {
        title = value;
    }
    
    return title;
};

/**
 * @class
 * @constructor
 * @public
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Formatter._DateFormatter = function(uiContext) {
    var mode, show, template, segments, placeholders, startIndex, p, placeholder, index, retriever;

    this._timeZone = uiContext.getSetting("format/date/time-zone");
    if (typeof this._timeZone !== "number") {
        this._timeZone = -(new Date().getTimezoneOffset()) / 60;
    }
    this._timeZoneOffset = this._timeZone * 3600000;
    
    mode = uiContext.getSetting("format/date/mode");
    show = uiContext.getSetting("format/date/show");
    template = null;
    
    switch (mode) {
    case "short":
        template = 
            show === "date" ?  Exhibit._("%formatter.dateShortFormat") :
            (show === "time" ? Exhibit._("%formatter.timeShortFormat") : 
                              Exhibit._("%formatter.dateTimeShortFormat"));
        break;
    case "medium":
        template = 
            show === "date" ?  Exhibit._("%formatter.dateMediumFormat") :
            (show === "time" ? Exhibit._("%formatter.timeMediumFormat") : 
                              Exhibit._("%formatter.dateTimeMediumFormat"));
        break;
    case "long":
        template = 
            show === "date" ?  Exhibit._("%formatter.dateLongFormat") :
            (show === "time" ? Exhibit._("%formatter.timeLongFormat") : 
                              Exhibit._("%formatter.dateTimeLongFormat"));
        break;
    case "full":
        template = 
            show === "date" ?  Exhibit._("%formatter.dateFullFormat") :
            (show === "time" ? Exhibit._("%formatter.timeFullFormat") : 
                              Exhibit._("%formatter.dateTimeFullFormat"));
        break;
    default:
        template = uiContext.getSetting("format/date/template");
    }
    
    if (typeof template !== "string") {
        template = Exhibit._("%formatter.dateTimeDefaultFormat");
    }
    
    segments = [];
    
    placeholders = template.match(/\b\w+\b/g);
    startIndex = 0;
    for (p = 0; p < placeholders.length; p++) {
        placeholder = placeholders[p];
        index = template.indexOf(placeholder, startIndex);
        if (index > startIndex) {
            segments.push(template.substring(startIndex, index));
        }
        
        retriever = Exhibit.Formatter._DateFormatter._retrievers[placeholder];
        if (typeof retriever === "function") {
            segments.push(retriever);
        } else {
            segments.push(placeholder);
        }
        
        startIndex = index + placeholder.length;
    }
    
    if (startIndex < template.length) {
        segments.push(template.substr(startIndex));
    }
    
    this._segments = segments;
};

/**
 * @param {Date|String} value
 * @param {Function} appender
 */
Exhibit.Formatter._DateFormatter.prototype.format = function(value, appender) {
    appender(document.createTextNode(this.formatText(value)));
};

/**
 * @param {Date|String} value
 * @returns {String}
 */
Exhibit.Formatter._DateFormatter.prototype.formatText = function(value) {
    var date, text, segments, i, segment;
    date = (value instanceof Date) ? value : Exhibit.DateTime.parseIso8601DateTime(value);
    if (typeof date === "undefined" || date === null) {
        return value;
    }
    
    date.setTime(date.getTime() + this._timeZoneOffset);
    
    text = "";
    segments = this._segments;
    for (i = 0; i < segments.length; i++) {
        segment = segments[i];
        if (typeof segment === "string") {
            text += segment;
        } else {
            text += segment(date);
        }
    }
    return text;
};

/**
 * @param {Number} n
 * @returns {String}
 */
Exhibit.Formatter._DateFormatter._pad = function(n) {
    return n < 10 ? ("0" + n) : n.toString();
};

/**
 * @param {Number} n
 * @returns {String}
 */
Exhibit.Formatter._DateFormatter._pad3 = function(n) {
    return n < 10 ? ("00" + n) : (n < 100 ? ("0" + n) : n.toString());
};

Exhibit.Formatter._DateFormatter._retrievers = {
    // day of month
    /**
     * @param {Date} date
     * @returns {String}
     */
    "d": function(date) {
        return date.getUTCDate().toString();
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "dd": function(date) {
        return Exhibit.Formatter._DateFormatter._pad(date.getUTCDate());
    },
    
    // day of week
    /**
     * @param {Date} date
     * @returns {String}
     */
    "EEE": function(date) {
        return Exhibit._("%formatter.shortDaysOfWeek")[date.getUTCDay()];
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "EEEE": function(date) {
        return Exhibit._("%formatter.daysOfWeek")[date.getUTCDay()];
    },
    
    // month
    /**
     * @param {Date} date
     * @returns {String}
     */
    "MM": function(date) {
        return Exhibit.Formatter._DateFormatter._pad(date.getUTCMonth() + 1);
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "MMM": function(date) {
        return Exhibit._("%formatter.shortMonths")[date.getUTCMonth()];
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "MMMM": function(date) {
        return Exhibit._("%formatter.months")[date.getUTCMonth()];
    },
    
    // year
    /**
     * @param {Date} date
     * @returns {String}
     */
    "yy": function(date) {
        return Exhibit.Formatter._DateFormatter._pad(date.getUTCFullYear() % 100);
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "yyyy": function(date) {
        var y = date.getUTCFullYear();
        return y > 0 ? y.toString() : (1 - y);
    },
    
    // era
    /**
     * @param {Date} date
     * @returns {String}
     */
    "G": function(date) {
        var y = date.getUTCYear();
        return y > 0 ? Exhibit._("%formatter.commonEra") : Exhibit._("%formatter.beforeCommonEra");
    },
    
    // hours of day
    /**
     * @param {Date} date
     * @returns {String}
     */
    "HH": function(date) {
        return Exhibit.Formatter._DateFormatter._pad(date.getUTCHours());
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "hh": function(date) {
        var h = date.getUTCHours();
        return Exhibit.Formatter._DateFormatter._pad(h === 0 ? 12 : (h > 12 ? h - 12 : h));
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "h": function(date) {
        var h = date.getUTCHours();
        return (h === 0 ? 12 : (h > 12 ? h - 12 : h)).toString();
    },
    
    // am/pm
    /**
     * @param {Date} date
     * @returns {String}
     */
    "a": function(date) {
        return date.getUTCHours() < 12 ? Exhibit._("%formatter.beforeNoon") : Exhibit._("%formatter.afterNoon");
    },
    /**
     * @param {Date} date
     * @returns {String}
     */
    "A": function(date) {
        return date.getUTCHours() < 12 ? Exhibit._("%formatter.BeforeNoon") : Exhibit._("%formatter.AfterNoon");
    },
    
    // minutes of hour
    /**
     * @param {Date} date
     * @returns {String}
     */
    "mm": function(date) {
        return Exhibit.Formatter._DateFormatter._pad(date.getUTCMinutes());
    },
    
    // seconds of minute
    /**
     * @param {Date} date
     * @returns {String}
     */
    "ss": function(date) {
        return Exhibit.Formatter._DateFormatter._pad(date.getUTCSeconds());
    },
    
    // milliseconds of minute
    /**
     * @param {Date} date
     * @returns {String}
     */
    "S": function(date) {
        return Exhibit.Formatter._DateFormatter._pad3(date.getUTCMilliseconds());
    }
    
};

/**
 * @constant
 */
Exhibit.Formatter._constructors = {
    "number" : Exhibit.Formatter._NumberFormatter,
    "date" : Exhibit.Formatter._DateFormatter,
    "text" : Exhibit.Formatter._TextFormatter,
    "boolean" : Exhibit.Formatter._BooleanFormatter,
    "image" : Exhibit.Formatter._ImageFormatter,
    "url" : Exhibit.Formatter._URLFormatter,
    "item" : Exhibit.Formatter._ItemFormatter,
    "currency" : Exhibit.Formatter._CurrencyFormatter
};
/**
 * @fileOverview Lens registry for tracking lenses in a context.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Exhibit.LensRegistry} parentRegistry
 */
Exhibit.LensRegistry = function(parentRegistry) {
    this._parentRegistry = parentRegistry;
    this._defaultLens = null;
    this._typeToLens = {};
    this._editLensTemplates = {};
    this._submissionLensTemplates = {};
    this._lensSelectors = [];
};

/**
 * @param {Element|String} elmtOrURL
 */
Exhibit.LensRegistry.prototype.registerDefaultLens = function(elmtOrURL) {
    this._defaultLens = (typeof elmtOrURL === "string") ? elmtOrURL : elmtOrURL.cloneNode(true);
};

/**
 * @param {Element|String} elmtOrURL
 * @param {String} type
 */
Exhibit.LensRegistry.prototype.registerLensForType = function(elmtOrURL, type) { 
    if (typeof elmtOrURL === "string") {
        this._typeToLens[type] = elmtOrURL;
    } 
    
    var role = Exhibit.getRoleAttribute(elmtOrURL);
    if (role === "lens") {
        this._typeToLens[type] = elmtOrURL.cloneNode(true);
    } else if (role === "edit-lens") {
        this._editLensTemplates[type] = elmtOrURL.cloneNode(true);
    } else {
        Exhibit.Debug.warn(Exhibit._("%lens.error.unknownLensType", elmtOrURL));
    }
};

/**
 * @param {Function} lensSelector
 */
Exhibit.LensRegistry.prototype.addLensSelector = function(lensSelector) {
    this._lensSelectors.unshift(lensSelector);
};

/**
 * @param {String} itemID
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Lens}
 */
Exhibit.LensRegistry.prototype.getLens = function(itemID, uiContext) {
    return uiContext.isBeingEdited(itemID)
        ? this.getEditLens(itemID, uiContext)
        : this.getNormalLens(itemID, uiContext);
};

/**
 * @param {String} itemID
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Lens}
 */
Exhibit.LensRegistry.prototype.getNormalLens = function(itemID, uiContext) {
    var db, i, lens, type;

    db = uiContext.getDatabase();

    for (i = 0; i < this._lensSelectors.length; i++) {
        lens = this._lensSelectors[i](itemID, db);
        if (typeof lens !== "undefined" && lens !== null) {
            return lens;
        }
    }
    
    type = db.getObject(itemID, "type");
    if (typeof this._typeToLens[type] !== "undefined") {
        return this._typeToLens[type];
    }
    if (typeof this._defaultLens !== "undefined" &&
        this._defaultLens !== null) {
        return this._defaultLens;
    }
    if (typeof this._parentRegistry !== "undefined" &&
        this._parenRegistry !== null) {
        return this._parentRegistry.getLens(itemID, uiContext);
    }
    return null;
};

/**
 * @param {String} itemID
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Lens}
 */
Exhibit.LensRegistry.prototype.getEditLens = function(itemID, uiContext) {
    var type = uiContext.getDatabase().getObject(itemID, "type");
    
    if (typeof this._editLensTemplates[type] !== "undefined") {
        return this._editLensTemplates[type];
    } else {
        return this._parentRegistry && this._parentRegistry.getEditLens(itemID, uiContext);
    }
};

/**
 * @param {String} itemID
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @param {Object} opts
 * @param {Exhibit.Lens} opts.lensTemplate
 * @returns {Exhibit.Lens}
 */
Exhibit.LensRegistry.prototype.createLens = function(itemID, div, uiContext, opts) {
    var lens, lensTemplate;
    lens = new Exhibit.Lens();
    
    opts = opts || {};
    lensTemplate = opts.lensTemplate || this.getLens(itemID, uiContext);
    
    if (typeof lensTemplate === "undefined" || lensTemplate === null) {
        lens._constructDefaultUI(itemID, div, uiContext);
    } else if (typeof lensTemplate === "string") {
        lens._constructFromLensTemplateURL(itemID, div, uiContext, lensTemplate, opts);
    } else {
        lens._constructFromLensTemplateDOM(itemID, div, uiContext, lensTemplate, opts);
    }
    return lens;
};

/**
 * @param {String} itemID
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @param {Object} opts
 * @param {Exhibit.Lens} opts.lensTemplate
 * @returns {Exhibit.Lens}
 */
Exhibit.LensRegistry.prototype.createEditLens = function(itemID, div, uiContext, opts) {
    opts = opts || {};
    opts.lensTemplate = this.getEditLens(itemID, uiContext);
    return this.createLens(itemID, div, uiContext, opts);
};

/**
 * @param {String} itemID
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @param {Object} opts
 * @param {Exhibit.Lens} opts.lensTemplate
 * @returns {Exhibit.Lens}
 */
Exhibit.LensRegistry.prototype.createNormalLens = function(itemID, div, uiContext, opts) {
    opts = opts || {};
    opts.lensTemplate = this.getNormalLens(itemID, uiContext);
    return this.createLens(itemID, div, uiContext, opts);
};
/**
 * @fileOverview Lens class
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 */
Exhibit.Lens = function() {
};

Exhibit.Lens._commonProperties = null;

/**
 * @param {String} itemID
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Lens.prototype._constructDefaultUI = function(itemID, div, uiContext) {
    var database, properties, label, template, dom, pairs, j, pair, tr, tdValues, m;

    database = uiContext.getDatabase();
    
    if (typeof Exhibit.Lens._commonProperties === "undefined" || Exhibit.Lens._commonProperties === null) {
        Exhibit.Lens._commonProperties = database.getAllProperties();
    }
    properties = Exhibit.Lens._commonProperties;
    
    label = database.getObject(itemID, "label");
    label = (typeof label !== "undefined" && label !== null) ? label : itemID;
    
    if (Exhibit.params.safe) {
        label = Exhibit.Formatter.encodeAngleBrackets(label);
    }
    
    template = {
        elmt:       div,
        className:  "exhibit-lens",
        children: [
            {   tag:        "div",
                className:  "exhibit-lens-title",
                title:      label,
                children:   [ 
                    label + " (",
                    {   tag:        "a",
                        href:       Exhibit.Persistence.getItemLink(itemID),
                        target:     "_blank",
                        children:   [ Exhibit._("%general.itemLinkLabel") ]
                    },
                    ")"
                ]
            },
            {   tag:        "div",
                className:  "exhibit-lens-body",
                children: [
                    {   tag:        "table",
                        className:  "exhibit-lens-properties",
                        field:      "propertiesTable"
                    }
                ]
            }
        ]
    };
    dom = Exhibit.jQuery.simileDOM("template", template);
    
    Exhibit.jQuery(div).attr(Exhibit.makeExhibitAttribute("itemID"), itemID);
    
    pairs = Exhibit.ViewPanel.getPropertyValuesPairs(
        itemID, properties, database);
        
    for (j = 0; j < pairs.length; j++) {
        pair = pairs[j];

        tr = Exhibit.jQuery("<tr>")
            .appendTo(dom.propertiesTable);
        tr = Exhibit.jQuery(dom.propertiesTable.get(0).insertRow(j))
            .attr("class", "exhibit-lens-property");
        
        Exhibit.jQuery("<td>")
            .appendTo(tr)
            .attr("class", "exhibit-lens-property-name")
            .html(pair.propertyLabel + ": ");
        
        tdValues = Exhibit.jQuery("<td>");
        tr.append(tdValues);
        Exhibit.jQuery(tdValues).attr("class", "exhibit-lens-property-values");
        
        if (pair.valueType === "item") {
            for (m = 0; m < pair.values.length; m++) {
                if (m > 0) {
                    Exhibit.jQuery(tdValues).append(document.createTextNode(", "));
                }
                Exhibit.jQuery(tdValues).append(Exhibit.UI.makeItemSpan(pair.values[m], null, uiContext));
            }
        } else {
            for (m = 0; m < pair.values.length; m++) {
                if (m > 0) {
                    Exhibit.jQuery(tdValues).append(document.createTextNode(", "));
                }
                Exhibit.jQuery(tdValues).append(Exhibit.UI.makeValueSpan(pair.values[m], pair.valueType));
            }
        }
    }
};

/**
 * @param {String} itemID
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Lens.prototype._constructDefaultEditingUI = function(itemID, div, uiContext) {
    // TODO
};

Exhibit.Lens._compiledTemplates = {};
/**
 * @constant
 */
Exhibit.Lens._handlers = [
    "onblur", "onfocus", 
    "onkeydown", "onkeypress", "onkeyup", 
    "onmousedown", "onmouseenter", "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onclick",
    "onresize", "onscroll"
];

/**
 * @param {String} itemID
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @param {String} lensTemplateURL
 */
Exhibit.Lens.prototype._constructFromLensTemplateURL = function(itemID, div, uiContext, lensTemplateURL) {
    var job, compiledTemplate;
    
    job = {
        lens:           this,
        itemID:         itemID,
        div:            div,
        uiContext:      uiContext,
        opts:           opts
    };
    
    compiledTemplate = Exhibit.Lens._compiledTemplates[lensTemplateURL];
    if (typeof compiledTemplate === "undefined" || compiledTemplate === null) {
        Exhibit.Lens._startCompilingTemplate(lensTemplateURL, job);
    } else if (!compiledTemplate.compiled) {
        compiledTemplate.jobs.push(job);
    } else {
        job.template = compiledTemplate;
        Exhibit.Lens._performConstructFromLensTemplateJob(job);
    }
};

/**
 * @param {String} itemID
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @param {Element} lensTemplateNode
 * @param {Object} opts
 */
Exhibit.Lens.prototype._constructFromLensTemplateDOM = function(itemID, div, uiContext, lensTemplateNode, opts) {
    var job, id, compiledTemplate;

    job = {
        lens:           this,
        itemID:         itemID,
        div:            div,
        uiContext:      uiContext,
        opts:           opts
    };
    
    id = lensTemplateNode.id;
    if (typeof id === "undefined" || id === null || id.length === 0) {
        id = "exhibitLensTemplate" + Math.floor(Math.random() * 10000);
        lensTemplateNode.id = id;
    }
    
    compiledTemplate = Exhibit.Lens._compiledTemplates[id];
    if (typeof compiledTemplate === "undefined" || compiledTemplate === null) {
        compiledTemplate = {
            url:        id,
            template:   Exhibit.Lens.compileTemplate(lensTemplateNode, false, uiContext),
            compiled:   true,
            jobs:       []
        };
        Exhibit.Lens._compiledTemplates[id] = compiledTemplate;
    }
    job.template = compiledTemplate;
    Exhibit.Lens._performConstructFromLensTemplateJob(job);
};

/**
 * @param {String} lensTemplateURL
 * @param {Object} job
 */
Exhibit.Lens._startCompilingTemplate = function(lensTemplateURL, job) {
    var compiledTemplate, fError, fDone;
    compiledTemplate = {
        url:        lensTemplateURL,
        template:   null,
        compiled:   false,
        jobs:       [ job ]
    };
    Exhibit.Lens._compiledTemplates[lensTemplateURL] = compiledTemplate;
    
    fError = function(jqxhr, textStatus, e) {
        Exhibit.Debug.log(Exhibit._("%lens.error.failedToLoad", lensTemplateURL, textStatus));
    };
    fDone = function(data, textStatus, jqxhr) {
        var i, job2;
        try {
            compiledTemplate.template = Exhibit.Lens.compileTemplate(
                data.documentElement, true, job.uiContext);
                
            compiledTemplate.compiled = true;
            
            for (i = 0; i < compiledTemplate.jobs.length; i++) {
                try {
                    job2 = compiledTemplate.jobs[i];
                    job2.template = compiledTemplate;
                    Exhibit.Lens._performConstructFromLensTemplateJob(job2);
                } catch (e1) {
                    Exhibit.Debug.exception(e1, Exhibit._("%lens.error.constructing"));
                }
            }
            compiledTemplate.jobs = null;
        } catch (e2) {
            Exhibit.Debug.exception(e2, Exhibit._("%lens.error.compilingTemplate"));
        }
    };
    
    Exhibit.jQuery.ajax({
        "dataType": "xml",
        "url": lensTemplateURL,
        "error": fError,
        "success": fDone
    });

    return compiledTemplate;
};

/**
 * @param {Element} rootNode
 * @param {Boolean} isXML
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Lens.compileTemplate = function(rootNode, isXML, uiContext) {
    return Exhibit.Lens._processTemplateNode(rootNode, isXML, uiContext);
};

/**
 * @param {Element} rootNode
 * @param {Boolean} isXML
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Lens._processTemplateNode = function(node, isXML, uiContext) {
    if (node.nodeType === 1) {
        return Exhibit.Lens._processTemplateElement(node, isXML, uiContext);
    } else {
        return node.nodeValue;
    }
};

/**
 * @param {Element} elmt
 * @param {Boolean} isXML
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Lens._processTemplateElement = function(elmt, isXML, uiContext) {
    var templateNode, settings, attributes, i, attribute, name, value, style, handlers, h, handler, code, childNode;

    templateNode = {
        tag:                    elmt.tagName.toLowerCase(),
        uiContext:              uiContext,
        control:                null,
        condition:              null,
        content:                null,
        contentAttributes:      null,
        subcontentAttributes:   null,
        attributes:             [],
        styles:                 [],
        handlers:               [],
        children:               null
    };
    
    settings = {
        parseChildTextNodes: true
    };
    
    // Oddly enough, there is no jQuery substitute for this
    attributes = elmt.attributes;
    for (i = 0; i < attributes.length; i++) {    
        attribute = attributes[i];
        name = attribute.nodeName;
        value = attribute.nodeValue;
        Exhibit.Lens._processTemplateAttribute(uiContext, templateNode, settings, name, value);
    }
    
    if (!isXML && jQuery.support.noCloneEvent) {
        /*
         *  Some browsers swallow style and event handler attributes of
         *  HTML elements.  So our loop above will not catch them.
         */
         
        style = elmt.cssText;
        if (typeof style !== "undefined" && style !== null && style.length > 0) {
            Exhibit.Lens._processStyle(templateNode, value);
        }
        
        handlers = Exhibit.Lens._handlers;
        for (h = 0; h < handlers.length; h++) {
            handler = handlers[h];
            code = elmt[handler];
            if (typeof code !== "undefined" && code !== null) {
                templateNode.handlers.push({ name: handler, code: code });
            }
        }
    }
    
    childNode = elmt.firstChild;
    if (typeof childNode !== "undefined" && childNode !== null) {
        templateNode.children = [];
        while (childNode !== null) {
            if ((settings.parseChildTextNodes && childNode.nodeType === 3) || childNode.nodeType === 1) {
                templateNode.children.push(Exhibit.Lens._processTemplateNode(childNode, isXML, templateNode.uiContext));
            }
            childNode = childNode.nextSibling;
        }
    }
    return templateNode;
};

/**
 * @param {Exhibit.UIContext} uiContext
 * @param {Element} rootNode
 * @param {Object} settings
 * @param {String} name
 * @param {String} value
 */
Exhibit.Lens._processTemplateAttribute = function(uiContext, templateNode, settings, name, value) {
    var isStyle, x;

    if (typeof value === "undefined" || value === null || typeof value !== "string" || value.length === 0 || name === "contentEditable") {
        return;
    }
    if (Exhibit.isExhibitAttribute(name)) {
        name = Exhibit.extractAttributeName(name);
        if (name === "formats") {
            templateNode.uiContext = Exhibit.UIContext._createWithParent(uiContext);
            
            Exhibit.FormatParser.parseSeveral(templateNode.uiContext, value, 0, {});
        } else if (name === "onshow") {
            templateNode.attributes.push({
                name:   name,
                value:  value
            });
        } else if (name === "control") {
            templateNode.control = value;
        } else if (name === "content") {
            templateNode.content = Exhibit.ExpressionParser.parse(value);
            templateNode.attributes.push({
                name:   Exhibit.makeExhibitAttribute("content"),
                value:  value
            });
        } else if (name === "editor") {
            templateNode.attributes.push({
                name:   Exhibit.makeExhibitAttribute("editor"),
                value:  value
            });
        } else if (name === "edit") {
            templateNode.edit = value;
        } else if (name === "options") {
            templateNode.options = value;
        } else if (name === "editvalues") {
            templateNode.editValues = value;
        } else if (name === "tag") {
            /*
                This is a hack for 2 cases:
                1.  See http://simile.mit.edu/mail/ReadMsg?listName=General&msgId=22328
                2.  IE7 throws a "Not enough storage is available to complete this operation" 
                    exception if we try to access elmt.attributes on <embed> elements
            */
            templateNode.tag = value;
        } else if (name === "if-exists") {
            templateNode.condition = {
                test:       "if-exists",
                expression: Exhibit.ExpressionParser.parse(value)
            };
        } else if (name === "if") {
            templateNode.condition = {
                test:       "if",
                expression: Exhibit.ExpressionParser.parse(value)
            };
            settings.parseChildTextNodes = false;
        } else if (name === "select") {
            templateNode.condition = {
                test:       "select",
                expression: Exhibit.ExpressionParser.parse(value)
            };
        } else if (name === "case") {
            templateNode.condition = {
                test:   "case",
                value:  value
            };
            settings.parseChildTextNodes = false;
        } else {
            isStyle = false;
            x = name.indexOf("-style-content");
            if (x > 0) {
                isStyle = true;
            } else {
                x = name.indexOf("-content");
            }
            
            if (x > 0) {
                if (typeof templateNode.contentAttributes === "undefined" || templateNode.contentAttributes === null) {
                    templateNode.contentAttributes = [];
                }
                templateNode.contentAttributes.push({
                    name:       name.substr(0, x),
                    expression: Exhibit.ExpressionParser.parse(value),
                    isStyle:    isStyle
                });
            } else {
                x = name.indexOf("-style-subcontent");
                if (x > 0) {
                    isStyle = true;
                } else {
                    x = name.indexOf("-subcontent");
                }
                
                if (x > 0) {
                    if (typeof templateNode.subcontentAttributes === "undefined" || templateNode.subcontentAttributes === null) {
                        templateNode.subcontentAttributes = [];
                    }
                    templateNode.subcontentAttributes.push({
                        name:       name.substr(0, x),
                        fragments:  Exhibit.Lens._parseSubcontentAttribute(value),
                        isStyle:    isStyle
                    });
                }
            }
        }
    } else {
        if (name === "style") {
            Exhibit.Lens._processStyle(templateNode, value);
        } else if (name !== "id") {
            // Modifications to attribute names for odd casing are
            // removed, jQuery should be able to deal with it.
            // Leaving bgcolor, jQuery does not handle it - it
            // should really be a CSS style, but leaving it here
            // since CSS overrides the bgcolor attribute, and it's
            // not clear what should happen if bgcolor were moved
            // to CSS and conflicted with an existing style / not
            // worth the extra code.
            if (name === "bgcolor") {
                name = "bgColor";
            }
            
            templateNode.attributes.push({
                name:   name,
                value:  value
            });
        }
    }
};

/**
 * @param {Object} templateNode
 * @param {String} styleValue
 */
Exhibit.Lens._processStyle = function(templateNode, styleValue) {
    var styles, s, pair, n, v;
    styles = styleValue.split(";");
    for (s = 0; s < styles.length; s++) {
        pair = styles[s].split(":");
        if (pair.length > 1) {
            n = pair[0].trim();
            v = pair[1].trim();
            // Methods of dealing with cross browser style handling used
            // to live here but should be made obsolte by jQuery.
            templateNode.styles.push({ name: n, value: v });
        }
    }
};

/**
 * @param {String} value
 * @returns {Array}
 */
Exhibit.Lens._parseSubcontentAttribute = function(value) {
    var fragments, current, open, close;
    fragments = [];
    current = 0;
    while (current < value.length && (open = value.indexOf("{{", current)) >= 0) {
        close = value.indexOf("}}", open);
        if (close < 0) {
            break;
        }
        
        fragments.push(value.substring(current, open));
        fragments.push(Exhibit.ExpressionParser.parse(value.substring(open + 2, close)));
        
        current = close + 2;
    }
    if (current < value.length) {
        fragments.push(value.substr(current));
    }
    return fragments;
};

/**
 * @param {String} itemID
 * @param {Object} templateNode
 * @param {Element} parentElement
 * @param {Exhibit.UIContext} uiContext
 * @param {Object} opts
 */
Exhibit.Lens.constructFromLensTemplate = function(itemID, templateNode, parentElmt, uiContext, opts) {
    return Exhibit.Lens._performConstructFromLensTemplateJob({
        itemID:     itemID,
        template:   { template: templateNode },
        div:        parentElmt,
        uiContext:  uiContext,
        opts:       opts
    });
};

/**
 * @param {Object} job
 * @returns {Element}
 */
Exhibit.Lens._performConstructFromLensTemplateJob = function(job) {
    var node, onshow;

    Exhibit.Lens._constructFromLensTemplateNode(
        {   "value" :   job.itemID
        },
        {   "value" :   "item"
        },
        job.template.template, 
        job.div,
        job.opts
    );

    node = Exhibit.jQuery(job.div).get(0).tagName.toLowerCase() === "table" ? Exhibit.jQuery(job.div).get(0).rows[Exhibit.jQuery(job.div).get(0).rows.length - 1] : Exhibit.jQuery(job.div).get(0).lastChild;
    Exhibit.jQuery(document).trigger("onItemShow.exhibit", [job.itemID, node]);
    Exhibit.jQuery(node).show();
    node.setAttribute(Exhibit.makeExhibitAttribute("itemID"), job.itemID);
    
    if (!Exhibit.params.safe) {
        onshow = Exhibit.getAttribute(node, "onshow");
        if (typeof onshow !== "undefined" && onshow !== null && onshow.length > 0) {
            try {
                (new Function(onshow)).call(node);
            } catch (e) {
                Exhibit.Debug.log(e);
            }
        }
    }
    
    //Exhibit.ToolboxWidget.createFromDOM(job.div, job.div, job.uiContext);
    return node;
};

/**
 * @param {Object} roots
 * @param {Object} rootValueTypes
 * @param {Object} templateNode
 * @param {Element} parentElmt
 * @param {Object} opts
 */
Exhibit.Lens._constructFromLensTemplateNode = function(
    roots, rootValueTypes, templateNode, parentElmt, opts
) {    
    var uiContext, database, children, i, values, lastChildTemplateNode, c, childTemplateNode, elmt, contentAttributes, attribute, value, subcontentAttributes, fragments, results, r, fragment, handlers, h, handler, itemID, a, rootValueTypes2, index, processOneValue, makeAppender;

    if (typeof templateNode === "string") {
        Exhibit.jQuery(parentElmt).append(document.createTextNode(templateNode));
        return;
    }
    uiContext = templateNode.uiContext;
    database = uiContext.getDatabase();
    children = templateNode.children;
    
    function processChildren() {
        if (typeof children !== "undefined" && children !== null) {
            for (i = 0; i < children.length; i++) {
                Exhibit.Lens._constructFromLensTemplateNode(roots, rootValueTypes, children[i], elmt, opts);
            }
        }
    }
    
    if (typeof templateNode.condition !== "undefined" &&
        templateNode.condition !== null) {
        if (templateNode.condition.test === "if-exists") {
            if (!templateNode.condition.expression.testExists(
                    roots,
                    rootValueTypes,
                    "value",
                    database
                )) {
                return;
            }
        } else if (templateNode.condition.test === "if") {
            if (templateNode.condition.expression.evaluate(
                    roots,
                    rootValueTypes,
                    "value",
                    database
                ).values.contains(true)) {
                
                if (typeof children !== "undefined" && children !== null && children.length > 0) {
                    Exhibit.Lens._constructFromLensTemplateNode(
                        roots, rootValueTypes, children[0], parentElmt, opts);
                }
            } else {
                if (typeof children !== "undefined" && children !== null && children.length > 1) {
                    Exhibit.Lens._constructFromLensTemplateNode(
                        roots, rootValueTypes, children[1], parentElmt, opts);
                }
            }
            return;
        } else if (templateNode.condition.test === "select") {
            values = templateNode.condition.expression.evaluate(
                roots,
                rootValueTypes,
                "value",
                database
            ).values;
            
            if (typeof children !== "undefined" && children !== null) {
                lastChildTemplateNode = null;
                for (c = 0; c < children.length; c++) {
                    childTemplateNode = children[c];
                    if (typeof childTemplateNode.condition !== "undefined" &&
                        childTemplateNode.condition !== null && 
                        childTemplateNode.condition.test === "case") {
                        
                        if (values.contains(childTemplateNode.condition.value)) {
                            Exhibit.Lens._constructFromLensTemplateNode(
                                roots, rootValueTypes, childTemplateNode, parentElmt, opts);
                                
                            return;
                        }
                    } else if (typeof childTemplateNode !== "string") {
                        lastChildTemplateNode = childTemplateNode;
                    }
                }
            }
            
            if (typeof lastChildTemplateNode !== "undefined" &&
                lastChildTemplateNode !== null) {
                Exhibit.Lens._constructFromLensTemplateNode(
                    roots, rootValueTypes, lastChildTemplateNode, parentElmt, opts);
            }
            return;
        }
    }
    
    elmt = Exhibit.Lens._constructElmtWithAttributes(templateNode, parentElmt, database);
    if (typeof templateNode.contentAttributes !== "undefined" &&
        templateNode.contentAttributes !== null) {
        contentAttributes = templateNode.contentAttributes;
        makeAppender = function(vs) {
            return function(v) {
                vs.push(v);
            };
        };
        for (i = 0; i < contentAttributes.length; i++) {
            attribute = contentAttributes[i];
            values = [];
            
            attribute.expression.evaluate(
                roots,
                rootValueTypes,
                "value",
                database
            ).values.visit(makeAppender(values));
            
            value = values.join(";");
            if (attribute.isStyle) {
                Exhibit.jQuery(elmt).css(attribute.name, value);
            } else if (Exhibit.Lens._attributeValueIsSafe(attribute.name, value)) {
                Exhibit.jQuery(elmt).attr(attribute.name, value);
            }
        }
    }
    if (typeof templateNode.subcontentAttributes !== "undefined" &&
        templateNode.subcontentAttributes !== null) {
        subcontentAttributes = templateNode.subcontentAttributes;
        for (i = 0; i < subcontentAttributes.length; i++) {
            attribute = subcontentAttributes[i];
            fragments = attribute.fragments;
            results = "";
            for (r = 0; r < fragments.length; r++) {
                fragment = fragments[r];
                if (typeof fragment === "string") {
                    results += fragment;
                } else {
                    results += fragment.evaluateSingle(
                        roots,
                        rootValueTypes,
                        "value",
                        database
                    ).value;
                }
            }
            
            if (attribute.isStyle) {
                Exhibit.jQuery(elmt).css(attribute.name, results);
            } else if (Exhibit.Lens._attributeValueIsSafe(attribute.name, results)) {
                Exhibit.jQuery(elmt).attr(attribute.name, results);
            }
        }
    }
    
    if (!Exhibit.params.safe) {
        handlers = templateNode.handlers;
        for (h = 0; h < handlers.length; h++) {
            handler = handlers[h];
            elmt[handler.name] = handler.code;
        }
    }
    itemID = roots["value"];
    if (typeof templateNode.control !== "undefined" &&
        templateNode.control !== null) {
        switch (templateNode.control) {

        case "item-link":
            a = Exhibit.jQuery("<a>")
                .html(Exhibit._("%general.itemLinkLabel"))
                .attr("href", Exhibit.Persistence.getItemLink(itemID))
                .attr("target", "_blank");
            Exhibit.jQuery(elmt).append(a);
            break;
            
        case "remove-item":
            // only new items can be deleted from an exhibit
            if (!opts.disableEditWidgets && database.isNewItem(itemID)) {
                if (templateNode.tag === 'a') {
                    Exhibit.jQuery(elmt).attr("href", "#");
                }
                Exhibit.jQuery(elmt).bind("click", function(evt) {
                    database.removeItem(itemID);
                });
                processChildren();                
            } else {
                Exhibit.jQuery(elmt).remove();
            }
            break;
            
        case "start-editing":
            if (templateNode.tag === 'a') {
                Exhibit.jQuery(elmt).attr("href", '#');
            }
            
            if (opts.disableEditWidgets) {
                Exhibit.jQuery(elmt).remove();
            } else if (opts.inPopup) {
                Exhibit.jQuery(elmt).bind("click", function(evt) {
                    Exhibit.UI.showItemInPopup(itemID, null, uiContext, {
                        lensType: 'edit',
                        coords: opts.coords
                    });                
                });
                processChildren();
            } else {
                Exhibit.jQuery(elmt).bind("click", function() {
                    uiContext.setEditMode(itemID, true);
                    Exhibit.jQuery(uiContext.getCollection().getElement()).trigger("onItemsChanged");
                });
                processChildren();
            }
            break;
            
        case "stop-editing":
            if (templateNode.tag === 'a') {
                Exhibit.jQuery(elmt).attr("href", '#');
            }
            if (opts.disableEditWidgets) {
                Exhibit.jQuery(elmt).remove();
            } else if (opts.inPopup) {
                Exhibit.jQuery(elmt).bind("click", function() {
                    Exhibit.UI.showItemInPopup(itemID, null, uiContext, {
                        lensType: 'normal',
                        coords: opts.coords
                    });
                });
                processChildren();
            } else {
                Exhibit.jQuery(elmt).bind("click", function() { 
                    uiContext.setEditMode(itemID, false);
                    Exhibit.jQuery(uiContext.getCollection().getElement()).trigger("onItemsChanged", []);
                });
                processChildren();
            }
            break;
            
        case "accept-changes":
            if (database.isSubmission(itemID)) {
                if (templateNode.tag === 'a') {
                    Exhibit.jQuery(elmt).attr("href", '#');
                }
                Exhibit.jQuery(elmt).bind("click", function() {
                    database.mergeSubmissionIntoItem(itemID);
                });
                processChildren();
            } else {
                Exhibit.Debug.warn(Exhibit._("%lens.error.misplacedAcceptChanges"));
                Exhibit.jQuery(elmt).remove();
            }
            break;
        }
    } else if (typeof templateNode.content !== "undefined" &&
               templateNode.content !== null) {
        results = templateNode.content.evaluate(
            roots,
            rootValueTypes,
            "value",
            database
        );
        if (typeof children !== "undefined" && children !== null) {
            rootValueTypes2 = { "value" : results.valueType, "index" : "number" };
            index = 1;
            
            processOneValue = function(childValue) {
                var roots2 = { "value" : childValue, "index" : index++ };
                for (i = 0; i < children.length; i++) {
                    Exhibit.Lens._constructFromLensTemplateNode(
                        roots2, rootValueTypes2, children[i], elmt, opts);
                }
            };
            if (results.values instanceof Array) {
                for (i = 0; i < results.values.length; i++) {
                    processOneValue(results.values[i]);
                }
            } else {
                results.values.visit(processOneValue);
            }
        } else {
            Exhibit.Lens._constructDefaultValueList(results.values, results.valueType, elmt, templateNode.uiContext);
        }
    } else if (typeof templateNode.edit !== "undefined" &&
               templateNode.edit !== null) {
        // TODO: handle editType

        // process children first, to get access to OPTION children of SELECT elements
        processChildren();
        Exhibit.Lens._constructEditableContent(templateNode, elmt, itemID, uiContext);
    } else if (typeof children !== "undefined" && children !== null) {
        for (i = 0; i < children.length; i++) {
            Exhibit.Lens._constructFromLensTemplateNode(roots, rootValueTypes, children[i], elmt, opts);
        }
    }
};

/**
 * @param {Object} templateNode
 * @param {Element} parentElmt
 * @param {Exhibit.Database} database
 * @returns {jQuery}
 */
Exhibit.Lens._constructElmtWithAttributes = function(templateNode, parentElmt, database) {
    var elmt, a, attributes, i, attribute, styles, style;
    if (templateNode.tag === "input") {
        // IE does not allow the type of an input element to be changed,
        // so jQuery also blocks it; there used to be a hack here for just
        // IE, but it might as well be universal given the IE problem
        // affected how jQuery does it.
        a = [ "<input" ];
        attributes = templateNode.attributes;
        for (i = 0; i < attributes.length; i++) {
            attribute = attributes[i];
            if (Exhibit.Lens._attributeValueIsSafe(attribute.name, attribute.value)) {
                a.push(attribute.name + "=\"" + attribute.value + "\"");
            }
        }
        a.push("></input>");
        
        elmt = Exhibit.jQuery(a.join(" "));
        Exhibit.jQuery(parentElmt).append(elmt);
    } else {
        elmt = Exhibit.jQuery("<" + templateNode.tag + ">");
        Exhibit.jQuery(parentElmt).append(elmt);
        
        attributes = templateNode.attributes;
        for (i = 0; i < attributes.length; i++) {
            attribute = attributes[i];
            if (Exhibit.Lens._attributeValueIsSafe(attribute.name, attribute.value)) {
                try {
                    elmt.attr(attribute.name, attribute.value);
                } catch (e) {
                    // ignore; this happens on IE for attribute "type" on element "input"
                }
            }
        }
    }
    
    styles = templateNode.styles;
    for (i = 0; i < styles.length; i++) {
        style = styles[i];
        elmt.css(style.name, style.value);
    }
    return elmt;
};

/**
 * @param {Object} templateNode
 * @param {Element} parentElmt
 * @param {Exhibit.Database} database
 * @returns {jQuery}
 */
Exhibit.Lens._constructEditableContent = function(templateNode, elmt, itemID, uiContext) {
    var db, attr, itemValue, changeHandler;
    db = uiContext.getDatabase();
    attr = templateNode.edit.replace('.', '');
    
    itemValue = db.getObject(itemID, attr);
    changeHandler = function() {
        if (this.value && this.value !== itemValue) {
            db.editItem(itemID, attr, this.value);
        }
    };
    
    if (templateNode.tag === 'select') {
        Exhibit.Lens._constructEditableSelect(templateNode, elmt, itemID, uiContext, itemValue);
        Exhibit.jQuery(elmt).bind("blur", changeHandler);
    } else {
        Exhibit.jQuery(elmt).attr("value", itemValue);
        Exhibit.jQuery(elmt).bind("change", changeHandler);
    }
};

/**
 * @param {Object} select
 * @param {Array} select.options
 * @param {String} select.options.text
 * @param {String} select.options.value
 * @param {String} text
 * @returns {Boolean}
 */
Exhibit.Lens.doesSelectContain = function(select, text) {
    var i, opt;
    for (i in select.options) {
        if (select.options.hasOwnProperty(i)) {
            opt = select.options[i];
            if (opt.text === text || opt.value === text) {
                return true;
            }
        }
    }
    return false;
};

// helper function to handle special-case rules for editable select tags
/**
 * @param {Object} templateNode
 * @param {Element} elmt
 * @param {String} itemID
 * @param {Exhibit.UIContext} uiContext
 * @param {String} itemValue
 */
Exhibit.Lens._constructEditableSelect = function(templateNode, elmt, itemID, uiContext, itemValue) {
    var expr, allItems, results, sortedResults, i, optText, newOption;
    if (templateNode.options) {
        expr = Exhibit.ExpressionParser.parse(templateNode.options);
        allItems = uiContext.getDatabase().getAllItems();
        results = expr.evaluate({'value': allItems}, {value: 'item'}, 'value', uiContext.getDatabase());
        sortedResults = results.values.toArray().sort();
        
        for (i in sortedResults) {
            if (sortedResults.hasOwnProperty(i)) {
                optText = sortedResults[i];
                if (!Exhibit.Lens.doesSelectContain(elmt, optText)) {
                    newOption = new Option(sortedResults[i], sortedResults[i]);
                    elmt.add(newOption, null);
                }
            }
        }
    }
    
    if (!itemValue) {
        if (!Exhibit.Lens.doesSelectContain(elmt, '')) {
            newOption = new Option("", "", true);
            elmt.add(newOption, elmt.options[0]);
        }
    } else {
        for (i in elmt.options) {
            if (elmt.options.hasOwnProperty(i) && elmt.options[i].value === itemValue) {
                elmt.selectedIndex = i;
            }
        }   
    }
};

/**
 * @param {Exhibit.Set} values
 * @param {String} valueType
 * @param {Element} parentElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Lens._constructDefaultValueList = function(values, valueType, parentElmt, uiContext) {
    uiContext.formatList(values, values.size(), valueType, function(elmt) {
        Exhibit.jQuery(parentElmt).append(Exhibit.jQuery(elmt));
    });
};

/**
 * @param {String} name
 * @param {String} value
 * @returns {Boolean}
 */
Exhibit.Lens._attributeValueIsSafe = function(name, value) {
    if (Exhibit.params.safe) {
        if ((name === "href" && value.startsWith("javascript:")) ||
            (name.startsWith("on"))) {
            return false;
        }
    }
    return true;
};
/** 
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * 
 * 
 * @class
 * @constructor
 */
Exhibit.UIContext = function() {
    this._parent = null;
    
    this._exhibit = null;
    this._collection = null;
    this._lensRegistry = new Exhibit.LensRegistry();
    this._settings = {};
    
    this._formatters = {};
    this._listFormatter = null;
    
    this._editModeRegistry = {};
    
    this._popupFunc = null;
};

/**
 * @constant
 */
Exhibit.UIContext._settingSpecs = {
    "bubbleWidth": { "type": "int", "defaultValue": 400 },
    "bubbleHeight": { "type": "int", "defaultValue": 300 }
};

/**
 * @param {Object} configuration
 * @param {Exhibit} exhibit
 * @returns {Exhibit.UIContext}
 */
Exhibit.UIContext.createRootContext = function(configuration, exhibit) {
    var context, settings, n, formats;

    context = new Exhibit.UIContext();
    context._exhibit = exhibit;
    
    settings = Exhibit.UIContext.initialSettings;

    for (n in settings) {
        if (settings.hasOwnProperty(n)) {
            context._settings[n] = settings[n];
        }
    }
    
    formats = Exhibit.getAttribute(document.body, "formats");
    if (typeof formats !== "undefined" && formats !== null && formats.length > 0) {
        Exhibit.FormatParser.parseSeveral(context, formats, 0, {});
    }
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        document.body, Exhibit.UIContext._settingSpecs, context._settings);
        
    Exhibit.UIContext._configure(context, configuration);
    
    return context;
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} parentUIContext
 * @param {Boolean} ignoreLenses
 * @returns {Exhibit.UIContext}
 */
Exhibit.UIContext.create = function(configuration, parentUIContext, ignoreLenses) {
    var context = Exhibit.UIContext._createWithParent(parentUIContext);
    Exhibit.UIContext._configure(context, configuration, ignoreLenses);
    
    return context;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} parentUIContext
 * @param {Boolean} ignoreLenses
 * @returns {Exhibit.UIContext}
 */
Exhibit.UIContext.createFromDOM = function(configElmt, parentUIContext, ignoreLenses) {
    var context, id, formats;

    context = Exhibit.UIContext._createWithParent(parentUIContext);
    
    if (!(ignoreLenses)) {
        Exhibit.UIContext.registerLensesFromDOM(configElmt, context.getLensRegistry());
    }
    
    id = Exhibit.getAttribute(configElmt, "collectionID");
    if (typeof id !== "undefined" && id !== null && id.length > 0) {
        context._collection = context._exhibit.getCollection(id);
    }
    
    formats = Exhibit.getAttribute(configElmt, "formats");
    if (typeof formats !== "undefined" && formats !== null && formats.length > 0) {
        Exhibit.FormatParser.parseSeveral(context, formats, 0, {});
    }
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt, Exhibit.UIContext._settingSpecs, context._settings);
        
    Exhibit.UIContext._configure(context, Exhibit.getConfigurationFromDOM(configElmt), ignoreLenses);
    
    return context;
};

/**
 *
 */
Exhibit.UIContext.prototype.dispose = function() {
};

/**
 * @returns {Exhibit.UIContext}
 */
Exhibit.UIContext.prototype.getParentUIContext = function() {
    return this._parent;
};

/**
 * @returns {Exhibit}
 */
Exhibit.UIContext.prototype.getMain = function() {
    return this._exhibit;
};

/**
 * @returns {Exhibit.Database}
 */
Exhibit.UIContext.prototype.getDatabase = function() {
    return this.getMain().getDatabase();
};

/**
 * @returns {Exhibit.Collection}
 */
Exhibit.UIContext.prototype.getCollection = function() {
    if (this._collection === null) {
        if (this._parent !== null) {
            this._collection = this._parent.getCollection();
        } else {
            this._collection = this._exhibit.getDefaultCollection();
        }
    }
    return this._collection;
};

/**
 * @returns {Exhibit.LensRegistry}
 */
Exhibit.UIContext.prototype.getLensRegistry = function() {
    return this._lensRegistry;
};

/**
 * @param {String} name
 * @returns {String|Number|Boolean|Object}
 */
Exhibit.UIContext.prototype.getSetting = function(name) {
    return typeof this._settings[name] !== "undefined" ? 
        this._settings[name] : 
        (this._parent !== null ? this._parent.getSetting(name) : undefined);
};

/**
 * @param {String} name
 * @param {Boolean} defaultValue
 * @returns {Boolean}
 */
Exhibit.UIContext.prototype.getBooleanSetting = function(name, defaultValue) {
    var v = this.getSetting(name);
    return v === undefined || v === null ? defaultValue : v;
};

/**
 * @param {String} name 
 * @param {String|Number|Boolean|Object} value
 */
Exhibit.UIContext.prototype.putSetting = function(name, value) {
    this._settings[name] = value;
};

/**
 * @param {String|Number|Boolean|Object} value
 * @param {String} valueType
 * @param {Function} appender
 */
Exhibit.UIContext.prototype.format = function(value, valueType, appender) {
    var f;
    if (typeof this._formatters[valueType] !== "undefined") {
        f = this._formatters[valueType];
    } else {
        f = this._formatters[valueType] = 
            new Exhibit.Formatter._constructors[valueType](this);
    }
    f.format(value, appender);
};

/**
 * @param {Exhibit.Set} iterator
 * @param {Number} count
 * @param {String} valueType
 * @param {Function} appender
 */
Exhibit.UIContext.prototype.formatList = function(iterator, count, valueType, appender) {
    if (this._listFormatter === null) {
        this._listFormatter = new Exhibit.Formatter._ListFormatter(this);
    }
    this._listFormatter.formatList(iterator, count, valueType, appender);
};

/**
 * @param {String} itemID
 * @param {Boolean} val
 */
Exhibit.UIContext.prototype.setEditMode = function(itemID, val) {
    if (val) {
        this._editModeRegistry[itemID] = true;
    } else {
        this._editModeRegistry[itemID] = false;
    }
};

/**
 * @param {String} itemID
 * @returns {Boolean}
 */
Exhibit.UIContext.prototype.isBeingEdited = function(itemID) {
    return !!this._editModeRegistry[itemID];
};


/*----------------------------------------------------------------------
 *  Internal implementation
 *----------------------------------------------------------------------
 */

/**
 * @static
 * @private
 * @param {Exhibit.UIContext} parent
 * @returns {Exhibit.UIContext}
 */
Exhibit.UIContext._createWithParent = function(parent) {
    var context = new Exhibit.UIContext();
    
    context._parent = parent;
    context._exhibit = parent._exhibit;
    context._lensRegistry = new Exhibit.LensRegistry(parent.getLensRegistry());
    context._editModeRegistry = parent._editModeRegistry;
    
    return context;
};

/**
 * @private
 * @static
 * @param {Exhbit.UIContext} context
 * @param {Object} configuration
 * @param {Boolean} ignoreLenses
 */
Exhibit.UIContext._configure = function(context, configuration, ignoreLenses) {
    Exhibit.UIContext.registerLenses(configuration, context.getLensRegistry());
    
    if (typeof configuration["collectionID"] !== "undefined") {
        context._collection = context._exhibit.getCollection(configuration.collectionID);
    }
    
    if (typeof configuration["formats"] !== "undefined") {
        Exhibit.FormatParser.parseSeveral(context, configuration.formats, 0, {});
    }
    
    if (!(ignoreLenses)) {
        Exhibit.SettingsUtilities.collectSettings(
            configuration, Exhibit.UIContext._settingSpecs, context._settings);
    }
};

/*----------------------------------------------------------------------
 *  Lens utility functions for internal use
 *----------------------------------------------------------------------
 */

/**
 * @static
 * @param {Object} configuration
 * @param {Exhibit.LensRegistry} lensRegistry
 */
Exhibit.UIContext.registerLens = function(configuration, lensRegistry) {
    var template, i;
    template = configuration.templateFile;
    if (typeof template !== "undefined" && template !== null) {
        if (typeof configuration["itemTypes"] !== "undefined") {
            for (i = 0; i < configuration.itemTypes.length; i++) {
                lensRegistry.registerLensForType(template, configuration.itemTypes[i]);
            }
        } else {
            lensRegistry.registerDefaultLens(template);
        }
    }
};

/**
 * @param {Element} elmt
 * @param {Exhibit.LensRegistry} lensRegistry
 */
Exhibit.UIContext.registerLensFromDOM = function(elmt, lensRegistry) {
    var itemTypes, template, url, id, elmt2, i;

    Exhibit.jQuery(elmt).hide();
    
    itemTypes = Exhibit.getAttribute(elmt, "itemTypes", ",");
    template = null;
    
    url = Exhibit.getAttribute(elmt, "templateFile");
    if (typeof url !== "undefined" && url !== null && url.length > 0) {
        template = url;
    } else {
        id = Exhibit.getAttribute(elmt, "template");
        elmt2 = id && document.getElementById(id);
        if (typeof elmt2 !== "undefined" && elmt2 !== null) {
            template = elmt2;
        } else {
            template = elmt;
        }
    }
    
    if (typeof template !== "undefined" && template !== null) {
        if (typeof itemTypes === "undefined" || itemTypes === null || itemTypes.length === 0 || (itemTypes.length === 1 && itemTypes[0] === "")) {
            lensRegistry.registerDefaultLens(template);
        } else {
            for (i = 0; i < itemTypes.length; i++) {
                lensRegistry.registerLensForType(template, itemTypes[i]);
            }
        }
    }
};

/**
 * @param {Object} configuration
 * @param {Exhibit.LensRegistry} lensRegistry
 */
Exhibit.UIContext.registerLenses = function(configuration, lensRegistry) {
    var i, lensSelector;
    if (typeof configuration["lenses"] !== "undefined") {
        for (i = 0; i < configuration.lenses.length; i++) {
            Exhibit.UIContext.registerLens(configuration.lenses[i], lensRegistry);
        }
    }
    if (typeof configuration["lensSelector"] !== "undefined") {
        lensSelector = configuration.lensSelector;
        if (typeof lensSelector === "function") {
            lensRegistry.addLensSelector(lensSelector);
        } else {
            Exhibit.Debug.log(Exhibit._("%general.error.lensSelectorNotFunction"));
        }
    }
};

/**
 * @param {Element} parentNode
 * @param {Exhibit.LensRegistry} lensRegistry
 */
Exhibit.UIContext.registerLensesFromDOM = function(parentNode, lensRegistry) {
    var node, role, lensSelectorString, lensSelector;

    node = Exhibit.jQuery(parentNode).children().get(0);
    while (typeof node !== "undefined" && node !== null) {
        if (node.nodeType === 1) {
            role = Exhibit.getRoleAttribute(node);
            if (role === "lens" || role === "edit-lens") {
                Exhibit.UIContext.registerLensFromDOM(node, lensRegistry);
            }
        }
        node = node.nextSibling;
    }
    
    lensSelectorString = Exhibit.getAttribute(parentNode, "lensSelector");
    if (typeof lensSelectorString !== "undefined" && lensSelectorString !== null && lensSelectorString.length > 0) {
        try {
            lensSelector = eval(lensSelectorString);
            if (typeof lensSelector === "function") {
                lensRegistry.addLensSelector(lensSelector);
            } else {
                Exhibit.Debug.log(Exhibit._("%general.error.lensSelectorExpressionNotFunction", lensSelectorString));
            }
        } catch (e) {
            Exhibit.Debug.exception(e, Exhibit._("%general.error.badLensSelectorExpression", lensSelectorString));
        }
    }
};

/**
 * @param {Object} configuration
 * @param {Exhibit.LensRegistry} parentLensRegistry
 * @returns {Exhibit.LensRegistry}
 */
Exhibit.UIContext.createLensRegistry = function(configuration, parentLensRegistry) {
    var lensRegistry = new Exhibit.LensRegistry(parentLensRegistry);
    Exhibit.UIContext.registerLenses(configuration, lensRegistry);
    
    return lensRegistry;
};

/**
 * @param {Element} parentNode
 * @param {Object} configuration
 * @param {Exhibit.LensRegistry} parentLensRegistry
 * @returns {Exhibit.LensRegistry}
 */
Exhibit.UIContext.createLensRegistryFromDOM = function(parentNode, configuration, parentLensRegistry) {
    var lensRegistry = new Exhibit.LensRegistry(parentLensRegistry);
    Exhibit.UIContext.registerLensesFromDOM(parentNode, lensRegistry);
    Exhibit.UIContext.registerLenses(configuration, lensRegistry);
    
    return lensRegistry;
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @namespace
 */
Exhibit.UI = {
    /**
     * Map of components used for instantiating new UI objects.
     */
    componentMap: {},

    /**
     * Link to JSON validating service.
     */
    validator: (typeof Exhibit.babelPrefix !== "undefined") ?
        Exhibit.babelPrefix + "validator?url=" :
        Exhibit.validateJSON
};

/**
 * Augment with Exhibit.Registry?
 * @param {String} name
 * @param {String} comp
 */
Exhibit.UI.registerComponent = function(name, comp) {
    var msg = Exhibit._("%general.error.cannotRegister", name);
    if (typeof Exhibit.UI.componentMap[name] !== "undefined") {
        Exhibit.Debug.warn(Exhibit._("%general.error.componentNameTaken", msg));
    } else if (typeof comp === "undefined" || comp === null) {
        Exhibit.Debug.warn(Exhibit._("%general.error.noComponentObject", msg));
    } else if (typeof comp.create === "undefined") {
        Exhibit.Debug.warn(Exhibit._("%general.error.missingCreateFunction", msg));
    } else if (typeof comp.createFromDOM === "undefined") {
        Exhibit.Debug.warn(Exhibit._("%general.error.missingDOMCreateFunction", msg));
    } else {
        Exhibit.UI.componentMap[name] = comp;
    }
};

/**
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.UI.create = function(configuration, elmt, uiContext) {
    var role, createFunc;

    if (typeof configuration["role"] !== "undefined") {
        role = configuration.role;
        if (typeof role !== "undefined" && role !== null && role.startsWith("exhibit-")) {
            role = role.substr("exhibit-".length);
        }
        
        if (typeof Exhibit.UI.componentMap[role] !== "undefined") {
            createFunc = Exhibit.UI.componentMap[role].create;
            return createFunc(configuration, elmt, uiContext);
        }
        
        switch (role) {
        case "lens":
        case "edit-lens":
            Exhibit.UIContext.registerLens(configuration, uiContext.getLensRegistry());
            return null;
        case "view":
            return Exhibit.UI.createView(configuration, elmt, uiContext);
        case "facet":
            return Exhibit.UI.createFacet(configuration, elmt, uiContext);
        case "coordinator":
            return Exhibit.UI.createCoordinator(configuration, uiContext);
        case "coder":
            return Exhibit.UI.createCoder(configuration, uiContext);
        case "viewPanel":
            return Exhibit.ViewPanel.create(configuration, elmt, uiContext);
        case "logo":
            return Exhibit.Logo.create(configuration, elmt, uiContext);
        case "controlPanel":
            return Exhibit.ControlPanel.create(configuration, elmt, uiContext);
        case "hiddenContent":
            Exhibit.jQuery(elmt).hide();
            return null;
        }
    }
    return null;
};

/**
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * returns {Object}
 */
Exhibit.UI.createFromDOM = function(elmt, uiContext) {
    var role, createFromDOMFunc;

    role = Exhibit.getRoleAttribute(elmt);
    
    if (typeof Exhibit.UI.componentMap[role] !== "undefined") {
        createFromDOMFunc = Exhibit.UI.componentMap[role].createFromDOM;
        return createFromDOMFunc(elmt, uiContext);
    }
    
    switch (role) {
    case "lens":
    case "edit-lens":
        Exhibit.UIContext.registerLensFromDOM(elmt, uiContext.getLensRegistry());
        return null;
    case "view":
        return Exhibit.UI.createViewFromDOM(elmt, null, uiContext);
    case "facet":
        return Exhibit.UI.createFacetFromDOM(elmt, null, uiContext);
    case "coordinator":
        return Exhibit.UI.createCoordinatorFromDOM(elmt, uiContext);
    case "coder":
        return Exhibit.UI.createCoderFromDOM(elmt, uiContext);
    case "viewPanel":
        return Exhibit.ViewPanel.createFromDOM(elmt, uiContext);
    case "controlPanel":
        return Exhibit.ControlPanel.createFromDOM(elmt, null, uiContext);
    case "logo":
        return Exhibit.Logo.createFromDOM(elmt, uiContext);
    case "hiddenContent":
        Exhibit.jQuery(elmt).hide();
        return null;
    }
    return null;
};

/**
 * @param {Object} constructor
 * @returns {Object}
 */
Exhibit.UI.generateCreationMethods = function(constructor) {
    constructor.create = function(configuration, elmt, uiContext) {
        var newContext, settings;
        newContext = Exhibit.UIContext.create(configuration, uiContext);
        settings = {};
        
        Exhibit.SettingsUtilities.collectSettings(
            configuration, 
            constructor._settingSpecs || {}, 
            settings);
            
        return new constructor(elmt, newContext, settings);
    };
    constructor.createFromDOM = function(elmt, uiContext) {
        var newContext, settings;
        newContext = Exhibit.UIContext.createFromDOM(elmt, uiContext);
        settings = {};
        
        Exhibit.SettingsUtilities.collectSettingsFromDOM(
            elmt, 
            constructor._settingSpecs || {},
            settings);
        
        return new constructor(elmt, newContext, settings);
    };
};

/**
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.UI.createView = function(configuration, elmt, uiContext) {
    var viewClass = typeof configuration["viewClass"] !== "undefined" ?
        configuration.viewClass :
        Exhibit.TileView;
    if (typeof viewClass === "string") {
        viewClass = Exhibit.UI.viewClassNameToViewClass(viewClass);
    }
    return viewClass.create(configuration, elmt, uiContext);
};

/**
 * @param {Element} elmt
 * @param {Element} container
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.UI.createViewFromDOM = function(elmt, container, uiContext) {
    var viewClass = Exhibit.UI.viewClassNameToViewClass(Exhibit.getAttribute(elmt, "viewClass"));
    return viewClass.createFromDOM(elmt, container, uiContext);
};

/**
 * @param {String} name
 * @returns {Object}
 */
Exhibit.UI.viewClassNameToViewClass = function(name) {
    if (typeof name !== "undefined" && name !== null && name.length > 0) {
        try {
            return Exhibit.UI._stringToObject(name, "View");
        } catch (e) {
            Exhibit.Debug.warn(Exhibit._("%general.error.unknownViewClass", name));
        }
    }
    return Exhibit.TileView;
};

/**
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.UI.createFacet = function(configuration, elmt, uiContext) {
    var facetClass = typeof configuration["facetClass"] !== "undefined" ?
        configuration.facetClass :
        Exhibit.ListFacet;
    if (typeof facetClass === "string") {
        facetClass = Exhibit.UI.facetClassNameToFacetClass(facetClass);
    }
    return facetClass.create(configuration, elmt, uiContext);
};

/**
 * @param {Element} elmt
 * @param {Element} container
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.UI.createFacetFromDOM = function(elmt, container, uiContext) {
    var facetClass = Exhibit.UI.facetClassNameToFacetClass(Exhibit.getAttribute(elmt, "facetClass"));
    return facetClass.createFromDOM(elmt, container, uiContext);
};

/**
 * @param {String} name
 * @returns {Object}
 */
Exhibit.UI.facetClassNameToFacetClass = function(name) {
    if (typeof name !== "undefined" && name !== null && name.length > 0) {
        try {
            return Exhibit.UI._stringToObject(name, "Facet");
        } catch (e) {
            Exhibit.Debug.warn(Exhibit._("%general.error.unknownFacetClass", name));
        }
    }
    return Exhibit.ListFacet;
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.UI.createCoder = function(configuration, uiContext) {
    var coderClass = typeof configuration["coderClass"] !== "undefined" ?
        configuration.coderClass :
        Exhibit.ColorCoder;
    if (typeof coderClass === "string") {
        coderClass = Exhibit.UI.coderClassNameToCoderClass(coderClass);
    }
    return coderClass.create(configuration, uiContext);
};

/**
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Object}
 */
Exhibit.UI.createCoderFromDOM = function(elmt, uiContext) {
    var coderClass = Exhibit.UI.coderClassNameToCoderClass(Exhibit.getAttribute(elmt, "coderClass"));
    return coderClass.createFromDOM(elmt, uiContext);
};

/**
 * @param {String} name
 * @returns {Object}
 */
Exhibit.UI.coderClassNameToCoderClass = function(name) {
    if (typeof name !== "undefined" && name !== null && name.length > 0) {
        try {
            return Exhibit.UI._stringToObject(name, "Coder");
        } catch (e) {
            Exhibit.Debug.warn(Exhibit._("%general.error.unknownCoderClass", name));
        }
    }
    return Exhibit.ColorCoder;
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Coordinator}
 */
Exhibit.UI.createCoordinator = function(configuration, uiContext) {
    return Exhibit.Coordinator.create(configuration, uiContext);
};

/**
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.Coordinator}
 */
Exhibit.UI.createCoordinatorFromDOM = function(elmt, uiContext) {
    return Exhibit.Coordinator.createFromDOM(elmt, uiContext);
};

/**
 * @private
 * @param {String} name
 * @param {String} suffix
 * @returns {Object}
 * @throws {Error}
 */
Exhibit.UI._stringToObject = function(name, suffix) {
    if (!name.startsWith("Exhibit.")) {
        if (!name.endsWith(suffix)) {
            try {
                return eval("Exhibit." + name + suffix);
            } catch (ex1) {
                // ignore
            }
        }
        
        try {
            return eval("Exhibit." + name);
        } catch (ex2) {
            // ignore
        }
    }
    
    if (!name.endsWith(suffix)) {
        try {
            return eval(name + suffix);
        } catch (ex3) {
            // ignore
        }
    }
    
    try {
        return eval(name);
    } catch (ex4) {
        // ignore
    }
    
    throw new Error(Exhibit._("%general.error.unknownClass", name));
};

/*----------------------------------------------------------------------
 *  Help and Debugging
 *----------------------------------------------------------------------
 */

/**
 * @static
 * @param {String} message
 * @param {String} url
 * @param {String} target
 */
Exhibit.UI.showHelp = function(message, url, target) {
    target = (target) ? target : "_blank";
    if (typeof url !== "undefined" && url !== null) {
        if (window.confirm(Exhibit._("%general.showDocumentationMessage", message))) {
            window.open(url, target);
        }
    } else {
        window.alert(message);
    }
};

/**
 * @static
 * @param {String} message
 * @param {String} url
 */
Exhibit.UI.showJsonFileValidation = function(message, url) {
    var target = "_blank";
    if (typeof Exhibit.babelPrefix !== "undefined" && url.indexOf("file:") === 0) {
        if (window.confirm(Exhibit._("%general.showJsonValidationFormMessage", message))) {
            window.open(Exhibit.UI.validator, target);
        }
    } else {
        if (window.confirm(Exhibit._("%general.showJsonValidationMessage", message))) {
            window.open(Exhibit.UI.validator + url, target);
        }
    }
};

/*----------------------------------------------------------------------
 *  Status Indication and Feedback
 *----------------------------------------------------------------------
 */
Exhibit.UI._busyIndicator = null;
Exhibit.UI._busyIndicatorCount = 0;

/**
 * @static
 */
Exhibit.UI.showBusyIndicator = function() {
    var scrollTop, height, top;

    Exhibit.UI._busyIndicatorCount++;
    if (Exhibit.UI._busyIndicatorCount > 1) {
        return;
    }
    
    if (Exhibit.UI._busyIndicator === null) {
        Exhibit.UI._busyIndicator = Exhibit.UI.createBusyIndicator();
    }
    
    // @@@ jQuery simplification?
    scrollTop = typeof document.body["scrollTop"] !== "undefined" ?
        document.body.scrollTop :
        document.body.parentNode.scrollTop;
    height = typeof window["innerHeight"] !== "undefined" ?
        window.innerHeight :
        (typeof document.body["clientHeight"] !== "undefined" ?
            document.body.clientHeight :
            document.body.parentNode.clientHeight);
        
    top = Math.floor(scrollTop + height / 3);
    
    Exhibit.jQuery(Exhibit.UI._busyIndicator).css("top", top + "px");
    Exhibit.jQuery(document.body).append(Exhibit.UI._busyIndicator);
};

/**
 * @static
 */
Exhibit.UI.hideBusyIndicator = function() {
    Exhibit.UI._busyIndicatorCount--;
    if (Exhibit.UI._busyIndicatorCount > 0) {
        return;
    }
    
    try {
        Exhibit.UI._busyIndicator.remove();
    } catch(e) {
        // silent
    }
};

/*----------------------------------------------------------------------
 *  Common UI Generation
 *----------------------------------------------------------------------
 */

/**
 * @static
 * @param {Element|jQuery} elmt
 */
Exhibit.UI.protectUI = function(elmt) {
    Exhibit.jQuery(elmt).addClass("exhibit-ui-protection");
};

/**
 * @static
 * @param {String} text
 * @param {Function} handler
 * @returns {jQuery}
 */
Exhibit.UI.makeActionLink = function(text, handler) {
    var a, handler2;

    a = Exhibit.jQuery("<a>" + text + "</a>").
        attr("href", "#").
        addClass("exhibit-action");
    
    handler2 = function(evt) {
        if (typeof Exhibit.jQuery(this).attr("disabled") === "undefined") {
            evt.preventDefault();
            handler(evt);
        }
    };

    Exhibit.jQuery(a).bind("click", handler2);
    
    return a;
};

/**
 * @static
 * @param {Element} a
 * @param {Boolean} enabled
 */
Exhibit.UI.enableActionLink = function(a, enabled) {
    if (enabled) {
        Exhibit.jQuery(a).removeAttr("disabled");
        Exhibit.jQuery(a).addClass("exhibit-action").removeClass("exhibit-action-disabled");
    } else {
        Exhibit.jQuery(a).attr("disabled", true);
        Exhibit.jQuery(a).removeClass("exhibit-action").addClass("exhibit-action-disabled");
    }
};

/**
 * @static
 * @param {String} itemID
 * @param {String} label
 * @param {Exhibit.UIContext} uiContext
 * @returns {jQuery}
 */
Exhibit.UI.makeItemSpan = function(itemID, label, uiContext) {
    var database, a, handler;

    database = uiContext.getDatabase();

    if (typeof label === "undefined" || label === null) {
        label = database.getObject(itemID, "label");
        if (typeof label === "undefined" || label === null) {
            label = itemID;
        }
    }
    
    a = Exhibit.jQuery("<a>" + label + "</a>").
        attr("href", Exhibit.Persistence.getItemLink(itemID)).
        addClass("exhibit-item");
        
    handler = function(evt) {
        Exhibit.UI.showItemInPopup(itemID, this, uiContext);
        evt.preventDefault();
        evt.stopPropagation();
    };

    a.bind("click", handler);

    return a.get(0);
};

/**
 * @static
 * @param {String} label
 * @param {String} valueType
 * @returns {jQuery}
 */
Exhibit.UI.makeValueSpan = function(label, valueType) {
    var span, url;

    span = Exhibit.jQuery("<span>").addClass("exhibit-value")
;
    if (valueType === "url") {
        url = label;
        if (Exhibit.params.safe && url.trim().startsWith("javascript:")) {
            span.text(url);
        } else {
            span.html("<a href=\"" + url + "\" target=\"_blank\">" +
                      (label.length > 50 ? 
                       label.substr(0, 20) + " ... " + label.substr(label.length - 20) :
                       label) +
                      "</a>");
        }
    } else {
        if (Exhibit.params.safe) {
            label = Exhibit.Formatter.encodeAngleBrackets(label);
        }
        span.html(label);
    }
    return span.get(0);
};

/**
 * @static
 * @param {Element} elmt
 */
Exhibit.UI.calculatePopupPosition = function(elmt) {
    var coords = Exhibit.jQuery(elmt).offset();
    return {
        x: coords.left + Math.round(Exhibit.jQuery(elmt).outerWidth() / 2),
        y: coords.top + Math.round(Exhibit.jQuery(elmt).outerHeight() / 2)
    };
};

/**
 * @static
 * @param {String} itemID
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @param {Object} opts
 */
Exhibit.UI.showItemInPopup = function(itemID, elmt, uiContext, opts) {
    var itemLensDiv, lensOpts;

    Exhibit.jQuery(document).trigger("closeAllModeless.exhibit");

    opts = opts || {};
    opts.coords = opts.coords || Exhibit.UI.calculatePopupPosition(elmt);
    
    itemLensDiv = Exhibit.jQuery("<div>");

    lensOpts = {
        inPopup: true,
        coords: opts.coords
    };

    if (opts.lensType === "normal") {
        lensOpts.lensTemplate = uiContext.getLensRegistry().getNormalLens(itemID, uiContext);
    } else if (opts.lensType === "edit") {
        lensOpts.lensTemplate = uiContext.getLensRegistry().getEditLens(itemID, uiContext);
    } else if (opts.lensType) {
        Exhibit.Debug.warn(Exhibit._("%general.error.unknownLensType", opts.lensType));
    }

    uiContext.getLensRegistry().createLens(itemID, itemLensDiv, uiContext, lensOpts);
    
    Exhibit.jQuery.simileBubble("createBubbleForContentAndPoint",
        itemLensDiv, 
        opts.coords.x,
        opts.coords.y, 
        uiContext.getSetting("bubbleWidth")
    );
};

/**
 * @static
 * @param {String} name
 * @param {Function} handler
 * @param {String} className
 * @returns {Element}
 */
Exhibit.UI.createButton = function(name, handler, className) {
    var button = Exhibit.jQuery("<button>").
        html(name).
        addClass((className || "exhibit-button")).
        addClass("screen");
    button.bind("click", handler);
    return button;
};

/**
 * @static
 * @param {Element} element
 * @returns {Object}
 */
Exhibit.UI.createPopupMenuDom = function(element) {
    var div, dom;

    div = Exhibit.jQuery("<div>").
        addClass("exhibit-menu-popup").
        addClass("exhibit-ui-protection");
    
    /**
     * @ignore
     */
    dom = {
        elmt: div,
        open: function(evt) {
            var self, docWidth, docHeight, coords;
            self = this;
            // @@@ exhibit-dialog needs to be set
            if (typeof evt !== "undefined") {
                if (Exhibit.jQuery(evt.target).parent(".exhibit-dialog").length > 0) {
                    dom._dialogParent = Exhibit.jQuery(evt.target).parent(".exhibit-dialog:eq(0)").get(0);
                }
                evt.preventDefault();
            }
                
            docWidth = Exhibit.jQuery(document.body).width();
            docHeight = Exhibit.jQuery(document.body).height();
        
            coords = Exhibit.jQuery(element).offset();
            this.elmt.css("top", (coords.top + element.scrollHeight) + "px");
            this.elmt.css("right", (docWidth - (coords.left + element.scrollWidth)) + "px");

            Exhibit.jQuery(document.body).append(this.elmt);
            this.elmt.trigger("modelessOpened.exhibit");
            evt.stopPropagation();
        },
        appendMenuItem: function(label, icon, onClick) {
            var self, a, container;
            self = this;
            a = Exhibit.jQuery("<a>").
                attr("href", "#").
                addClass("exhibit-menu-item").
                bind("click", function(evt) {
                    onClick(evt); // elmt, evt, target:being passed a jqevent
                    dom.close();
                    evt.preventDefault();
                    evt.stopPropagation();
                });

            container = Exhibit.jQuery("<div>");
            a.append(container);
    
            container.append(Exhibit.jQuery.simileBubble("createTranslucentImage",
                (typeof icon !== "undefined" && icon !== null) ?
                    icon :
                    (Exhibit.urlPrefix + "images/blank-16x16.png")));
                
            container.append(document.createTextNode(label));
            
            this.elmt.append(a);
        },
        appendSeparator: function() {
            this.elmt.append("<hr/>");
        }
    };
    Exhibit.UI.setupDialog(dom, false);
    return dom;
};

/**
 * @static
 * @returns {Element}
 */
Exhibit.UI.createBusyIndicator = function() {
    var urlPrefix, containerDiv, topDiv, topRightDiv, middleDiv, middleRightDiv, contentDiv, bottomDiv, bottomRightDiv, img;
    urlPrefix = Exhibit.urlPrefix + "images/";
    containerDiv = Exhibit.jQuery("<div>");
    if (Exhibit.jQuery.simileBubble("pngIsTranslucent")) {
        topDiv = Exhibit.jQuery("<div>").css({
            "height": "33px",
            "padding-left": "44px",
            "background": "url(" + urlPrefix + "message-bubble/message-top-left.png) top left no-repeat"
        });
        containerDiv.append(topDiv);
        
        topRightDiv = Exhibit.jQuery("<div>").css({
            "height": "33px",
            "background": "url(" + urlPrefix + "message-bubble/message-top-right.png) top right no-repeat"
        });
        topDiv.append(topRightDiv);
        
        middleDiv = Exhibit.jQuery("<div>").css({
            "padding-left": "44px",
            "background": "url(" + urlPrefix + "message-bubble/message-left.png) top left repeat-y"
        });
        containerDiv.append(middleDiv);
        
        middleRightDiv = Exhibit.jQuery("<div>").css({
            "padding-right": "44px",
            "background": "url(" + urlPrefix + "message-bubble/message-right.png) top right repeat-y"
        });
        middleDiv.append(middleRightDiv);
        
        contentDiv = Exhibit.jQuery("<div>");
        middleRightDiv.append(contentDiv);
        
        bottomDiv = Exhibit.jQuery("<div>").css({
            "height": "55px",
            "padding-left": "44px",
            "background": "url(" + urlPrefix + "message-bubble/message-bottom-left.png) bottom left no-repeat"
        });
        containerDiv.append(bottomDiv);
        
        bottomRightDiv = Exhibit.jQuery("<div>").css({
            "height": "55px",
            "background": "url(" + urlPrefix + "message-bubble/message-bottom-right.png) bottom right no-repeat"
        });
        bottomDiv.append(bottomRightDiv);
    } else {
        containerDiv.css({
            "border": "2px solid #7777AA",
            "padding": "20px",
            "background": "white",
            "opacity": 0.9
        });
        
        contentDiv = Exhibit.jQuery("<div>");
        containerDiv.append(contentDiv);
    }

    containerDiv.addClass("exhibit-busyIndicator");
    contentDiv.addClass("exhibit-busyIndicator-content");
    
    img = Exhibit.jQuery("<img />").attr("src", urlPrefix + "progress-running.gif");
    contentDiv.append(img);
    contentDiv.append(document.createTextNode(Exhibit._("%general.busyIndicatorMessage")));
    
    return containerDiv;
};

/**
 * @static
 * @param {String} itemID
 * @param {Exhibit} exhibit
 * @param {Object} configuration
 * @returns {Object}
 */
Exhibit.UI.createFocusDialogBox = function(itemID, exhibit, configuration) {
    var template, dom;
    template = {
        tag:        "div",
        className:  "exhibit-focusDialog exhibit-ui-protection",
        children: [
            {   tag:        "div",
                className:  "exhibit-focusDialog-viewContainer",
                field:      "viewContainer"
            },
            {   tag:        "div",
                className:  "exhibit-focusDialog-controls",
                children: [
                    {   tag:        "button",
                        field:      "closeButton",
                        children:   [ Exhibit._("%general.focusDialogBoxCloseButtonLabel") ]
                    }
                ]
            }
        ]
    };

    /**
     * @ignore
     */
    dom = Exhibit.jQuery.simileDOM("template", template);

    Exhibit.UI.setupDialog(dom, true);

    /**
     * @ignore Can't get JSDocTK to ignore this one method for some reason.
     */
    dom.open = function() {
        var lens;
        Exhibit.jQuery(document).trigger("modalSuperseded.exhibit");
        lens = new Exhibit.Lens(itemID, dom.viewContainer, exhibit, configuration);
        
        Exhibit.jQuery(dom.elmt).css("top", (document.body.scrollTop + 100) + "px");
        Exhibit.jQuery(document.body).append(dom.elmt);
        
        Exhibit.jQuery(dom.closeButton).bind("click", function(evt) {
            dom.close();
            evt.preventDefault();
            evt.stopPropagation();
        });
        Exhibit.jQuery(dom.elmt).trigger("modalOpened.exhibit");
    };
    
    return dom;
};

/**
 * @static
 * @param {String} relativeUrl
 * @param {String} verticalAlign
 * @returns {Element}
 */
Exhibit.UI.createTranslucentImage = function(relativeUrl, verticalAlign) {
    return Exhibit.jQuery.simileBubble("createTranslucentImage", Exhibit.urlPrefix + relativeUrl, verticalAlign);
};

/**
 * @static
 * @param {String} relativeUrl
 * @param {String} verticalAlign
 * @returns {Element}
 */
Exhibit.UI.createTranslucentImageHTML = function(relativeUrl, verticalAlign) {
    return Exhibit.jQuery.simileBubble("createTranslucentImageHTML", Exhibit.urlPrefix + relativeUrl, verticalAlign);
};

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Element} elmt
 * @returns {Boolean}
 */
Exhibit.UI._clickInElement = function(x, y, elmt) {
    var offset = Exhibit.jQuery(elmt).offset();
    var dims = { "w": Exhibit.jQuery(elmt).outerWidth(),
                 "h": Exhibit.jQuery(elmt).outerHeight() };
    return (x < offset.left &&
            x > offset.left + dims.w &&
            y < offset.top &&
            y > offset.top + dims.h);
};

/**
 * Add the close property to dom, a function taking a jQuery event that
 * simulates the UI for closing a dialog.  THe dialog can either be modal
 * (takes over the window focus) or modeless (will be closed if something
 * other than it is focused).
 *
 * This scheme assumes a modeless dialog will never produce a modal dialog
 * without also closing down.
 * 
 * @param {Object} dom An object with pointers into the DOM.
 * @param {Boolean} modal Whether the dialog is modal or not.
 * @param {Element} [dialogParent] The element containing the parent dialog.
 */
Exhibit.UI.setupDialog = function(dom, modal, dialogParent) {
    var clickHandler, cancelHandler, cancelAllHandler, createdHandler, i, trap;

    if (typeof parentDialog !== "undefined" && parentDialog !== null) {
        dom._dialogParent = dialogParent;
    }

    if (!modal) {
        dom._dialogDescendants = [];
        
        clickHandler = function(evt) {
            if (!Exhibit.UI._clickInElement(evt.pageX, evt.pageY, dom.elmt)) {
                trap = false;
                for (i = 0; i < dom._dialogDescendants; i++) {
                    trap = trap || Exhibit.UI._clickInElement(evt.pageX, evt.pageY, dom._dialogDescendants[i]);
                    if (trap) {
                        break;
                    }
                }
                if (!trap) {
                    dom.close(evt);
                }
            }
        };

        cancelAllHandler = function(evt) {
            dom.close(evt);
        };

        cancelHandler = function(evt) {
            dom.close(evt);
        };

        createdHandler = function(evt) {
            var descendant = evt.target;
            dom._dialogDescendants.push(descendant);
            Exhibit.jQuery(descendant).bind("cancelModeless.exhibit", function(evt) {
                dom._dialogDescendants.splice(dom._dialogDescendants.indexOf(descendant), 1);
                Exhibit.jQuery(descendant).unbind(evt);
            });
        };

        dom.close = function(evt) {
            if (typeof evt !== "undefined") {
                if (evt.type !== "cancelAllModeless") {
                    Exhibit.jQuery(dom.elmt).trigger("cancelModeless.exhibit");
                }
            } else {
                Exhibit.jQuery(dom.elmt).trigger("cancelModeless.exhibit");
            }
            Exhibit.jQuery(document.body).unbind("click", clickHandler);
            Exhibit.jQuery(dom._dialogParent).unbind("cancelModeless.exhibit", cancelHandler);
            Exhibit.jQuery(document).unbind("cancelAllModeless.exhibit", cancelAllHandler);
            Exhibit.jQuery(dom.elmt).trigger("closed.exhibit");
            Exhibit.jQuery(dom.elmt).remove();
        };

        Exhibit.jQuery(dom.elmt).bind("modelessOpened.exhibit", createdHandler);
        Exhibit.jQuery(dom.elmt).one("modelessOpened.exhibit", function(evt) {
            Exhibit.jQuery(document.body).bind("click", clickHandler);
            Exhibit.jQuery(dom._dialogParent).bind("cancelModeless.exhibit", cancelHandler);
            Exhibit.jQuery(document).bind("cancellAllModeless.exhibit", cancelAllHandler);
        });
    } else {
        dom._superseded = 0;

        clickHandler = function(evt) {
            if (dom._superseded === 0 &&
                !Exhibit.UI._clickInElement(evt.pageX, evt.pageY, dom.elmt)) {
                evt.preventDefault();
                evt.stopImmediatePropagation();
            }
        };

        closedHandler = function(evt) {
            dom._superseded--;
        };
        
        supersededHandler = function(evt) {
            dom._superseded++;
            // Will be unbound when element issuing this signal removes
            // itself.
            Exhibit.jQuery(evt.target).bind("cancelModal.exhibit", closedHandler);
        };

        // Some UI element or keystroke should bind dom.close now that
        // it's been setup.
        dom.close = function(evt) {
            Exhibit.jQuery(dom.elmt).trigger("cancelModal.exhibit");
            Exhibit.jQuery(document).trigger("cancelAllModeless.exhibit");
            Exhibit.jQuery(dom.elmt).remove();
            Exhibit.jQuery(document.body).unbind("click", clickHandler);
            Exhibit.jQuery(document).unbind("modalSuperseded.exhibit", supersededHandler);
        };

        Exhibit.jQuery(dom.elmt).one("modalOpened.exhibit", function() {
            Exhibit.jQuery(document.body).bind("click", clickHandler);
            Exhibit.jQuery(document).bind("modalSuperseded.exhibit", supersededHandler);
        });
    }
};
/**
 * @fileOverview Basic facet component registration.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {String} key
 * @param {Element|jQuery} div
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Facet = function(key, div, uiContext) {
    var self, _id, _instanceKey, _div, _uiContext, _registered, _expression, _expressionString, _settingspecs, _setIdentifier;

    /**
     * @private
     */
    self = this;

    /**
     * @private
     */
    _instanceKey = key;

    /**
     * @private
     */
    _uiContext = uiContext;

    /**
     * @private
     */
    _div = Exhibit.jQuery(div);

    /**
     * @private
     */
    _registered = false;

    /**
     * @private
     */
    _id = null;

    /**
     * @private
     */
    _expression = null;

    /**
     * @private
     */
    _expressionString = "";

    /**
     * @private
     */
    _settingSpecs = {};

    /**
     * @public
     */
    this._settings = {};

    /**
     * @public
     * @returns {String}
     */
    this.getLabel = function() {
        if (typeof this._settings.facetLabel !== "undefined") {
            return this._settings.facetLabel;
        } else {
            return Exhibit._("%facets.missingLabel", Exhibit.makeExhibitAttribute("facetLabel"));
        }
    };

    /**
     * @public
     * @param {Exhibit.Expression}
     */
    this.setExpression = function(e) {
        _expression = e;
    };

    /**
     * @public
     * @returns {Exhibit.Expression}
     */
    this.getExpression = function() {
        return _expression;
    };

    /**
     * @public
     * @param {String} s
     */
    this.setExpressionString = function(s) {
        _expressionString = s;
        _setIdentifier();
    };

    /**
     * @public
     * @returns {String}
     */
    this.getExpressionString = function() {
        return _expressionString;
    };

    /**
     * @public
     * @param {Object} specs
     */
    this.addSettingSpecs = function(specs) {
        Exhibit.jQuery.extend(true, _settingSpecs, specs);
    };

    /**
     * @public
     * @returns {Object}
     */
    this.getSettingSpecs = function() {
        return _settingSpecs;
    };

    /**
     * Returns the programmatic identifier used for this facet.
     * @public
     * @returns {String}
     */
    this.getID = function() {
        return _id;
    };

    /**
     * Returns the UI context for this facet.
     * @public
     * @returns {Exhibit.UIContext}
     */
    this.getUIContext = function() {
        return _uiContext;
    };

    /**
     * Returns the containing element for this facet.
     * @public
     * @returns {jQuery}
     */
    this.getContainer = function() {
        return _div;
    };

    /**
     * Enter this facet into the registry, making it easier to locate.
     * By convention, this should be called at the end of the factory.
     * @example MyFacet.create = function() { ...; this.register(); };
     */
    this.register = function() {
        this.getUIContext().getMain().getRegistry().register(
            Exhibit.Facet.getRegistryKey(),
            this.getID(),
            this
        );
        _registered = true;
    };

    /**
     * Remove this facet from the registry.
     */
    this.unregister = function() {
        self.getUIContext().getMain().getRegistry().unregister(
            Exhibit.Facet.getRegistryKey(),
            self.getID()
        );
        _registered = false;
    };

    /**
     * Free up all references to objects, empty related elements, unregister.
     */
    this._dispose = function() {
        Exhibit.jQuery(_div).empty();
        this.getUIContext().getCollection().removeFacet(this);
        this.unregister();

        _id = null;
        _div = null;
        _uiContext = null;
        _expression = null;
        _expressionString = null;
        _settings = null;
        _settingSpecs = null;
        self = null;
    };

    /**
     * @private
     */
    _setIdentifier = function() {
        _id = Exhibit.jQuery(_div).attr("id");
        if (typeof _id === "undefined" || _id === null) {
            _id = Exhibit.Facet.getRegistryKey()
                + "-"
                + _instanceKey
                + "-"
                + self.getExpressionString()
                + "-"
                + self.getUIContext().getCollection().getID()
                + "-"
                + self.getUIContext().getMain().getRegistry().generateIdentifier(Exhibit.Facet.getRegistryKey());
        }
    };

    _setIdentifier();
    self.addSettingSpecs(Exhibit.Facet._settingSpecs);
};

/**
 * @private
 * @constant
 */
Exhibit.Facet._registryKey = "facet";

Exhibit.Facet._settingSpecs = {
    "facetLabel":       { "type": "text" },
};

/**
 * @public
 * @static
 * @returns {String}
 */
Exhibit.Facet.getRegistryKey = function() {
    return Exhibit.Facet._registryKey;
};

/**
 * @private
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.Facet.registerComponent = function(evt, reg) {
    if (!reg.hasRegistry(Exhibit.Facet.getRegistryKey())) {
        reg.createRegistry(Exhibit.Facet.getRegistryKey());
        Exhibit.jQuery(document).trigger("registerFacets.exhibit");
    }
};

Exhibit.jQuery(document).one(
    "registerComponents.exhibit",
    Exhibit.Facet.registerComponent
);
/**
 * @fileOverview List facet functions and UI
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ListFacet = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Facet("list", containerElmt, uiContext));
    this.addSettingSpecs(Exhibit.ListFacet._settingSpecs);

    this._colorCoder = null;
    this._valueSet = new Exhibit.Set();
    this._selectMissing = false;
	this._delayedUpdateItems = null;
    this._dom = null;
    this._orderMap = null;
};

/**
 * @constant
 */
Exhibit.ListFacet._settingSpecs = {
    "fixedOrder":       { "type": "text" },
    "sortMode":         { "type": "text", "defaultValue": "value" },
    "sortDirection":    { "type": "text", "defaultValue": "forward" },
    "showMissing":      { "type": "boolean", "defaultValue": true },
    "missingLabel":     { "type": "text" },
    "scroll":           { "type": "boolean", "defaultValue": true },
    "height":           { "type": "text" },
    "colorCoder":       { "type": "text", "defaultValue": null },
    "collapsible":      { "type": "boolean", "defaultValue": false },
    "collapsed":        { "type": "boolean", "defaultValue": false },
    "formatter":        { "type": "text", "defaultValue": null}
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ListFacet}
 */
Exhibit.ListFacet.create = function(configuration, containerElmt, uiContext) {
    var facet, thisUIContext;
    thisUIContext = Exhibit.UIContext.create(configuration, uiContext);
    facet = new Exhibit.ListFacet(containerElmt, thisUIContext);
    
    Exhibit.ListFacet._configure(facet, configuration);
    
    facet._initializeUI();
    thisUIContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @static
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ListFacet}
 */
Exhibit.ListFacet.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, thisUIContext, facet, expressionString, selection, selectMissing, i;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    thisUIContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    facet = new Exhibit.ListFacet(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt : configElmt, 
        thisUIContext
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, facet.getSettingSpecs(), facet._settings);
    
    try {
        expressionString = Exhibit.getAttribute(configElmt, "expression");
        if (typeof expressionString !== "undefined" && expressionString !== null && expressionString.length > 0) {
            facet.setExpression(Exhibit.ExpressionParser.parse(expressionString));
            facet.setExpressionString(expressionString);
        }

        selection = Exhibit.getAttribute(configElmt, "selection", ";");
        if (typeof selection !== "undefined" && selection !== null && selection.length > 0) {
            for (i = 0; i < selection.length; i++) {
                facet._valueSet.add(selection[i]);
            }
        }
        
        selectMissing = Exhibit.getAttribute(configElmt, "selectMissing");
        if (typeof selectMissing !== "undefined" && selectMissing !== null && selectMissing.length > 0) {
            facet._selectMissing = (selectMissing === "true");
        }
    } catch (e) {
        Exhibit.Debug.exception(e, "ListFacet: Error processing configuration of list facet");
    }
    Exhibit.ListFacet._configure(facet, configuration);

    facet._initializeUI();
    thisUIContext.getCollection().addFacet(facet);
    facet.register();

    return facet;
};

/**
 * @static
 * @private
 * @param {Exhibit.ListFacet} facet
 * @param {Object} configuration
 */
Exhibit.ListFacet._configure = function(facet, configuration) {
    var selection, i, segment, property, values, orderMap, formatter;
    Exhibit.SettingsUtilities.collectSettings(configuration, facet.getSettingSpecs(), facet._settings);
    
    if (typeof configuration.expression !== "undefined") {
        facet.setExpressionString(configuration.expression);
        facet.setExpression(Exhibit.ExpressionParser.parse(configuration.expression));
    }
    if (typeof configuration.selection !== "undefined") {
        selection = configuration.selection;
        for (i = 0; i < selection.length; i++) {
            facet._valueSet.add(selection[i]);
        }
    }
    if (typeof configuration.selectMissing !== "undefined") {
        facet._selectMissing = configuration.selectMissing;
    }
    
    if (typeof facet._settings.facetLabel === "undefined") {
        if (facet.getExpression() !== null && facet.getExpression().isPath()) {
            segment = facet.getExpression().getPath().getLastSegment();
            property = facet.getUIContext().getDatabase().getProperty(segment.property);
            if (typeof property !== "undefined" && property !== null) {
                facet._settings.facetLabel = segment.forward ? property.getLabel() : property.getReverseLabel();
            }
        }
    }
    if (typeof facet._settings.fixedOrder !== "undefined") {
        values = facet._settings.fixedOrder.split(";");
        orderMap = {};
        for (i = 0; i < values.length; i++) {
            orderMap[values[i].trim()] = i;
        }
        
        facet._orderMap = orderMap;
    }
    
    if (facet._settings.colorCoder !== "undefined") {
        facet._colorCoder = facet.getUIContext().getMain().getComponent(facet._settings.colorCoder);
    }
    
    if (facet._settings.collapsed) {
        facet._settings.collapsible = true;
    }
    
    if (typeof facet._settings.formatter !== "undefined") {
        formatter = facet._settings.formatter;
        if (formatter !== null && formatter.length > 0) {
            try {
                facet._formatter = eval(formatter);
            } catch (e) {
                Exhibit.Debug.log(e);
            }
        }
    }
    
    facet._cache = new Exhibit.FacetUtilities.Cache(
        facet.getUIContext().getDatabase(),
        facet.getUIContext().getCollection(),
        facet.getExpression()
    );
};

/**
 *
 */
Exhibit.ListFacet.prototype.dispose = function() {
    this._cache.dispose();
    this._cache = null;
    this._colorCoder = null;
    this._dom = null;
    this._valueSet = null;
    this._orderMap = null;
    this._dispose();
};

/**
 * @returns {Boolean}
 */
Exhibit.ListFacet.prototype.hasRestrictions = function() {
    return this._valueSet.size() > 0 || this._selectMissing;
};

/**
 *
 */
Exhibit.ListFacet.prototype.clearAllRestrictions = function() {
    Exhibit.jQuery(this.getContainer()).trigger("onBeforeFacetReset.exhibit");
    this._valueSet = new Exhibit.Set();
    this._selectMissing = false;
    this._notifyCollection();
};

/**
 * @param {Object} restrictions
 * @param {Array} restrictions.selection
 * @param {Boolean} restrictions.selectMissing
 */
Exhibit.ListFacet.prototype.applyRestrictions = function(restrictions) {
    var i;
    this._valueSet = new Exhibit.Set();
    for (i = 0; i < restrictions.selection.length; i++) {
        this._valueSet.add(restrictions.selection[i]);
    }
    this._selectMissing = restrictions.selectMissing;
    
    this._notifyCollection();
};

/**
 * @param {String} value
 * @param {Boolean} selected
 */
Exhibit.ListFacet.prototype.setSelection = function(value, selected) {
    if (selected) {
        this._valueSet.add(value);
    } else {
        this._valueSet.remove(value);
    }
    this._notifyCollection();
};

/**
 * @param {Boolean} selected
 */
Exhibit.ListFacet.prototype.setSelectMissing = function(selected) {
    if (selected !== this._selectMissing) {
        this._selectMissing = selected;
        this._notifyCollection();
    }
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.ListFacet.prototype.restrict = function(items) {
    if (this._valueSet.size() === 0 && !this._selectMissing) {
        return items;
    }
    
    var set = this._cache.getItemsFromValues(this._valueSet, items);
    if (this._selectMissing) {
        this._cache.getItemsMissingValue(items, set);
    }
    
    return set;
};

/**
 *
 */
Exhibit.ListFacet.prototype.onUncollapse = function() {
	if (this._delayedUpdateItems !== null) {
		this.update(this._delayedUpdateItems);
		this._delayedUpdateItems = null;
	}
};

/**
 * @param {Exhibit.Set} items
 */
Exhibit.ListFacet.prototype.update = function(items) {
	if (Exhibit.FacetUtilities.isCollapsed(this)) {
		this._delayedUpdateItems = items;
		return;
	}
    Exhibit.jQuery(this._dom.valuesContainer)
        .hide()
        .empty();
    this._constructBody(this._computeFacet(items));
    Exhibit.jQuery(this._dom.valuesContainer).show();
};

/**
 * @param {Exhibit.Set} items
 * @returns {Array}
 */
Exhibit.ListFacet.prototype._computeFacet = function(items) {
    var database, r, entries, valueType, selection, labeler, i, entry, count, span;
    database = this.getUIContext().getDatabase();
    r = this._cache.getValueCountsFromItems(items);
    entries = r.entries;
    valueType = r.valueType;
    
    if (entries.length > 0) {
        selection = this._valueSet;
        labeler = valueType === "item" ?
            function(v) { var l = database.getObject(v, "label"); return l !== null ? l : v; } :
            function(v) { return v; };
            
        for (i = 0; i < entries.length; i++) {
            entry = entries[i];
            entry.actionLabel = entry.selectionLabel = labeler(entry.value);
            entry.selected = selection.contains(entry.value);
        }
        
        entries.sort(this._createSortFunction(valueType));
    }
    
    if (this._settings.showMissing || this._selectMissing) {
        count = this._cache.countItemsMissingValue(items);
        if (count > 0 || this._selectMissing) {
            span = Exhibit.jQuery("<span>")
                .attr("class", "exhibit-facet-value-missingThisField")
                .html((typeof this._settings.missingLabel !== "undefined") ? 
                      this._settings.missingLabel :
                      Exhibit._("%facets.missingThisField"));
            
            entries.unshift({
                value:          null, 
                count:          count,
                selected:       this._selectMissing,
                selectionLabel: Exhibit.jQuery(span).get(0),
                actionLabel:    Exhibit._("%facets.missingThisField")
            });
        }
    }
    
    return entries;
};

/**
 *
 */
Exhibit.ListFacet.prototype._notifyCollection = function() {
    this.getUIContext().getCollection().onFacetUpdated(this);
};

/**
 *
 */
Exhibit.ListFacet.prototype._initializeUI = function() {
    var self = this;

    this._dom = Exhibit.FacetUtilities[this._settings.scroll ? "constructFacetFrame" : "constructFlowingFacetFrame"](
		this,
        this.getContainer(),
        this.getLabel(),
        function(elmt, evt, target) { self._clearSelections(); },
        this.getUIContext(),
        this._settings.collapsible,
        this._settings.collapsed
    );

    if (typeof this._settings.height !== "undefined" && this._settings.scroll) {
        Exhibit.jQuery(this._dom.valuesContainer).css("height", this._settings.height);
    }
};

/**
 * @param {Array} entries
 */
Exhibit.ListFacet.prototype._constructBody = function(entries) {
    var self, containerDiv, constructFacetItemFunction, facetHasSelection, constructValue, j;
    self = this;
    containerDiv = this._dom.valuesContainer;
    
    Exhibit.jQuery(containerDiv).hide();
    
    constructFacetItemFunction = Exhibit.FacetUtilities[this._settings.scroll ? "constructFacetItem" : "constructFlowingFacetItem"];
    facetHasSelection = this._valueSet.size() > 0 || this._selectMissing;
    constructValue = function(entry) {
        var onSelect, onSelectOnly, elmt;
        onSelect = function(evt) {
            self._filter(entry.value, entry.actionLabel, false);
            evt.preventDefault();
            evt.stopPropagation();
        };
        onSelectOnly = function(evt) {
            self._filter(entry.value, entry.actionLabel, !(evt.ctrlKey || evt.metaKey));
            evt.preventDefault();
            evt.stopPropagation();
        };
        elmt = constructFacetItemFunction(
            entry.selectionLabel, 
            entry.count, 
            (typeof self._colorCoder !== "undefined" && self._colorCoder !== null) ? self._colorCoder.translate(entry.value) : null,
            entry.selected, 
            facetHasSelection,
            onSelect,
            onSelectOnly,
            self.getUIContext()
        );
        
        if (self._formatter) {
            self._formatter(elmt);
        }
        
        Exhibit.jQuery(containerDiv).append(elmt);
    };
    
    for (j = 0; j < entries.length; j++) {
        constructValue(entries[j]);
    }

    Exhibit.jQuery(containerDiv).show();
    
    this._dom.setSelectionCount(this._valueSet.size() + (this._selectMissing ? 1 : 0));
};

/**
 * @param {String} value
 * @param {String} label
 * @param {Boolean} selectOnly
 */
Exhibit.ListFacet.prototype._filter = function(value, label, selectOnly) {
    var self, selected, select, deselect, oldValues, oldSelectMissing, newValues, newSelectMissing, actionLabel, wasSelected, wasOnlyThingSelected, newRestrictions;
    self = this;
    
    oldValues = new Exhibit.Set(this._valueSet);
    oldSelectMissing = this._selectMissing;
    if (typeof value === "undefined" || value === null) { // the (missing this field) case
        wasSelected = oldSelectMissing;
        wasOnlyThingSelected = wasSelected && (oldValues.size() === 0);
        
        if (selectOnly) {
            if (oldValues.size() === 0) {
                newSelectMissing = !oldSelectMissing;
            } else {
                newSelectMissing = true;
            }
            newValues = new Exhibit.Set();
        } else {
            newSelectMissing = !oldSelectMissing;
            newValues = new Exhibit.Set(oldValues);
        }
    } else {
        wasSelected = oldValues.contains(value);
        wasOnlyThingSelected = wasSelected && (oldValues.size() === 1) && !oldSelectMissing;
        
        if (selectOnly) {
            newSelectMissing = false;
            newValues = new Exhibit.Set();
            
            if (!oldValues.contains(value)) {
                newValues.add(value);
            } else if (oldValues.size() > 1 || oldSelectMissing) {
                newValues.add(value);
            }
        } else {
            newSelectMissing = oldSelectMissing;
            newValues = new Exhibit.Set(oldValues);
            if (newValues.contains(value)) {
                newValues.remove(value);
            } else {
                newValues.add(value);
            }
        }
    }
    
    newRestrictions = { selection: newValues.toArray(), selectMissing: newSelectMissing };

    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        newRestrictions,
        (selectOnly && !wasOnlyThingSelected) ?
            Exhibit._("%facets.facetSelectOnlyActionTitle", label, this.getLabel()) :
            Exhibit._(wasSelected ? "%facets.facetUnselectActionTitle" : "%facets.facetSelectActionTitle", label, this.getLabel()),
        true
    );
};

Exhibit.ListFacet.prototype._clearSelections = function() {
    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        this.exportEmptyState(),
        Exhibit._("%facets.facetClearSelectionsActionTitle", this.getLabel()),
        true
    );
};

/**
 * @param {String} valueType
 * @returns {Function}
 */
Exhibit.ListFacet.prototype._createSortFunction = function(valueType) {
    var sortValueFunction, orderMap, sortFunction, sortDirectionFunction;
    sortValueFunction = function(a, b) { return a.selectionLabel.localeCompare(b.selectionLabel); };
    if (this._orderMap !== null) {
        orderMap = this._orderMap;
        
        sortValueFunction = function(a, b) {
            if (typeof orderMap[a.selectionLabel] !== "undefined") {
                if (typeof orderMap[b.selectionLabel] !== "undefined") {
                    return orderMap[a.selectionLabel] - orderMap[b.selectionLabel];
                } else {
                    return -1;
                }
            } else if (typeof orderMap[b.selectionLabel] !== "undefined") {
                return 1;
            } else {
                return a.selectionLabel.localeCompare(b.selectionLabel);
            }
        };
    } else if (valueType === "number") {
        sortValueFunction = function(a, b) {
            a = parseFloat(a.value);
            b = parseFloat(b.value);
            return a < b ? -1 : a > b ? 1 : 0;
        };
    }
    
    sortFunction = sortValueFunction;
    if (this._settings.sortMode === "count") {
        sortFunction = function(a, b) {
            var c = b.count - a.count;
            return c !== 0 ? c : sortValueFunction(a, b);
        };
    }

    sortDirectionFunction = sortFunction;
    if (this._settings.sortDirection === "reverse"){
        sortDirectionFunction = function(a, b) {
            return sortFunction(b, a);
        };
    }
    
    return sortDirectionFunction;
};

/**
 * @returns {Object}
 */
Exhibit.ListFacet.prototype.exportState = function() {
    return this._exportState(false);
};

/**
 * @returns {Object}
 */
Exhibit.ListFacet.prototype.exportEmptyState = function() {
    return this._exportState(true);
};

/**
 * @private
 * @param {Boolean} empty
 * @returns {Object}
 */
Exhibit.ListFacet.prototype._exportState = function(empty) {
    var s = [];

    if (!empty) {
        s = this._valueSet.toArray();
    }

    return {
        "selection": s,
        "selectMissing": empty ? false : this._selectMissing
    };
};

/**
 * @param {Object} state
 * @param {Array} state.selection
 * @param {Boolean} state.selectMissing
 */
Exhibit.ListFacet.prototype.importState = function(state) {
    if (this.stateDiffers(state)) {
        if (state.selection.length === 0 && !state.selectMissing) {
            this.clearAllRestrictions();
        } else {
            this.applyRestrictions(state);
        }
    }
};

/**
 * Check if the state being requested for import is any different from the
 * current state.  This is only a worthwhile function to call if the check
 * is always faster than just going through with thei mport.
 * 
 * @param {Object} state
 */
Exhibit.ListFacet.prototype.stateDiffers = function(state) {
    var stateSet, stateStartCount, valueStartCount;

    if (state.selectMissing !== this._selectMissing) {
        return true;
    }

    stateStartCount = state.selection.length;
    valueStartCount = this._valueSet.size();

    if (stateStartCount !== valueStartCount) {
        return true;
    } else {
        stateSet = new Exhibit.Set(state.selection);
        stateSet.addSet(this._valueSet);
        if (stateSet.size() !== stateStartCount) {
            return true;
        }
    }

    return false;
};
/**
 * @fileOverview Cloud facet functions and UI
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @author <a href="mailto:axel@pike.org">Axel Hecht</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.CloudFacet = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Facet("cloud", containerElmt, uiContext));
    this.addSettingSpecs(Exhibit.CloudFacet._settingSpecs);
    this._colorCoder = null;
    this._valueSet = new Exhibit.Set();
    this._itemToValue = null;
    this._valueToItem = null;
    this._missingItems = null;
    this._valueType = null;
    this._orderMap = null;
    this._selectMissing = false;
    this._dom = null;
};

/**
 * @constant
 */
Exhibit.CloudFacet._settingSpecs = {
    "minimumCount":     { "type": "int", "defaultValue": 1 },
    "showMissing":      { "type": "boolean", "defaultValue": true },
    "missingLabel":     { "type": "text" }
};

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.CloudFacet}
 */
Exhibit.CloudFacet.create = function(configuration, containerElmt, uiContext) {
    var facet, thisUIContext;
    thisUIContext = Exhibit.UIContext.create(configuration, uiContext);
    facet = new Exhibit.CloudFacet(containerElmt, thisUIContext);
    
    Exhibit.CloudFacet._configure(facet, configuration);
    
    facet._initializeUI();
    thisUIContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.CloudFacet}
 */
Exhibit.CloudFacet.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, thisUIContext, facet, expressionString, selection, selectMissing, i;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    thisUIContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    facet = new Exhibit.CloudFacet(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt :
            configElmt, 
        thisUIContext
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, facet.getSettingSpecs(), facet._settings);
    
    try {
        expressionString = Exhibit.getAttribute(configElmt, "expression");
        if (typeof expressionString !== "undefined" && expressionString !== null && expressionString.length > 0) {
            facet.setExpression(Exhibit.ExpressionParser.parse(expressionString));
            facet.setExpressionString(expressionString);
        }

        selection = Exhibit.getAttribute(configElmt, "selection", ";");
        if (typeof selection !== "undefined" && selection !== null && selection.length > 0) {
            for (i = 0; i < selection.length; i++) {
                facet._valueSet.add(selection[i]);
            }
        }
        
        selectMissing = Exhibit.getAttribute(configElmt, "selectMissing");
        if (typeof selectMissing !== "undefined" && selectMissing !== null && selectMissing.length > 0) {
            facet._selectMissing = (selectMissing === "true");
        }
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%facets.error.configuration", "CloudFacet"));
    }
    Exhibit.CloudFacet._configure(facet, configuration);

    facet._initializeUI();
    thisUIContext.getCollection().addFacet(facet);
    facet.register();

    return facet;
};

/**
 * @param {Exhibit.CloudFacet} facet
 * @param {Object} configuration
 */
Exhibit.CloudFacet._configure = function(facet, configuration) {
    var selection, i, segment, property, values, orderMap, formatter;
    Exhibit.SettingsUtilities.collectSettings(configuration, facet.getSettingSpecs(), facet._settings);
    
    if (typeof configuration.expression !== "undefined") {
        facet.setExpressionString(configuration.expression);
        facet.setExpression(Exhibit.ExpressionParser.parse(configuration.expression));
    }
    if (typeof configuration.selection !== "undefined") {
        selection = configuration.selection;
        for (i = 0; i < selection.length; i++) {
            facet._valueSet.add(selection[i]);
        }
    }
    if (typeof configuration.selectMissing !== "undefined") {
        facet._selectMissing = configuration.selectMissing;
    }
};

/**
 *
 */
Exhibit.CloudFacet.prototype.dispose = function() {
    this.getUIContext().getCollection().removeFacet(this);
    this._dom = null;
    this._valueSet = null;
    this._itemToValue = null;
    this._valueToItem = null;
    this._valueType = null;
    this._missingItems = null;
    this._orderMap = null;
    this._dispose();
};

/**
 * @returns {Boolean}
 */
Exhibit.CloudFacet.prototype.hasRestrictions = function() {
    return this._valueSet.size() > 0 || this._selectMissing;
};

/**
 *
 */
Exhibit.CloudFacet.prototype.clearAllRestrictions = function() {
    Exhibit.jQuery(this.getContainer()).trigger("onBeforeFacetReset.exhibit");
    this._valueSet = new Exhibit.Set();
    this._selectMissing = false;
    this._notifyCollection();
};

/**
 * @param {Array} restrictions
 */
Exhibit.CloudFacet.prototype.applyRestrictions = function(restrictions) {
    var i;
    this._valueSet = new Exhibit.Set();
    for (i = 0; i < restrictions.selection.length; i++) {
        this._valueSet.add(restrictions.selection[i]);
    }
    this._selectMissing = restrictions.selectMissing;
    
    this._notifyCollection();
};

/**
 * @param {String} value
 * @param {Boolean} selected
 */
Exhibit.CloudFacet.prototype.setSelection = function(value, selected) {
    if (selected) {
        this._valueSet.add(value);
    } else {
        this._valueSet.remove(value);
    }
    this._notifyCollection();
};

/**
 * @param {Boolean} selected
 */
Exhibit.CloudFacet.prototype.setSelectMissing = function(selected) {
    if (selected !== this._selectMissing) {
        this._selectMissing = selected;
        this._notifyCollection();
    }
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.CloudFacet.prototype.restrict = function(items) {
    var set, itemA, i, item, valueToItem, missingItems;

    if (this._valueSet.size() === 0 && !this._selectMissing) {
        return items;
    }
    
    if (this.getExpression().isPath()) {
        set = this.getExpression().getPath().walkBackward(
            this._valueSet, 
            "item",
            items, 
            this.getUIContext().getDatabase()
        ).getSet();
    } else {
        this._buildMaps();
        
        set = new Exhibit.Set();
        
        valueToItem = this._valueToItem;
        this._valueSet.visit(function(value) {
            if (typeof valueToItem[value] !== "undefined") {
                itemA = valueToItem[value];
                for (i = 0; i < itemA.length; i++) {
                    item = itemA[i];
                    if (items.contains(item)) {
                        set.add(item);
                    }
                }
            }
        });
    }
    
    if (this._selectMissing) {
        this._buildMaps();
        
        missingItems = this._missingItems;
        items.visit(function(item) {
            if (typeof missingItems[item] !== "undefined") {
                set.add(item);
            }
        });
    }
    
    return set;
};

/**
 * @param {Exhibit.Set} items
 */
Exhibit.CloudFacet.prototype.update = function(items) {
    this._constructBody(this._computeFacet(items));
};

/**
 * @param {Exhibit.Set} items
 * @returns {Array}
 */
Exhibit.CloudFacet.prototype._computeFacet = function(items) {
    var database, entries, valueType, self, path, facetValueResult, itemSubcollection, value, itemA, count, i, item, sortValueFunction, orderMap, sortFunction, sortDirectionFunction;
    database = this.getUIContext().getDatabase();
    entries = [];
    valueType = "text";
    self = this;
    if (this.getExpression().isPath()) {
        path = this.getExpression().getPath();
        facetValueResult = path.walkForward(items, "item", database);
        valueType = facetValueResult.valueType;
        if (facetValueResult.size > 0) {
            facetValueResult.forEachValue(function(facetValue) {
                itemSubcollection = path.evaluateBackward(facetValue, valueType, items, database);
                if (itemSubcollection.size >= self._settings.minimumCount || self._valueSet.contains(facetValue)) {
                    entries.push({ value: facetValue, count: itemSubcollection.size });
                }
            });
        }
    } else {
        this._buildMaps();
        
        valueType = this._valueType;
        for (value in this._valueToItem) {
            if (this._valueToItem.hasOwnProperty(value)) {
                itemA = this._valueToItem[value];
                count = 0;
                for (i = 0; i < itemA.length; i++) {
                    if (items.contains(itemA[i])) {
                        count++;
                    }
                }
            
                if (count >= this._settings.minimumCount || this._valueSet.contains(value)) {
                    entries.push({ value: value, count: count });
                }
            }
        }
    }
    
    if (entries.length > 0) {
        selection = this._valueSet;
        labeler = valueType === "item" ?
            function(v) { var l = database.getObject(v, "label"); return l !== null ? l : v; } :
            function(v) { return v; };
            
        for (i = 0; i < entries.length; i++) {
            entry = entries[i];
            entry.actionLabel = entry.selectionLabel = labeler(entry.value);
            entry.selected = selection.contains(entry.value);
        }
        
        sortValueFunction = function(a, b) { return a.selectionLabel.localeCompare(b.selectionLabel); };
        if (this._orderMap !== null) {
            orderMap = this._orderMap;
            
            sortValueFunction = function(a, b) {
                if (typeof orderMap[a.selectionLabel] !== "undefined") {
                    if (typeof orderMap[b.selectionLabel] !== "undefined") {
                        return orderMap[a.selectionLabel] - orderMap[b.selectionLabel];
                    } else {
                        return -1;
                    }
                } else if (typeof orderMap[b.selectionLabel] !== "undefined") {
                    return 1;
                } else {
                    return a.selectionLabel.localeCompare(b.selectionLabel);
                }
            };
        } else if (valueType === "number") {
            sortValueFunction = function(a, b) {
                a = parseFloat(a.value);
                b = parseFloat(b.value);
                return a < b ? -1 : a > b ? 1 : 0;
            };
        }
        
        sortFunction = sortValueFunction;
        if (this._settings.sortMode === "count") {
            sortFunction = function(a, b) {
                var c = b.count - a.count;
                return c !== 0 ? c : sortValueFunction(a, b);
            };
        }

        sortDirectionFunction = sortFunction;
        if (this._settings.sortDirection === "reverse"){
            sortDirectionFunction = function(a, b) {
                return sortFunction(b, a);
            };
        }

        entries.sort(sortDirectionFunction);
    }
    
    if (this._settings.showMissing || this._selectMissing) {
        this._buildMaps();
        
        count = 0;
        for (item in this._missingItems) {
            if (this._missingItems.hasOwnProperty(item)) {
                if (items.contains(item)) {
                    count++;
                }
            }
        }
        
        if (count > 0 || this._selectMissing) {
            span = Exhibit.jQuery("<span>");
            Exhibit.jQuery(span).html((typeof this._settings.missingLabel !== "undefined") ? 
                         this._settings.missingLabel :
                         Exhibit._("%facets..missingThisField"));
            Exhibit.jQuery(span).attr("class", "exhibit-facet-value-missingThisField");
            
            entries.unshift({
                value:          null, 
                count:          count,
                selected:       this._selectMissing,
                selectionLabel: Exhibit.jQuery(span).get(0),
                actionLabel:    Exhibit._("%facets.missingThisField")
            });
        }
    }
    
    return entries;
};

/**
 *
 */
Exhibit.CloudFacet.prototype._notifyCollection = function() {
    this.getUIContext().getCollection().onFacetUpdated(this);
};

/**
 *
 */
Exhibit.CloudFacet.prototype._initializeUI = function() {
    Exhibit.jQuery(this.getContainer()).empty();
    Exhibit.jQuery(this.getContainer()).attr("class", "exhibit-cloudFacet");

    var dom = Exhibit.jQuery.simileDOM(
        "string",
        this.getContainer(),
        ((typeof this._settings.facetLabel !== "undefined") ?
         (   "<div class='exhibit-cloudFacet-header'>" +
             "<span class='exhibit-cloudFacet-header-title'>" + this.getLabel() + "</span>" +
             "</div>"
         ) :
         ""
        ) +
            '<div class="exhibit-cloudFacet-body" id="valuesContainer"></div>'
    );

    this._dom = dom;
};

/**
 * @param {Array} entries
 */
Exhibit.CloudFacet.prototype._constructBody = function(entries) {
    var self, containerDiv, constructFacetItemFunction, facetHasSelection, constructValue, j, min, max, entry, range;
    self = this;
    containerDiv = this._dom.valuesContainer;
    
    Exhibit.jQuery(containerDiv).hide();
    Exhibit.jQuery(containerDiv).empty();
    
    if (entries.length > 0) {
        min = Number.POSITIVE_INFINITY;
        max = Number.NEGATIVE_INFINITY;
        for (j = 0; j < entries.length; j++) {
            entry = entries[j];
            min = Math.min(min, entry.count);
            max = Math.max(max, entry.count);
        }
        range = max - min;
        
        constructValue = function(entry) {
            var onSelect, onSelectOnly, elmt;
            onSelect = function(evt) {
                self._filter(entry.value, entry.actionLabel, !(evt.ctrlKey || evt.metaKey));
                evt.preventDefault();
                evt.stopPropagation();
            };
            
            elmt = Exhibit.jQuery("<span>");
            
            Exhibit.jQuery(elmt).append(document.createTextNode("\u00A0"));
            if (typeof entry.selectionLabel === "string") {
                Exhibit.jQuery(elmt).append(document.createTextNode(entry.selectionLabel));
            } else {
                Exhibit.jQuery(elmt).append(entry.selectionLabel);
            }
            Exhibit.jQuery(elmt).append(document.createTextNode("\u00A0"));
            
            Exhibit.jQuery(elmt).attr("class", entry.selected ? 
                         "exhibit-cloudFacet-value exhibit-cloudFacet-value-selected" :
                         "exhibit-cloudFacet-value");
                
            if (entry.count > min) {
                Exhibit.jQuery(elmt).css("fontSize", Math.ceil(100 + 100 * Math.log(1 + 1.5 * (entry.count - min) / range)) + "%");
            }
            
            Exhibit.jQuery(elmt).bind("click", onSelect);
        
            Exhibit.jQuery(containerDiv).append(elmt);
            Exhibit.jQuery(containerDiv).append(document.createTextNode(" "));
        };
    
        for (j = 0; j < entries.length; j++) {
            constructValue(entries[j]);
        }
    
        Exhibit.jQuery(containerDiv).show();
    }
};

/**
 * @param {String} value
 * @param {String} label
 * @param {Boolean} selectOnly
 */
Exhibit.CloudFacet.prototype._filter = function(value, label, selectOnly) {
    var self, selected, select, deselect, oldValues, oldSelectMissing, newValues, newSelectMissing, actionLabel, wasSelected, wasOnlyThingSelected, newRestrictions, facetLabel;
    self = this;
    
    oldValues = new Exhibit.Set(this._valueSet);
    oldSelectMissing = this._selectMissing;
    
    if (typeof value === "undefined" || value === null) {
        // the (missing this field) case
        wasSelected = oldSelectMissing;
        wasOnlyThingSelected = wasSelected && (oldValues.size() === 0);
        
        if (selectOnly) {
            if (oldValues.size() === 0) {
                newSelectMissing = !oldSelectMissing;
            } else {
                newSelectMissing = true;
            }
            newValues = new Exhibit.Set();
        } else {
            newSelectMissing = !oldSelectMissing;
            newValues = new Exhibit.Set(oldValues);
        }
    } else {
        wasSelected = oldValues.contains(value);
        wasOnlyThingSelected = wasSelected && (oldValues.size() === 1) && !oldSelectMissing;
        
        if (selectOnly) {
            newSelectMissing = false;
            newValues = new Exhibit.Set();
            
            if (!oldValues.contains(value)) {
                newValues.add(value);
            } else if (oldValues.size() > 1 || oldSelectMissing) {
                newValues.add(value);
            }
        } else {
            newSelectMissing = oldSelectMissing;
            newValues = new Exhibit.Set(oldValues);
            if (newValues.contains(value)) {
                newValues.remove(value);
            } else {
                newValues.add(value);
            }
        }
    }
    
    newRestrictions = { selection: newValues.toArray(), selectMissing: newSelectMissing };
    
    facetLabel = this.getLabel();
    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        newRestrictions,
        (selectOnly && !wasOnlyThingSelected) ?
            Exhibit._("%facets.facetSelectOnlyActionTitle", label, facetLabel) :
            Exhibit._(wasSelected ? "%facets.facetUnselectActionTitle" : "%facets.facetSelectActionTitle", label, facetLabel),
        true
    );
};

Exhibit.CloudFacet.prototype._clearSelections = function() {
    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        this.exportEmptyState(),
        Exhibit._("%facets.facetClearSelectionsActionTitle", this.getLabel()),
        true
    );
};

Exhibit.CloudFacet.prototype._buildMaps = function() {
    var itemToValue, valueToItem, missingItems, valueType, insert, expression, database;

    if (this._itemToValue === null) {
        itemToValue = {};
        valueToItem = {};
        missingItems = {};
        valueType = "text";
        orderMap = this._orderMap;
        
        insert = function(x, y, map) {
            if (typeof map[x] !== "undefined") {
                map[x].push(y);
            } else {
                map[x] = [ y ];
            }
        };
        
        expression = this.getExpression();
        database = this.getUIContext().getDatabase();
        
        this.getUIContext().getCollection().getAllItems().visit(function(item) {
            var results = expression.evaluateOnItem(item, database);
            if (results.values.size() > 0) {
                valueType = results.valueType;
                results.values.visit(function(value) {
                    insert(item, value, itemToValue);
                    insert(value, item, valueToItem);
                });
            } else {
                missingItems[item] = true;
            }
        });

        this._itemToValue = itemToValue;
        this._valueToItem = valueToItem;
        this._missingItems = missingItems;
        this._valueType = valueType;
    }
};

/**
 * @returns {Object}
 */
Exhibit.CloudFacet.prototype.exportState = function() {
    return this._exportState(false);
};

/**
 * @returns {Object}
 */
Exhibit.CloudFacet.prototype.exportEmptyState = function() {
    return this._exportState(true);
};

/**
 * @private
 * @param {Boolean} empty
 */
Exhibit.CloudFacet.prototype._exportState = function(empty) {
    var s = [];

    if (!empty) {
        s = this._valueSet.toArray();
    }

    return {
        "selection": s,
        "selectMissing": this._selectMissing
    };
};

/**
 * @param {Object} state
 * @param {Boolean} state.selectMissing
 * @param {Array} state.selection
 */
Exhibit.CloudFacet.prototype.importState = function(state) {
    if (this.stateDiffers(state)) {
        if (state.selection.length === 0 && !state.selectMissing) {
            this.clearAllRestrictions();
        } else {
            this.applyRestrictions(state);
        }
    }
};

/**
 * Check if the state being requested for import is any different from the
 * current state.  This is only a worthwhile function to call if the check
 * is always faster than just going through with the import.
 * 
 * @param {Object} state
 * @param {Boolean} state.selectMissing
 * @param {Array} state.selection
 */
Exhibit.CloudFacet.prototype.stateDiffers = function(state) {
    var stateSet, stateStartCount, valueStartCount;

    if (state.selectMissing !== this._selectMissing) {
        return true;
    }

    stateStartCount = state.selection.length;
    valueStartCount = this._valueSet.size();

    if (stateStartCount !== valueStartCount) {
        return true;
    } else {
        stateSet = new Exhibit.Set(state.selection);
        stateSet.addSet(this._valueSet);
        if (stateSet.size() !== stateStartCount) {
            return true;
        }
    }

    return false;
};
/**
 * @fileOverview Numeric range facet functions and UI
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.NumericRangeFacet = function(containerElmt, uiContext) {
    var self = this;
    Exhibit.jQuery.extend(
        this,
        new Exhibit.Facet("numericrange", containerElmt, uiContext)
    );
    this.addSettingSpecs(Exhibit.NumericRangeFacet._settingSpecs);

    this._dom = null;
    this._ranges = [];
    
    this._onRootItemsChanged = function() {
        if (typeof self._rangeIndex !== "undefined") {
            delete self._rangeIndex;
        }
    };
    Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
};

/**
 * @private
 * @constant
 */
Exhibit.NumericRangeFacet._settingSpecs = {
    "scroll":           { "type": "boolean", "defaultValue": true },
    "height":           { "type": "text" },
    "interval":         { "type": "float", "defaultValue": 10 },
    "collapsible":      { "type": "boolean", "defaultValue": false },
    "collapsed":        { "type": "boolean", "defaultValue": false }
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.NumericRangeFacet}
 */
Exhibit.NumericRangeFacet.create = function(configuration, containerElmt, uiContext) {
    var uiContext, facet;
    uiContext = Exhibit.UIContext.create(configuration, uiContext);
    facet = new Exhibit.NumericRangeFacet(
        containerElmt,
        uiContext
    );
    
    Exhibit.NumericRangeFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();

    return facet;
};

/**
 * @static
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.NumericRangeFacet}
 */
Exhibit.NumericRangeFacet.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, uiContext, facet, expressionString;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    uiContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    facet = new Exhibit.NumericRangeFacet(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ? containerElmt : configElmt, 
        uiContext
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, facet.getSettingSpecs(), facet._settings);
    
    try {
        expressionString = Exhibit.getAttribute(configElmt, "expression");
        if (expressionString !== null && expressionString.length > 0) {
            facet.setExpressionString(expressionString);
            facet.setExpression(Exhibit.ExpressionParser.parse(expressionString));
        }
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%facets.error.configuration", "NumericRangeFacet"));
    }
    Exhibit.NumericRangeFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @static
 * @private
 * @param {Exhibit.NumericRangeFacet} facet
 * @param {Object} configuration
 */
Exhibit.NumericRangeFacet._configure = function(facet, configuration) {
    var segment, property;
    Exhibit.SettingsUtilities.collectSettings(configuration, facet.getSettingSpecs(), facet._settings);
    
    if (typeof configuration.expression !== "undefined") {
        facet.setExpression(Exhibit.ExpressionParser.parse(configuration.expression));
        facet.setExpressionString(configuration.expression);
    }
    
    if (typeof facet._settings.facetLabel === "undefined") {
        if (facet.getExpression() !== null && facet.getExpression().isPath()) {
            segment = facet.getExpression().getPath().getLastSegment();
            property = facet.getUIContext().getDatabase().getProperty(segment.property);
            if (property !== null) {
                facet._settings.facetLabel = segment.forward ? property.getLabel() : property.getReverseLabel();
            }
        }
    }
    
    if (facet._settings.collapsed) {
        facet._settings.collapsible = true;
    }
};

/**
 *
 */
Exhibit.NumericRangeFacet.prototype.dispose = function() {
    this.getUIContext().getCollection().removeFacet(this);
    Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
    this._dom = null;
    this._ranges = null;
    this._rangeIndex = null;
    this._dispose();
};

/**
 * @returns {Boolean}
 */
Exhibit.NumericRangeFacet.prototype.hasRestrictions = function() {
    return this._ranges.length > 0;
};

/**
 *
 */
Exhibit.NumericRangeFacet.prototype.clearAllRestrictions = function() {
    Exhibit.jQuery(this.getContainer()).trigger("onBeforeFacetReset.exhibit");
    if (this._ranges.length > 0) {
        this._ranges = [];
        this._notifyCollection();
    }
};

/**
 * @param {Array} restrictions
 */
Exhibit.NumericRangeFacet.prototype.applyRestrictions = function(restrictions) {
    this._ranges = restrictions;
    this._notifyCollection();
};

/**
 * @param {Numeric} from
 * @param {Numeric} to
 * @param {Boolean} selected
 * @param {Array} ranges
 * @returns {Array}
 */
Exhibit.NumericRangeFacet.prototype.setRange = function(from, to, selected, ranges) {
    var i, range;
    if (selected) {
        for (i = 0; i < ranges.length; i++) {
            range = ranges[i];
            if (range.from === from && range.to === to) {
                return;
            }
        }
        ranges.push({ "from": from, "to": to });
    } else {
        for (i = 0; i < ranges.length; i++) {
            range = ranges[i];
            if (range.from === from && range.to === to) {
                ranges.splice(i, 1);
                break;
            }
        }
    }
    return ranges;
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.NumericRangeFacet.prototype.restrict = function(items) {
    var path, database, set, i, range;
    if (this._ranges.length === 0) {
        return items;
    } else if (this.getExpression().isPath()) {
        path = this.getExpression().getPath();
        database = this.getUIContext().getDatabase();
        
        set = new Exhibit.Set();
        for (i = 0; i < this._ranges.length; i++) {
            range = this._ranges[i];
            set.addSet(path.rangeBackward(range.from, range.to, false, items, database).values);
        }
        return set;
    } else {
        this._buildRangeIndex();
        
        set = new Exhibit.Set();
        for (i = 0; i < this._ranges.length; i++) {
            range = this._ranges[i];
            this._rangeIndex.getSubjectsInRange(range.from, range.to, false, set, items);
        }
        return set;
    }
};

/**
 * @param {Exhibit.Set} items
 */
Exhibit.NumericRangeFacet.prototype.update = function(items) {
    Exhibit.jQuery(this._dom.valuesContainer).hide().empty();
    
    this._reconstruct(items);
    Exhibit.jQuery(this._dom.valuesContainer).show();
};

/**
 * @private
 * @param {Exhibit.Set} items
 * @returns {Array}
 */
Exhibit.NumericRangeFacet.prototype._reconstruct = function(items) {
    var self, ranges, rangeIndex, computeItems, database, path, propertyId, property, min, max, x, range, i, range2, facetHasSelection, containerDiv, constructFacetItemFunction, makeFacetValue;
    self = this;
    ranges = [];

    if (this.getExpression().isPath()) {
        database = this.getUIContext().getDatabase();
        path = this.getExpression().getPath();
        
        propertyID = path.getLastSegment().property;
        property = database.getProperty(propertyID);
        if (property === null) {
            return null;
        }
       
        rangeIndex = property.getRangeIndex();
        countItems = function(range) {
            return path.rangeBackward(range.from, range.to, false, items, database).values.size();
        }
    } else {
        this._buildRangeIndex();
        
        rangeIndex = this._rangeIndex;
        countItems = function(range) {
            return rangeIndex.getSubjectsInRange(range.from, range.to, false, null, items).size();
        }
    }
    
    min = rangeIndex.getMin();
    max = rangeIndex.getMax();
    min = Math.floor(min / this._settings.interval) * this._settings.interval;
    max = Math.ceil((max + this._settings.interval) / this._settings.interval) * this._settings.interval;
    
    for (x = min; x < max; x += this._settings.interval) {
        range = { 
            from:       x, 
            to:         x + this._settings.interval, 
            selected:   false
        };
        range.count = countItems(range);
        
        for (i = 0; i < this._ranges.length; i++) {
            range2 = this._ranges[i];
            if (range2.from === range.from && range2.to === range.to) {
                range.selected = true;
                facetHasSelection = true;
                break;
            }
        }
        
        ranges.push(range);
    }
    
    facetHasSelection = this._ranges.length > 0;
    containerDiv = this._dom.valuesContainer;
    Exhibit.jQuery(containerDiv).hide();
    constructFacetItemFunction = Exhibit.FacetUtilities[this._settings.scroll ? "constructFacetItem" : "constructFlowingFacetItem"];
    makeFacetValue = function(from, to, count, selected) {
        var onSelect, onSelectOnly, elmt;
        onSelect = function(evt) {
            self._toggleRange(from, to, selected, false);
            evt.preventDefault();
            evt.stopPropagation();
        };
        onSelectOnly = function(evt) {
            self._toggleRange(from, to, selected, !(evt.ctrlKey || evt.metaKey));
            evt.preventDefault();
            evt.stopPropagation();
        };
        elmt = constructFacetItemFunction(
            Exhibit._("%facets.numeric.rangeShort", from, to), 
            count, 
            null,
            selected, 
            facetHasSelection,
            onSelect,
            onSelectOnly,
            self.getUIContext()
        );
        Exhibit.jQuery(containerDiv).append(elmt);
    };
        
    for (i = 0; i < ranges.length; i++) {
        range = ranges[i];
        if (range.selected || range.count > 0) {
            makeFacetValue(range.from, range.to, range.count, range.selected);
        }
    }
    
    Exhibit.jQuery(containerDiv).show();
    
    this._dom.setSelectionCount(this._ranges.length);
};

/**
 * @private
 */
Exhibit.NumericRangeFacet.prototype._notifyCollection = function() {
    this.getUIContext().getCollection().onFacetUpdated(this);
};

/**
 * @private
 */
Exhibit.NumericRangeFacet.prototype._initializeUI = function() {
    var self = this;
    this._dom = Exhibit.FacetUtilities[this._settings.scroll ? "constructFacetFrame" : "constructFlowingFacetFrame"](
		this,
        this.getContainer(),
        this.getLabel(),
        function(elmt, evt, target) { self._clearSelections(); },
        this.getUIContext(),
        this._settings.collapsible,
        this._settings.collapsed
    );
    
    if (typeof this._settings.height !== "undefined" && this._settings.height !== null) {
        Exhibit.jQuery(this._dom.valuesContainer).css("height", this._settings.height);
    }
};

/**
 * @private
 * @param {Numeric} from
 * @param {Numeric} to
 * @param {Boolean} wasSelected
 * @param {Boolean} singleSelection
 */
Exhibit.NumericRangeFacet.prototype._toggleRange = function(from, to, wasSelected, singleSelection) {
    var self, label, wasOnlyThingSelected, newRestrictions, oldRestrictions;
    self = this;
    label = Exhibit._("%facets.numeric.rangeWords", from, to);
    wasOnlyThingSelected = (this._ranges.length === 1 && wasSelected);
    if (singleSelection && !wasOnlyThingSelected) {
        newRestrictions = { "ranges": [ { from: from, to: to } ] };
        Exhibit.History.pushComponentState(
            this,
            Exhibit.Facet.getRegistryKey(),
            newRestrictions,
            Exhibit._("%facets.facetSelectOnlyActionTitle", label, this.getLabel()),
            true
        );
    } else {
        oldRestrictions = [].concat(this._ranges);
        newRestrictions = { "ranges": self.setRange(from, to, !wasSelected, oldRestrictions) };
        Exhibit.History.pushComponentState(
            this,
            Exhibit.Facet.getRegistryKey(),
            newRestrictions,
            Exhibit._(wasSelected ? "%facets.facetUnselectActionTitle" : "%facets.facetSelectActionTitle", label, this.getLabel()),
            true
        );
    }
};

/**
 * @private
 */
Exhibit.NumericRangeFacet.prototype._clearSelections = function() {
    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        this.exportEmptyState(),
        Exhibit._("%facets.facetClearSelectionsActionTitle", this.getLabel()),
        true
    );
};

/**
 * @private
 */
Exhibit.NumericRangeFacet.prototype._buildRangeIndex = function() {
    var expression, database, getter;
    if (typeof this._rangeIndex !== "undefined") {
        expression = this.getExpression();
        database = this.getUIContext().getDatabase();
        getter = function(item, f) {
            expression.evaluateOnItem(item, database).values.visit(function(value) {
                if (typeof value !== "number") {
                    value = parseFloat(value);
                }
                if (!isNaN(value)) {
                    f(value);
                }
            });
        };
    
        this._rangeIndex = new Exhibit.Database._RangeIndex(
            this.getUIContext().getCollection().getAllItems(),
            getter
        );    
    }
};

/**
 *
 */
Exhibit.NumericRangeFacet.prototype.exportEmptyState = function() {
    return this._exportState(true);
};

/**
 *
 */
Exhibit.NumericRangeFacet.prototype.exportState = function() {
    return this._exportState(false);
};

/**
 * @param {Boolean} empty
 * @returns {Object}
 */
Exhibit.NumericRangeFacet.prototype._exportState = function(empty) {
    var r = [];

    if (!empty) {
        r = this._ranges;
    }

    return {
        "ranges": r
    };
};

/**
 * @param {Object} state
 * @param {Array} state.ranges
 */
Exhibit.NumericRangeFacet.prototype.importState = function(state) {
    if (this.stateDiffers(state)) {
        if (state.ranges.length === 0) {
            this.clearAllRestrictions();
        } else {
            this.applyRestrictions(state.ranges);
        }
    }
};

/**
 * @param {Object} state
 * @param {Array} state.ranges
 */
Exhibit.NumericRangeFacet.prototype.stateDiffers = function(state) {
    var rangeStartCount, stateStartCount, stateSet;

    stateStartCount = state.ranges.length;
    rangeStartCount = this._ranges.length;

    if (stateStartCount !== rangeStartCount) {
        return true;
    } else {
        stateSet = new Exhibit.Set(state.ranges);
        stateSet.addSet(this._ranges);
        if (stateSet.size() !== stateStartCount) {
            return true;
        }
    }

    return false;
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheria.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.AlphaRangeFacet = function(containerElmt, uiContext) {
    var self = this;
    Exhibit.jQuery.extend(this, new Exhibit.Facet("alpharange", containerElmt, uiContext));
    this.addSettingSpecs(Exhibit.AlphaRangeFacet._settingSpecs);

    this._dom = null;
    this._ranges = [];
    
    this._onRootItemsChanged = function() {
        if (typeof self._rangeIndex !== "undefined") {
            delete self._rangeIndex;
        }
    };
    Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
};

/**
 * @private
 * @constant
 */
Exhibit.AlphaRangeFacet._settingSpecs = {
    "scroll":           { type: "boolean", defaultValue: true },
    "height":           { type: "text" },
    "interval":         { type: "int", defaultValue: 7 },
    "collapsible":      { type: "boolean", defaultValue: false },
    "collapsed":        { type: "boolean", defaultValue: false }
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.AlphaRangeFacet}
 */
Exhibit.AlphaRangeFacet.create = function(configuration, containerElmt, uiContext) {
    var uiContext, facet;
    uiContext = Exhibit.UIContext.create(configuration, uiContext);
    facet = new Exhibit.AlphaRangeFacet(
        containerElmt,
        uiContext
    );
    
    Exhibit.AlphaRangeFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @static
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.AlphaRangeFacet}
 */
Exhibit.AlphaRangeFacet.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, uiContext, facet, expressionString;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    uiContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    facet = new Exhibit.AlphaRangeFacet(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ? containerElmt : configElmt,
        uiContext
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, facet.getSettingSpecs(), facet._settings);
    
    try {
        expressionString = Exhibit.getAttribute(configElmt, "expression");
        if (expressionString !== null && expressionString.length > 0) {
            facet.setExpressionString(expressionString);
            facet.setExpression(Exhibit.ExpressionParser.parse(expressionString));
        }
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%facets.error.configuration", "AlphaRangeFacet"));
    }
    Exhibit.AlphaRangeFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @static
 * @private
 * @param {Exhibit.AlphaRangeFacet} facet
 * @param {Object} configuration
 */
Exhibit.AlphaRangeFacet._configure = function(facet, configuration) {
    var segment, property;
    Exhibit.SettingsUtilities.collectSettings(configuration, facet.getSettingSpecs(), facet._settings);
    
    if (typeof configuration.expression !== "undefined") {
        facet.setExpressionString(configuration.expression);
        facet.setExpression(Exhibit.ExpressionParser.parse(configuration.expression));
    }
    
    if (typeof facet._settings.facetLabel === "undefined") {
        if (facet.getExpression() !== null && facet.getExpression().isPath()) {
            segment = facet.getExpression().getPath().getLastSegment();
            property = facet.getUIContext().getDatabase().getProperty(segment.property);
            if (property !== null) {
                facet._settings.facetLabel = segment.forward ? property.getLabel() : property.getReverseLabel();
            }
        }
    }
    
    if (facet._settings.collapsed) {
        facet._settings.collapsible = true;
    }
};

/**
 *
 */
Exhibit.AlphaRangeFacet.prototype.dispose = function() {
    this.getUIContext().getCollection().removeFacet(this);
    Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
    this._dom = null;
    this._ranges = null;
    this._rangeIndex = null;
    this._dispose();
};

/**
 * @returns {Boolean}
 */
Exhibit.AlphaRangeFacet.prototype.hasRestrictions = function() {
  return this._ranges.length > 0; 
};

/**
 *
 */
Exhibit.AlphaRangeFacet.prototype.clearAllRestrictions = function() {
    Exhibit.jQuery(this.getContainer()).trigger("onBeforeFacetReset.exhibit");
    if (this._ranges.length > 0) {
        this._ranges = [];
        this._notifyCollection();
    }
};

/**
 * @param {Array} restrictions
 */
Exhibit.AlphaRangeFacet.prototype.applyRestrictions = function(restrictions) {
    this._ranges = restrictions;
    this._notifyCollection();
};

/**
 * @param {String} from
 * @param {String} to
 * @param {Boolean} selected
 * @param {Array} ranges
 * @returns {Array}
 */
Exhibit.AlphaRangeFacet.prototype.setRange = function(from, to, selected, ranges) {
    var i, range;
    if (selected) {
        for (i = 0; i < ranges.length; i++) {
            range = ranges[i];
            if (range.from === from && range.to === to) {
                return;
            }
        }
        ranges.push({ "from": from, "to": to });
    } else {
        for (i = 0; i < ranges.length; i++) {
            range = ranges[i];
            if (range.from === from && range.to === to) {
                ranges.splice(i, 1);
                break;
            }
        }
    }
    return ranges;
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.AlphaRangeFacet.prototype.restrict = function(items) {
    var path, database, set, i, range;
    if (this._ranges.length === 0) {
        return items;
    } else {
        this._buildRangeIndex();
        
        set = new Exhibit.Set();
        for (i = 0; i < this._ranges.length; i++) {
            range = this._ranges[i];
            this._rangeIndex.getSubjectsInRange(range.from, String.fromCharCode(range.to.charCodeAt(0)+1), true, set, items);
        }
        return set;
    }
};

/**
 * @param {Exhibit.Set} items
 */
Exhibit.AlphaRangeFacet.prototype.update = function(items) {
    Exhibit.jQuery(this._dom.valuesContainer).hide().empty();
    
    this._reconstruct(items);
    Exhibit.jQuery(this._dom.valuesContainer).show();
};

/**
 * @private
 * @param {Exhibit.Set} items
 * @returns {Array}
 */
Exhibit.AlphaRangeFacet.prototype._reconstruct = function(items) {
    var self, ranges, rangeIndex, computeItems, countItems, alphaList, alphaInList, x, y, alphaChar, range, i, range2, facetHasSelection, containerDiv, constructFacetItemFunction, makeFacetValue;
    self = this;
    ranges = [];
    
    this._buildRangeIndex(); 
    rangeIndex = this._rangeIndex;

    countItems = function(range) {
        return rangeIndex.getSubjectsInRange(range.from, String.fromCharCode(range.to.charCodeAt(0)+1), true, null, items).size();
    };

    // Create list of alpha characters
    alphaList = [];
        
    alphaInList = function(a) {
        for (x in alphaList) {
            if (alphaList.hasOwnProperty(x)) {
                if (alphaList[x] === a) {
                    return true;
                }
            }
        }
        return false;
    };
    
    for (y = 0; y < rangeIndex.getCount(); y++) {
        alphaChar = rangeIndex._pairs[y].value.substr(0,1).toUpperCase();
        if (!alphaInList(alphaChar)) {
            alphaList.push(alphaChar);
        }
    }

    for (x = 0; x < alphaList.length; x += this._settings.interval) {
        range = { 
            "from":       alphaList[x], 
            "to":         alphaList[(x + this._settings.interval >= alphaList.length ? alphaList.length-1 : x + this._settings.interval - 1)],
            "selected":   false
        };
        range.count = countItems(range);
        
        for (i = 0; i < this._ranges.length; i++) {
            range2 = this._ranges[i];
            if (range2.from === range.from && range2.to === range.to) {
                range.selected = true;
                facetHasSelection = true;
                break;
            }
        }
        
        ranges.push(range);
    }
    
    facetHasSelection = this._ranges.length > 0;
    containerDiv = this._dom.valuesContainer;
    Exhibit.jQuery(containerDiv).hide();
    constructFacetItemFunction = Exhibit.FacetUtilities[this._settings.scroll ? "constructFacetItem" : "constructFlowingFacetItem"];
    makeFacetValue = function(from, to, count, selected) {
        var onSelect, onSelectOnly, elmt;
        onSelect = function(evt) {
            self._toggleRange(from, to, selected, false);
            evt.preventDefault();
            evt.stopPropagation();
        };
        onSelectOnly = function(evt) {
            self._toggleRange(from, to, selected, !(evt.ctrlKey || evt.metaKey));
            evt.preventDefault();
            evt.stopPropagation();
        };
        var elmt = constructFacetItemFunction(
            Exhibit._("%facets.alpha.rangeShort", from.substr(0, 1), to.substr(0, 1)),
            count, 
            null,
            selected, 
            facetHasSelection,
            onSelect,
            onSelectOnly,
            self.getUIContext()
        );
        Exhibit.jQuery(containerDiv).append(elmt);
    };
        
    for (i = 0; i < ranges.length; i++) {
        range = ranges[i];
        if (range.selected || range.count > 0) {
            makeFacetValue(range.from, range.to, range.count, range.selected);
        }
    }
    Exhibit.jQuery(containerDiv).show();
    
    this._dom.setSelectionCount(this._ranges.length);
};

/**
 * @private
 */
Exhibit.AlphaRangeFacet.prototype._notifyCollection = function() {
    this.getUIContext().getCollection().onFacetUpdated(this);
};

/**
 * @private
 */
Exhibit.AlphaRangeFacet.prototype._initializeUI = function() {
    var self = this;
    this._dom = Exhibit.FacetUtilities[this._settings.scroll ? "constructFacetFrame" : "constructFlowingFacetFrame"](
		this,
        this.getContainer(),
        this.getLabel(),
        function(elmt, evt, target) { self._clearSelections(); },
        this.getUIContext(),
        this._settings.collapsible,
        this._settings.collapsed
    );
    
    if (typeof this._settings.height !== "undefined" && this._settings.height !== null) {
        Exhibit.jQuery(this._dom.valuesContainer).css("height", this._settings.height);
    }
};

/**
 * @private
 * @param {String} from
 * @param {String} to
 * @param {Boolean} wasSelected
 * @param {Boolean} singleSelection
 */
Exhibit.AlphaRangeFacet.prototype._toggleRange = function(from, to, wasSelected, singleSelection) {
    var self, label, wasOnlyThingSelected, newRestrictions, oldRestrictions;
    self = this;
    label = Exhibit._("%facets.alpha.rangeWords", from, to);
    wasOnlyThingSelected = (this._ranges.length === 1 && wasSelected);
    if (singleSelection && !wasOnlyThingSelected) {
        newRestrictions = { "ranges": [ { from: from, to: to } ] };
        Exhibit.History.pushComponentState(
            this,
            Exhibit.Facet.getRegistryKey(),
            newRestrictions,
            Exhibit._("%facets.facetSelectOnlyActionTitle", label, this.getLabel()),
            true
        );
    } else {
        oldRestrictions = [].concat(this._ranges);
        newRestrictions = { "ranges": self.setRange(from, to, !wasSelected, oldRestrictions) };
        Exhibit.History.pushComponentState(
            this,
            Exhibit.Facet.getRegistryKey(),
            newRestrictions,
            Exhibit._(wasSelected ? "%facets.facetUnselectActionTitle" : "%facets.facetSelectActionTitle", label, this.getLabel()),
            true
        );
    }
};

/**
 * @private
 */
Exhibit.AlphaRangeFacet.prototype._clearSelections = function() {
    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        this.exportEmptyState(),
        Exhibit._("%facets.facetClearSelectionsActionTitle", this.getLabel()),
        true
    );
};

/**
 * @private
 */
Exhibit.AlphaRangeFacet.prototype._buildRangeIndex = function() {
    var expression, database, segment, property, getter
    if (typeof this._rangeIndex === "undefined") {
        expression = this.getExpression();
        database = this.getUIContext().getDatabase();
        
        segment = expression.getPath().getLastSegment();
        property = database.getProperty(segment.property);
        
        getter = function(item, f) {
            database.getObjects(item, property.getID(), null, null).visit(function(value) {
                f(value.toUpperCase());
            });
        };

        this._rangeIndex = new Exhibit.Database.RangeIndex(
            this.getUIContext().getCollection().getAllItems(),
            getter
        ); 
    }
};

/**
 *
 */
Exhibit.AlphaRangeFacet.prototype.exportEmptyState = function() {
    return this._exportState(true);
};

/**
 *
 */
Exhibit.AlphaRangeFacet.prototype.exportState = function() {
    return this._exportState(false);
};

/**
 * @param {Boolean} empty
 * @returns {Object}
 */
Exhibit.AlphaRangeFacet.prototype._exportState = function(empty) {
    var r = [];

    if (!empty) {
        r = this._ranges;
    }

    return {
        "ranges": r
    };
};

/**
 * @param {Object} state
 * @param {Array} state.ranges
 */
Exhibit.AlphaRangeFacet.prototype.importState = function(state) {
    if (this.stateDiffers(state)) {
        if (state.ranges.length === 0) {
            this.clearAllRestrictions();
        } else {
            this.applyRestrictions(state.ranges);
        }
    }
};

/**
 * @param {Object} state
 * @param {Array} state.ranges
 */
Exhibit.AlphaRangeFacet.prototype.stateDiffers = function(state) {
    var rangeStartCount, stateStartCount, stateSet;

    stateStartCount = state.ranges.length;
    rangeStartCount = this._ranges.length;

    if (stateStartCount !== rangeStartCount) {
        return true;
    } else {
        stateSet = new Exhibit.Set(state.ranges);
        stateSet.addSet(this._ranges);
        if (stateSet.size() !== stateStartCount) {
            return true;
        }
    }

    return false;
};
/**
 * @fileOverview Text search facet functions and UI
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.TextSearchFacet = function(containerElmt, uiContext) {
    var self = this;
    Exhibit.jQuery.extend(this, new Exhibit.Facet("text", containerElmt, uiContext));
    this.addSettingSpecs(Exhibit.TextSearchFacet._settingSpecs);

    this._text = null;
    this._dom = null;
    this._timerID = null;
    
    this._onRootItemsChanged = function(evt) {
        if (typeof self._itemToValue !== "undefined") {
            delete self._itemToValue;
        }
    };
    Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
};

/**
 * @private
 * @constant
 */ 
Exhibit.TextSearchFacet._settingSpecs = {
    "queryParamName":   { "type": "text" },
    "requiresEnter":    { "type": "boolean", "defaultValue": false}
};

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.TextSearchFacet}
 */
Exhibit.TextSearchFacet.create = function(configuration, containerElmt, uiContext) {
    var uiContext = Exhibit.UIContext.create(configuration, uiContext);
    var facet = new Exhibit.TextSearchFacet(containerElmt, uiContext);
    
    Exhibit.TextSearchFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.TextSearchFacet}
 */
Exhibit.TextSearchFacet.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration = Exhibit.getConfigurationFromDOM(configElmt);
    var uiContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    var facet = new Exhibit.TextSearchFacet(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ? containerElmt : configElmt, 
        uiContext
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, facet.getSettingSpecs(), facet._settings);
    
    try {
        var s = Exhibit.getAttribute(configElmt, "expressions");
        if (typeof s !== "undefined" && s !== null && s.length > 0) {
            facet.setExpressionString(s);
            facet.setExpression(Exhibit.ExpressionParser.parseSeveral(s));
        }
        
        var query = Exhibit.getAttribute(configElmt, "query");
        if (typeof query !== "undefined" && query !== null && query.length > 0) {
            facet._text = query;
        }
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%facets.error.configuration", "TextSearchFacet"));
    }
    Exhibit.TextSearchFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @param {Exhibit.TextSearchFacet} facet
 * @param {Object} configuration
 */
Exhibit.TextSearchFacet._configure = function(facet, configuration) {
    var expressions, expressionsStrings;
    Exhibit.SettingsUtilities.collectSettings(configuration, facet.getSettingSpecs(), facet._settings);
    
    if (typeof configuration.expressions !== "undefined") {
        expressions = [];
        expressionsStrings = [];
        for (var i = 0; i < configuration.expressions.length; i++) {
            expressionsStrings.push(configuration.expressions[i]);
            expressions.push(Exhibit.ExpressionParser.parse(configuration.expressions[i]));
        }
        facet.setExpressionString(expressionsStrings.join(",").replace(/ /g, ""));
        facet.setExpression(expressions);
    }
    if (typeof configuration.selection !== "undefined") {
        var selection = configuration.selection;
        for (var i = 0; i < selection.length; i++) {
            facet._valueSet.add(selection[i]);
        }
    }
    if (typeof configuration.query !== "undefined") {
        facet._text = configuration.query;
    }
    if (typeof facet._settings.queryParamName !== "undefined") {
        var params = Exhibit.parseURLParameters();
        if (typeof params[facet._settings.queryParamName] !== "undefined") {
            facet._text = params[facet._settings.queryParamName];
        }
    }
};

/**
 *
 */
Exhibit.TextSearchFacet.prototype.dispose = function() {
    this.getUIContext().getCollection().removeFacet(this);
    Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
    
    this._text = null;
    this._dom = null;
    this._itemToValue = null;
    this._timerID = null;

    this._dispose();
};

/**
 * @returns {Boolean}
 */
Exhibit.TextSearchFacet.prototype.hasRestrictions = function() {
    return this._text !== null;
};

/**
 *
 */
Exhibit.TextSearchFacet.prototype.clearAllRestrictions = function() {
    Exhibit.jQuery(this.getContainer()).trigger("onBeforeFacetReset.exhibit");
    var restrictions = this._text;
    if (this._text !== null) {
        this._text = null;
        this._notifyCollection();
    }
    Exhibit.jQuery(this._dom.input).val("");
};

/**
 * @param {Object} restrictions
 * @param {String} restrictions.text
 */
Exhibit.TextSearchFacet.prototype.applyRestrictions = function(restrictions) {
    this.setText(restrictions.text);
};

/**
 * @param {String} text
 */
Exhibit.TextSearchFacet.prototype.setText = function(text) {
    if (typeof text !== "undefined" && text !== null) {
        text = text.trim();
        Exhibit.jQuery(this._dom.input).val(text);
        
        text = text.length > 0 ? text : null;
    } else {
        Exhibit.jQuery(this._dom.input).val("");
    }
    
    if (text !== this._text) {
        this._text = text;
        this._notifyCollection();
    }
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.TextSearchFacet.prototype.restrict = function(items) {
    var set, itemToValue, text;
    if (this._text === null) {
        return items;
    } else {
        Exhibit.jQuery(this.getContainer()).trigger(
            "onTextSearchFacetSearch.exhibit",
            [ this._text ]
        );
        this._buildMaps();
        
        set = new Exhibit.Set();
        itemToValue = this._itemToValue;
        text = this._text.toLowerCase();
        
        items.visit(function(item) {
            var values, v;
            if (typeof itemToValue[item] !== "undefined") {
                values = itemToValue[item];
                for (v = 0; v < values.length; v++) {
                    if (values[v].indexOf(text) >= 0) {
                        set.add(item);
                        break;
                    }
                }
            }
        });
        return set;
    }
};

/**
 * @param {Exhibit.Set} items
 */
Exhibit.TextSearchFacet.prototype.update = function(items) {
    // nothing to do
};

/**
 *
 */
Exhibit.TextSearchFacet.prototype._notifyCollection = function() {
    this.getUIContext().getCollection().onFacetUpdated(this);
};

/**
 *
 */
Exhibit.TextSearchFacet.prototype._initializeUI = function() {
    var self = this;
    this._dom = Exhibit.TextSearchFacet.constructFacetFrame(this.getContainer(), this._settings.facetLabel);

    if (this._text !== null) {
        Exhibit.jQuery(this._dom.input).val(this._text);
    }

    Exhibit.jQuery(this._dom.input).bind("keyup", function(evt) {
        self._onTextInputKeyUp(evt);
    });
};

/**
 * @param {Element} div
 * @param {String} facetLabel
 */
Exhibit.TextSearchFacet.constructFacetFrame = function(div, facetLabel) {
    if (typeof facetLabel !== "undefined"
        && facetLabel !== null
        && facetLabel !== "") {
        return Exhibit.jQuery.simileDOM("string",
            div,
            '<div class="exhibit-facet-header">' +
                '<span class="exhibit-facet-header-title">' + facetLabel + '</span>' +
            '</div>' +
            '<div class="exhibit-text-facet"><input type="text" id="input"></div>'
        );
    } else {
        return Exhibit.jQuery.simileDOM(
            "string",
            div,
            '<div class="exhibit-text-facet"><input type="text" id="input"></div>'
        );
    }
};

/**
 * @param {jQuery.Event} evt
 */
Exhibit.TextSearchFacet.prototype._onTextInputKeyUp = function(evt) {
    var self, newText;
    if (this._timerID !== null) {
        window.clearTimeout(this._timerID);
    }
    self = this;
    if (this._settings.requiresEnter === false) {
        this._timerID = window.setTimeout(function() {
            self._onTimeout();
        }, 500);
    } else {
        newText = Exhibit.jQuery(this._dom.input).val().trim(); 
        if (newText.length === 0 || evt.which === 13) { // arbitrary
            this._timerID = window.setTimeout(function() {
                self._onTimeout();
            }, 0);
        }
    }
};

/**
 *
 */
Exhibit.TextSearchFacet.prototype._onTimeout = function() {
    var newText, self, oldText;

    this._timerID = null;
    
    newText = Exhibit.jQuery(this._dom.input).val().trim();
    if (newText.length === 0) {
        newText = null;
    }
    
    if (newText !== this._text) {
        self = this;
        oldText = this._text;
        
        Exhibit.History.pushComponentState(
            this,
            Exhibit.Facet._registryKey,
            { "text": newText },
            newText !== null ?
                Exhibit._("%facets.facetTextSearchActionTitle", newText) :
                Exhibit._("%facets.facetClearTextSearchActionTitle"),
            true
        );
    }
};

/**
 *
 */
Exhibit.TextSearchFacet.prototype._buildMaps = function() {
    var itemToValue, allItems, database, expressions, propertyIDs;
    if (typeof this._itemToValue === "undefined") {
        itemToValue = {};
        allItems = this.getUIContext().getCollection().getAllItems();
        database = this.getUIContext().getDatabase();
        
        if (this.getExpression().length > 0) {
            expressions = this.getExpression();
            allItems.visit(function(item) {
                var values, x, expression;
                values = [];
                for (x = 0; x < expressions.length; x++) {
                    expression = expressions[x];
                    expression.evaluateOnItem(item, database).values.visit(function(v) { values.push(v.toLowerCase()); });
                }
                itemToValue[item] = values;
            });
        } else {
            propertyIDs = database.getAllProperties();
            allItems.visit(function(item) {
                var values, p;
                values = [];
                for (p = 0; p < propertyIDs.length; p++) {
                    database.getObjects(item, propertyIDs[p]).visit(function(v) { values.push(v.toLowerCase()); });
                }
                itemToValue[item] = values;
            });
        }
        
        this._itemToValue = itemToValue;
    }
};

/**
 * @returns {Object}
 */
Exhibit.TextSearchFacet.prototype.exportState = function() {
    return this._exportState(false);
};

/**
 * @returns {Object}
 */
Exhibit.TextSearchFacet.prototype.exportEmptyState = function() {
    return this._exportState(true);
};

/**
 * @private
 * @param {Boolean} empty
 @ returns {Object}
 */
Exhibit.TextSearchFacet.prototype._exportState = function(empty) {
    return {
        "text": empty ? null : this._text
    };
};

/**
 * @param {Object} state
 * @param {String} state.text
 */
Exhibit.TextSearchFacet.prototype.importState = function(state) {
    this.applyRestrictions(state);
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @author Brice Sommercal
 */

/**
 * @class
 * @constructor
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.HierarchicalFacet = function(containerElmt, uiContext) {
    var self = this;
    Exhibit.jQuery.extend(this, new Exhibit.Facet("hierarchical", containerElmt, uiContext));
    this.addSettingSpecs(Exhibit.HierarchicalFacet._settingSpecs);

    this._colorCoder = null;
    this._uniformGroupingExpression = null;
    this._selections = [];
    this._expanded = {};
    this._dom = null;
    
    this._onRootItemsChanged = function() {
        if (typeof self._cache !== "undefined") {
            delete self._cache;
        }
    };
    Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );
};

/**
 * @private
 * @constant
 */
Exhibit.HierarchicalFacet._settingSpecs = {
    "fixedOrder":       { "type": "text" },
    "sortMode":         { "type": "text", "defaultValue": "value" },
    "sortDirection":    { "type": "text", "defaultValue": "forward" },
    "othersLabel":      { "type": "text" },
    "scroll":           { "type": "boolean", "defaultValue": true },
    "height":           { "type": "text" },
    "colorCoder":       { "type": "text", "defaultValue": null },
    "collapsible":      { "type": "boolean", "defaultValue": false },
    "collapsed":        { "type": "boolean", "defaultValue": false }
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.HierarchicalFacet}
 */
Exhibit.HierarchicalFacet.create = function(configuration, containerElmt, uiContext) {
    var uiContext, facet;
    uiContext = Exhibit.UIContext.create(configuration, uiContext);
    facet = new Exhibit.HierarchicalFacet(containerElmt, uiContext);
    
    Exhibit.HierarchicalFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @static
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.HierarchicalFacet}
 */
Exhibit.HierarchicalFacet.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, uiContext, facet, expressionString, uniformGroupingString, selection, i, s;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    uiContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    facet = new Exhibit.HierarchicalFacet(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ? containerElmt : configElmt,
        uiContext
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, facet.getSettingSpecs(), facet._settings);
    
    try {
        expressionString = Exhibit.getAttribute(configElmt, "expression");
        if (expressionString !== null && expressionString.length > 0) {
            facet.setExpressionString(expressionString);
            facet.setExpression(Exhibit.ExpressionParser.parse(expressionString));
        }
        
        uniformGroupingString = Exhibit.getAttribute(configElmt, "uniformGrouping");
        if (uniformGroupingString !== null && uniformGroupingString.length > 0) {
            facet._uniformGroupingExpression = Exhibit.ExpressionParser.parse(uniformGroupingString);
        }
        
        selection = Exhibit.getAttribute(configElmt, "selection", ";");
        if (selection !== null && selection.length > 0) {
            for (i = 0; i < selection.length; i++) {
                s = selection[i];
                facet._selections = facet._internalAddSelection({ "value": s, "selectOthers": false });
            }
        }
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%facets.error.configuration", "HierarchicalFacet"));
    }
    Exhibit.HierarchicalFacet._configure(facet, configuration);
    
    facet._initializeUI();
    uiContext.getCollection().addFacet(facet);
    facet.register();
    
    return facet;
};

/**
 * @static
 * @private
 * @param {Exhibit.HierarchicalFacet} facet
 * @param {Object} configuration
 */
Exhibit.HierarchicalFacet._configure = function(facet, configuration) {
    var selection, i, segment, property, values, orderMap;

    Exhibit.SettingsUtilities.collectSettings(configuration, facet.getSettingSpecs(), facet._settings);
    
    if (typeof configuration.expression !== "undefined") {
        facet.setExpressionString(configuration.expression);
        facet.setExpression(Exhibit.ExpressionParser.parse(configuration.expression));
    }

    if (typeof configuration.uniformGrouping !== "undefined") {
        facet._uniformGroupingExpression = Exhibit.ExpressionParser.parse(configuration.uniformGrouping);
    }

    if (typeof configuration.selection !== "undefined") {
        selection = configuration.selection;
        for (i = 0; i < selection.length; i++) {
            facet._selections.push({ "value": selection[i], "selectOthers": false });
        }
    }
    
    if (typeof facet._settings.facetLabel === "undefined") {
        if (facet.getExpression() !== null && facet.getExpression().isPath()) {
            segment = facet.getExpression().getPath().getLastSegment();
            property = facet.getUIContext().getDatabase().getProperty(segment.property);
            if (property !== null) {
                facet._settings.facetLabel = segment.forward ? property.getLabel() : property.getReverseLabel();
            }
        }
    }

    if (typeof facet._settings.fixedOrder !== "undefined") {
        values = facet._settings.fixedOrder.split(";");
        orderMap = {};
        for (i = 0; i < values.length; i++) {
            orderMap[values[i].trim()] = i;
        }
        
        facet._orderMap = orderMap;
    }
    
    if (typeof facet._settings.colorCoder !== "undefined") {
        facet._colorCoder = facet.getUIContext().getMain().getComponent(facet._settings.colorCoder);
    }
    
    if (facet._settings.collapsed) {
        facet._settings.collapsible = true;
    }
};

/**
 *
 */
Exhibit.HierarchicalFacet.prototype.dispose = function() {
    this.getUIContext().getCollection().removeFacet(this);
    Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
        "onRootItemsChanged.exhibit",
        this._onRootItemsChanged
    );

    this._dom = null;
    this._orderMap = null;
    this._colorCoder = null;
    this._uniformGroupingExpression = null;
    this._selections = null;
    this._cache = null;
    this._expanded = null;
    this._dispose();
};

/**
 * @returns {Boolean}
 */
Exhibit.HierarchicalFacet.prototype.hasRestrictions = function() {
    return this._selections.length > 0;
};

/**
 *
 */
Exhibit.HierarchicalFacet.prototype.clearAllRestrictions = function() {
    Exhibit.jQuery(this.getContainer()).trigger("onBeforeFacetReset.exhibit");
    if (this._selections.length > 0) {
        this._selections = [];
        this._notifyCollection();
    }
};

/**
 * @param {Array} restrictions
 */
Exhibit.HierarchicalFacet.prototype.applyRestrictions = function(restrictions) {
    this._selections = [].concat(restrictions);
    this._notifyCollection();
};

/**
 * @param {String} value
 * @param {Boolean} selected
 * @returns
 */
Exhibit.HierarchicalFacet.prototype.setSelection = function(value, selected) {
    var selection, selections;
    selection = { "value": value, "selectOthers": false };
    if (selected) {
        selections = this._internalAddSelection(selection);
    } else {
        selections = this._internalRemoveSelection(selection);
    }
    return selections;
};

/**
 * @param {String} value
 * @param {Boolean} selected
 * @returns {Array}
 */
Exhibit.HierarchicalFacet.prototype.setSelectOthers = function(value, selected) {
    var selection, selections;
    selection = { "value": value, "selectOthers": true };
    if (selected) {
        selections = this._internalAddSelection(selection);
    } else {
        selections = this._internalRemoveSelection(selection);
    }
    return selections;
};

/**
 * @param {Exhibit.Set} items
 * @returns {Exhibit.Set}
 */
Exhibit.HierarchicalFacet.prototype.restrict = function(items) {
    if (this._selections.length == 0) {
        return items;
    }

    var set, includeNode, includeChildNodes, i, selection, node;
    
    this._buildCache();
    
    set = new Exhibit.Set();
    includeNode = function(node) {
        if (typeof node.children !== "undefined") {
            includeChildNodes(node.children);
            Exhibit.Set.createIntersection(node.others, items, set);
        } else {
            Exhibit.Set.createIntersection(node.items, items, set);
        }
    };
    includeChildNodes = function(childNodes) {
        var i;
        for (i = 0; i < childNodes.length; i++) {
            includeNode(childNodes[i]);
        }
    };
    
    for (i = 0; i < this._selections.length; i++) {
        selection = this._selections[i];
        node = this._getTreeNode(selection.value);
        if (typeof node !== "undefined" && node !== null) {
            if (selection.selectOthers) {
                Exhibit.Set.createIntersection(node.others, items, set);
            } else {
                includeNode(node);
            }
        }
    }
    
    return set;
};

/**
 * @param {Object} selection
 * @param {String} selection.value
 * @param {Boolean} selection.selectOthers
 * @returns {Array}
 */
Exhibit.HierarchicalFacet.prototype._internalAddSelection = function(selection) {
    var parentToClear, childrenToClear, cache, markClearAncestors, markClearDescendants, oldSelections, newSelections, i, s;
    parentToClear = {};
    childrenToClear = {};
    
    this._buildCache();
    cache = this._cache;
    markClearAncestors = function(value) {
        var parents, i, parent;
        if (typeof cache.valueToParent[value] !== "undefined") {
            parents = cache.valueToParent[value];
            for (i = 0; i < parents.length; i++) {
                parent = parents[i];
                parentToClear[parent] = true;
                markClearAncestors(parent);
            }
        }
    };
    markClearDescendants = function(value) {
        var children, i, child;
        if (typeof cache.valueToChildren[value] !== "undefined") {
            children = cache.valueToChildren[value];
            for (i = 0; i < children.length; i++) {
                child = children[i];
                childrenToClear[child] = true;
                markClearDescendants(child);
            }
        }
    };
    
    /*
        ignore "(others)" at the root (its value is null) 
        because it has no parent nor children.
     */
    if (selection.value !== null) { 
        markClearAncestors(selection.value);
        if (selection.selectOthers) {
            parentToClear[selection.value] = true;
        } else {
            childrenToClear[selection.value] = true;
            markClearDescendants(selection.value);
        }
    }
    
    oldSelections = this._selections;
    newSelections = [ selection ];
    for (i = 0; i < oldSelections.length; i++) {
        s = oldSelections[i];
        if ((!(s.value in parentToClear) || s.selectOthers) && 
            (!(s.value in childrenToClear))) {
            newSelections.push(s);
        }
    }
    
    return newSelections;
};

/**
 * @param {Object} selection
 * @param {String} selection.value
 * @param {Boolean} selection.selectOthers
 * @returns {Array}
 */
Exhibit.HierarchicalFacet.prototype._internalRemoveSelection = function(selection) {
    var oldSelections, newSelections, i, s;
    oldSelections = this._selections;
    newSelections = [];
    for (i = 0; i < oldSelections.length; i++) {
        s = oldSelections[i];
        if (s.value != selection.value || s.selectOthers != selection.selectOthers) {
            newSelections.push(s);
        }
    }
    
    return newSelections;
};

/**
 * @param {Exhibit.Set} items
 */
Exhibit.HierarchicalFacet.prototype.update = function(items) {
    var tree;

    Exhibit.jQuery(this._dom.valuesContainer).hide().empty();

    tree = this._computeFacet(items);
    if (typeof tree !== "undefined" && tree !== null) {
        this._constructBody(tree);
    }
    Exhibit.jQuery(this._dom.valuesContainer).show();
};

/**
 * @param {Exhibit.Set} items
 * @returns {Object}
 */
Exhibit.HierarchicalFacet.prototype._computeFacet = function(items) {
    var database, sorter, othersLabel, selectionMap, i, s, processNode, nodes;

    this._buildCache();
    
    database = this.getUIContext().getDatabase();
    sorter = this._getValueSorter();
    othersLabel = typeof this._settings.othersLabel !== "undefined" ? this._settings.othersLabel : Exhibit._("%facets.hierarchical.othersLabel");
    
    selectionMap = {};
    for (i = 0; i < this._selections.length; i++) {
        s = this._selections[i];
        selectionMap[s.value] = s.selectOthers;
    }
    
    processNode = function(node, resultNodes, superset) {
        var selected, resultNode, superset2, i, childNode, othersSelected, subset;
        selected = (node.value in selectionMap && !selectionMap[node.value]);
        if (typeof node.children !== "undefined") {
            resultNode = {
                "value":      node.value,
                "label":      node.label,
                "children":   [],
                "selected":   selected,
                "areOthers":  false
            };
            
            superset2 = new Exhibit.Set();
            
            for (i = 0; i < node.children.length; i++) {
                childNode = node.children[i];
                processNode(childNode, resultNode.children, superset2);
            }
            resultNode.children.sort(sorter);
            
            if (node.others.size() > 0) {
                othersSelected = (node.value in selectionMap && selectionMap[node.value]);
                subset = Exhibit.Set.createIntersection(items, node.others);
                if (subset.size() > 0 || othersSelected) {
                    resultNode.children.push({
                        "value":      node.value,
                        "label":      othersLabel,
                        "count":      subset.size(),
                        "selected":   othersSelected,
                        "areOthers":  true
                    });
                    superset2.addSet(subset);
                }
            }
            
            resultNode.count = superset2.size();
            if (selected || resultNode.count > 0 || resultNode.children.length > 0) {
                resultNodes.push(resultNode);
                
                if (superset != null && superset2.size() > 0) {
                    superset.addSet(superset2);
                }
            }
        } else {
            subset = Exhibit.Set.createIntersection(items, node.items);
            if (subset.size() > 0 || selected) {
                resultNodes.push({
                    "value":      node.value,
                    "label":      node.label,
                    "count":      subset.size(),
                    "selected":   selected,
                    "areOthers":  false
                });
                
                if (superset != null && subset.size() > 0) {
                    superset.addSet(subset);
                }
            }
        }
    };
    
    nodes = [];
    processNode(this._cache.tree, nodes, null);
    
    return nodes[0];
};

/**
 * @returns {Function}
 */
Exhibit.HierarchicalFacet.prototype._getValueSorter = function() {
    var sortValueFunction, orderMap, sortFunction, sortDirectionFunction;
    sortValueFunction = function(a, b) {
        return a.label.localeCompare(b.label);
    };
    
    if (typeof this._orderMap !== "undefined") {
        orderMap = this._orderMap;
        
        sortValueFunction = function(a, b) {
            if (typeof orderMap[a.label] !== "undefined") {
                if (typeof orderMap[b.label] !== "undefined") {
                    return orderMap[a.label] - orderMap[b.label];
                } else {
                    return -1;
                }
            } else if (typeof orderMap[b.label] !== "undefined") {
                return 1;
            } else {
                return a.label.localeCompare(b.label);
            }
        };
    } else if (this._cache.valueType === "number") {
        sortValueFunction = function(a, b) {
            a = parseFloat(a.value);
            b = parseFloat(b.value);
            return a < b ? -1 : a > b ? 1 : 0;
        };
    }
    
    sortFunction = sortValueFunction;
    if (this._settings.sortMode === "count") {
        sortFunction = function(a, b) {
            var c = b.count - a.count;
            return c != 0 ? c : sortValueFunction(a, b);
        };
    }

    sortDirectionFunction = sortFunction;
    if (this._settings.sortDirection === "reverse"){
        sortDirectionFunction = function(a, b) {
            return sortFunction(b, a);
        };
    }

    return sortDirectionFunction;
};

/**
 *
 */
Exhibit.HierarchicalFacet.prototype._notifyCollection = function() {
    this.getUIContext().getCollection().onFacetUpdated(this);
};

/**
 *
 */
Exhibit.HierarchicalFacet.prototype._initializeUI = function() {
    var self = this;
    this._dom = Exhibit.FacetUtilities[this._settings.scroll ? "constructFacetFrame" : "constructFlowingFacetFrame"](
		this,
        this.getContainer(),
        this.getLabel(),
        function(elmt, evt, target) { self._clearSelections(); },
        this.getUIContext(),
        this._settings.collapsible,
        this._settings.collapsed
    );
    
    if (typeof this._settings.height !== "undefined" && this._settings.height !== null && this._settings.scroll) {
        Exhibit.jQuery(this._dom.valuesContainer).css("height", this._settings.height);
    }
};

/**
 * @param {Object} tree
 */
Exhibit.HierarchicalFacet.prototype._constructBody = function(tree) {
    var self, containerDiv, constructFacetItemFunction, facetHasSelection, processNode, processChildNodes;
    self = this;
    containerDiv = this._dom.valuesContainer;
    
    Exhibit.jQuery(containerDiv).hide();
    
    constructFacetItemFunction = Exhibit.FacetUtilities[this._settings.scroll ? "constructHierarchicalFacetItem" : "constructFlowingHierarchicalFacetItem"];
    facetHasSelection = this._selections.length > 0;
    
    processNode = function(node, div) {
        var hasChildren, onSelect, onSelectOnly, onToggleChildren, dom;
        hasChildren = typeof node.children !== "undefined";
        onSelect = function(evt) {
            self._filter(node.value, node.areOthers, node.label, node.selected, false);
            evt.preventDefault();
            evt.stopPropagation();
        };
        onSelectOnly = function(evt) {
            self._filter(node.value, node.areOthers, node.label, node.selected, !(evt.ctrlKey || evt.metaKey));
            evt.preventDefault();
            evt.stopPropagation();
        };
        onToggleChildren = function(evt) {
            var show;
            if (typeof self._expanded[node.value] !== "undefined") {
                delete self._expanded[node.value];
                show = false;
            } else {
                self._expanded[node.value] = true;
                show = true;
            }
            dom.showChildren(show);
            evt.preventDefault();
            evt.stopPropagation();
        };
        dom = constructFacetItemFunction(
            node.label,
            node.count,
            (self._colorCoder != null) ? self._colorCoder.translate(node.value) : null,
            node.selected,
            hasChildren,
            typeof self._expanded[node.value] !== "undefined",
            facetHasSelection,
            onSelect,
            onSelectOnly,
            onToggleChildren,
            self.getUIContext()
        );
        Exhibit.jQuery(div).append(dom.elmt);
        
        if (hasChildren) {
            processChildNodes(node.children, dom.childrenContainer);
        }
    };
    processChildNodes = function(childNodes, div) {
        var i;
        for (i = 0; i < childNodes.length; i++) {
            processNode(childNodes[i], div);
        }
    };
    
    processChildNodes(tree.children, containerDiv);
    
    Exhibit.jQuery(containerDiv).show();
    
    this._dom.setSelectionCount(this._selections.length);
};

/**
 * @param {String} value
 * @param {Boolean} areOthers
 * @param {String} label
 * @param {Boolean} wasSelected
 * @param {Boolean} selectOnly
 */
Exhibit.HierarchicalFacet.prototype._filter = function(value, areOthers, label, wasSelected, selectOnly) {
    var self, wasSelectedAlone, selection, newRestrictions;
    self = this;
    wasSelectedAlone = wasSelected && this._selections.length == 1;
    
    selection = {
        "value":         value,
        "selectOthers":  areOthers
    };
    
    if (wasSelected) {
        if (selectOnly) {
            if (wasSelectedAlone) {
                // deselect
                newRestrictions = [];
            } else {
                // clear all other selections
                newRestrictions = [ selection ];
            }
        } else {
            // toggle
            newRestrictions = this._internalRemoveSelection(selection);
        }
    } else {
        if (selectOnly) {
            newRestrictions = [ selection ];
        } else {
            newRestrictions = this._internalAddSelection(selection);
        }
    }
    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        { "selections": newRestrictions },
        (selectOnly && !wasSelectedAlone) ?
            Exhibit._("%facets.facetSelectOnlyActionTitle", label, this.getLabel()) :
            Exhibit._(wasSelected ? "%facets.facetUnselectActionTitle" : "%facets.facetSelectActionTitle", label, this.getLabel()),
        true
    );
};

/**
 * @private
 */
Exhibit.HierarchicalFacet.prototype._clearSelections = function() {
    Exhibit.History.pushComponentState(
        this,
        Exhibit.Facet.getRegistryKey(),
        this.exportEmptyState(),
        Exhibit._("%facets.facetClearSelectionsActionTitle", this.getLabel()),
        true
    );
};

/**
 * @private
 */
Exhibit.HierarchicalFacet.prototype._buildCache = function() {
    var valueToItem, valueType, valueToChildren, valueToParent, valueToPath, values, insert, database, tree, expression, groupingExpression, rootValues, getParentChildRelationships, processValue, index;
    if (typeof this._cache === "undefined") {
        valueToItem = {};
        valueType = "text";
        
        valueToChildren = {};
        valueToParent = {};
        valueToPath = {};
        values = new Exhibit.Set();
        
        insert = function(x, y, map) {
            if (typeof map[x] !== "undefined") {
                map[x].push(y);
            } else {
                map[x] = [ y ];
            }
        };
        
        database = this.getUIContext().getDatabase();
        tree = {
            "value":      null,
            "label":      Exhibit._("%facets.hierarchical.rootLabel"),
            "others":     new Exhibit.Set(),
            "children":   []
        };
        
        expression = this.getExpression();
        this.getUIContext().getCollection().getAllItems().visit(function(item) {
            var results;
            results = expression.evaluateOnItem(item, database);
            if (results.values.size() > 0) {
                valueType = results.valueType;
                results.values.visit(function(value) {
                    values.add(value);
                    insert(value, item, valueToItem);
                });
            } else {
                tree.others.add(item);
            }
        });
        
        groupingExpression = this._uniformGroupingExpression;
        rootValues = new Exhibit.Set();
        getParentChildRelationships = function(valueSet) {
            var newValueSet;
            newValueSet = new Exhibit.Set();
            valueSet.visit(function(value) {
                var results;
                results = groupingExpression.evaluateOnItem(value, database);
                if (results.values.size() > 0) {
                    results.values.visit(function(parentValue) {
                        insert(value, parentValue, valueToParent);
                        insert(parentValue, value, valueToChildren);
                        if (!valueSet.contains(parentValue)) {
                            newValueSet.add(parentValue);
                        }
                        return true;
                    });
                } else {
                    rootValues.add(value);
                }
            });
            
            if (newValueSet.size() > 0) {
                getParentChildRelationships(newValueSet);
            }
        };
        getParentChildRelationships(values);
        
        processValue = function(value, nodes, valueSet, path) {
            var label, node, valueSet2, childrenValue, i, items, item;
            label = database.getObject(value, "label");
            node = {
                "value":  value,
                "label":  label != null ? label : value
            };
            nodes.push(node);
            valueToPath[value] = path;
            
            if (typeof valueToChildren[value] !== "undefined") {
                node.children = [];
                
                valueSet2 = new Exhibit.Set();
                childrenValue = valueToChildren[value];
                for (i = 0; i < childrenValue.length; i++) {
                    processValue(childrenValue[i], node.children, valueSet2, path.concat(i));
                };
                
                node.others = new Exhibit.Set();
                if (typeof valueToItem[value] !== "undefined") {
                    items = valueToItem[value];
                    for (i = 0; i < items.length; i++) {
                        item = items[i];
                        if (!valueSet2.contains(item)) {
                            node.others.add(item);
                            valueSet.add(item);
                        }
                    }
                }
                
                valueSet.addSet(valueSet2);
            } else {
                node.items = new Exhibit.Set();
                if (value in valueToItem) {
                    items = valueToItem[value];
                    for (i = 0; i < items.length; i++) {
                        item = items[i];
                        node.items.add(item);
                        valueSet.add(item);
                    }
                }
            }
        };
        
        index = 0;
        rootValues.visit(function (value) {
            processValue(value, tree.children, new Exhibit.Set(), [index++]);
        });
        
        this._cache = {
            "tree":               tree,
            "valueToChildren":    valueToChildren,
            "valueToParent":      valueToParent,
            "valueToPath":        valueToPath,
            "valueType":          valueType
        };
    }
};

/**
 * @param {String} value
 * @returns {Object}
 */
Exhibit.HierarchicalFacet.prototype._getTreeNode = function(value) {
    var path, trace;
    if (value === null) {
        return this._cache.tree;
    }
    
    path = this._cache.valueToPath[value];
    trace = function(node, path, index) {
        var node2;
        node2 = node.children[path[index]];
        if (++index < path.length) {
            return trace(node2, path, index);
        } else {
            return node2;
        }
    };
    return (path) ? trace(this._cache.tree, path, 0) : null;
};

/**
 *
 */
Exhibit.HierarchicalFacet.prototype.exportEmptyState = function() {
    return this._exportState(true);
};

/**
 *
 */
Exhibit.HierarchicalFacet.prototype.exportState = function() {
    return this._exportState(false);
};

/**
 * @param {Boolean} empty
 * @returns {Object}
 */
Exhibit.HierarchicalFacet.prototype._exportState = function(empty) {
    var s = [];

    if (!empty) {
        s = this._selections;
    }

    return {
        "selections": s
    };
};

/**
 * @param {Object} state
 * @param {Array} state.selections
 */
Exhibit.HierarchicalFacet.prototype.importState = function(state) {
    if (this.stateDiffers(state)) {
        if (state.selections.length === 0) {
            this.clearAllRestrictions();
        } else {
            this.applyRestrictions(state.selections);
        }
    }
};

/**
 * @param {Object} state
 * @param {Array} state.selections
 */
Exhibit.HierarchicalFacet.prototype.stateDiffers = function(state) {
    var selectionStartCount, stateStartCount, stateSet;

    stateStartCount = state.selections.length;
    selectionStartCount = this._selections.length;

    if (stateStartCount !== selectionStartCount) {
        return true;
    } else {
        stateSet = new Exhibit.Set(state.selections);
        stateSet.addSet(this._selections);
        if (stateSet.size() !== stateStartCount) {
            return true;
        }
    }

    return false;
};
/**
 * @fileOverview Coder component.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {String} key
 * @param {Element|jQuery} div
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.Coder = function(key, div, uiContext) {
    var self, _instanceKey, _registered, _id, _uiContext, _div, _settingSpecs, _setIdentifier;

    /**
     * @private
     */
    self = this;

    /**
     * @private
     */
    _div = Exhibit.jQuery(div);

    /**
     * @private
     */
    _uiContext = uiContext;

    /**
     * @private
     */
    _instanceKey = key;

    /**
     * @private
     */
    _registered = false;

    /**
     * @private
     */
    _id = null;

    /**
     * @private
     */
    _settingSpecs = {};

    /**
     * @public
     */
    this._settings = {};

    /**
     * @public
     * @param {Object} specs
     */
    this.addSettingSpecs = function(specs) {
        Exhibit.jQuery.extend(true, _settingSpecs, specs);
    };

    /**
     * @public
     * @returns {Object}
     */
    this.getSettingSpecs = function() {
        return _settingSpecs;
    };

    /**
     * @public
     * @returns {String}
     */
    this.getID = function() {
        return _id;
    };

    /**
     * @public
     * @returns {Exhibit.UIContext}
     */
    this.getUIContext = function() {
        return _uiContext;
    };

    /**
     * Returns the containing element for this view.
     * @public
     * @returns {jQuery}
     */
    this.getContainer = function() {
        return _div;
    };

    this.register = function() {
        this.getUIContext().getMain().getRegistry().register(
            Exhibit.Coder.getRegistryKey(),
            this.getID(),
            this
        );
        _registered = true;
    };

    this.unregister = function() {
        self.getUIContext().getMain().getRegistry().unregister(
            Exhibit.Coder.getRegistryKey(),
            self.getID()
        );
        _registered = false;
    };

    this._dispose = function() {
        _settingSpecs = null;

        this._settings = null;
        Exhibit.jQuery(_div).empty();
        _div = null;

        this.unregister();
        _uiContext = null;
    };

    /**
     * @private
     */
    _setIdentifier = function() {
        _id = Exhibit.jQuery(_div).attr("id");
        if (typeof _id === "undefined" || _id === null) {
            _id = _instanceKey
                + "-"
                + self.getUIContext().getCollection().getID()
                + "-"
                + self.getUIContext().getMain().getRegistry().generateIdentifier(Exhibit.Coder.getRegistryKey());
        }
    };

    _setIdentifier();
};

/**
 * @private
 * @constant
 */
Exhibit.Coder._registryKey = "coder";

/**
 * @public
 * @static
 * @returns {String}
 */
Exhibit.Coder.getRegistryKey = function() {
    return Exhibit.Coder._registryKey;
};

/**
 * @static
 * @public
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.Coder.registerComponent = function(evt, reg) {
    if (!reg.hasRegistry(Exhibit.Coder.getRegistryKey())) {
        reg.createRegistry(Exhibit.Coder.getRegistryKey());
    }
};

Exhibit.jQuery(document).one(
    "registerComponents.exhibit",
    Exhibit.Coder.registerComponent
);
/**
 * @fileOverview Codes values with colors.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element|jQuery} containerElmt 
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ColorCoder = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Coder(
        "color",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.ColorCoder._settingSpecs);

    this._map = {};

    this._mixedCase = { 
        "label": Exhibit._("%coders.mixedCaseLabel"),
        "color": Exhibit.Coders.mixedCaseColor
    };
    this._missingCase = { 
        "label": Exhibit._("%coders.missingCaseLabel"),
        "color": Exhibit.Coders.missingCaseColor 
    };
    this._othersCase = { 
        "label": Exhibit._("%coders.othersCaseLabel"),
        "color": Exhibit.Coders.othersCaseColor 
    };

    this.register();
};

/**
 * @constant
 */
Exhibit.ColorCoder._settingSpecs = {
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ColorCoder}
 */
Exhibit.ColorCoder.create = function(configuration, uiContext) {
    var coder, div;
    div = Exhibit.jQuery("<div>")
        .hide()
        .appendTo("body");
    coder = new Exhibit.ColorCoder(div, Exhibit.UIContext.create(configuration, uiContext));
    
    Exhibit.ColorCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ColorCoder}
 */
Exhibit.ColorCoder.createFromDOM = function(configElmt, uiContext) {
    var configuration, coder;

    Exhibit.jQuery(configElmt).hide();

    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    coder = new Exhibit.ColorCoder(
        configElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    try {
        Exhibit.jQuery(configElmt).children().each(function(index, elmt) {
            coder._addEntry(
                Exhibit.getAttribute(this,  "case"),
                Exhibit.jQuery(this).text().trim(),
                Exhibit.getAttribute(this, "color")
            );
        });
    } catch (e) {
        Exhibit.Debug.exception(e, "ColorCoder: Error processing configuration of coder");
    }
    
    Exhibit.ColorCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Exhibit.ColorCoder} coder
 * @param {Object} configuration
 */
Exhibit.ColorCoder._configure = function(coder, configuration) {
    var entries, i;

    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    if (typeof configuration["entries"] !== "undefined") {
        entries = configuration.entries;
        for (i = 0; i < entries.length; i++) {
            coder._addEntry(entries[i].kase, entries[i].key, entries[i].color);
        }
    }
};

/**
 *
 */
Exhibit.ColorCoder.prototype.dispose = function() {
    this._map = null;
    this._dispose();
};

/**
 * @constant
 */
Exhibit.ColorCoder._colorTable = {
    "red" :     "#ff0000",
    "green" :   "#00ff00",
    "blue" :    "#0000ff",
    "white" :   "#ffffff",
    "black" :   "#000000",
    "gray" :    "#888888"
};

/**
 * @param {String} kase
 * @param {String} key
 * @param {String} color
 */
Exhibit.ColorCoder.prototype._addEntry = function(kase, key, color) {
    if (typeof Exhibit.ColorCoder._colorTable[color] !== "undefined") {
        color = Exhibit.ColorCoder._colorTable[color];
    }
    
    var entry = null;
    switch (kase) {
    case "others":  entry = this._othersCase; break;
    case "mixed":   entry = this._mixedCase; break;
    case "missing": entry = this._missingCase; break;
    }
    if (entry !== null) {
        entry.label = key;
        entry.color = color;
    } else {
        this._map[key] = { color: color };
    }
};

/**
 * @param {String} key
 * @param {Object} flags
 * @param {Boolean} flags.missing
 * @param {Boolean} flags.others
 * @param {Exhibit.Set} flags.keys
 */
Exhibit.ColorCoder.prototype.translate = function(key, flags) {
    if (typeof this._map[key] !== "undefined") {
        if (flags) {
            flags.keys.add(key);
        }
        return this._map[key].color;
    } else if (typeof key === "undefined" || key === null) {
        if (flags) {
            flags.missing = true;
        }
        return this._missingCase.color;
    } else {
        if (flags) {
            flags.others = true;
        }
        return this._othersCase.color;
    }
};

/**
 * @param {Exhibit.Set} keys
 * @param {Object} flags
 * @param {Boolean} flags.missing
 * @param {Boolean} flags.mixed
 * @returns {String}
 */
Exhibit.ColorCoder.prototype.translateSet = function(keys, flags) {
    var color, self;
    color = null;
    self = this;
    keys.visit(function(key) {
        var color2 = self.translate(key, flags);
        if (color === null) {
            color = color2;
        } else if (color !== color2) {
            if (typeof flags !== "undefined" && flags !== null) {
                flags.mixed = true;
            }
            color = self._mixedCase.color;
            return true;
        }
        return false;
    });
    
    if (color !== null) {
        return color;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.color;
    }
};

/**
 * @returns {String}
 */
Exhibit.ColorCoder.prototype.getOthersLabel = function() {
    return this._othersCase.label;
};

/**
 * @returns {String}
 */
Exhibit.ColorCoder.prototype.getOthersColor = function() {
    return this._othersCase.color;
};

/**
 * @returns {String}
 */
Exhibit.ColorCoder.prototype.getMissingLabel = function() {
    return this._missingCase.label;
};

/**
 * @returns {String}
 */
Exhibit.ColorCoder.prototype.getMissingColor = function() {
    return this._missingCase.color;
};

/**
 * @returns {String}
 */
Exhibit.ColorCoder.prototype.getMixedLabel = function() {
    return this._mixedCase.label;
};

/**
 * @returns {String}
 */
Exhibit.ColorCoder.prototype.getMixedColor = function() {
    return this._mixedCase.color;
};
/**
 * @fileOverview Code values along a color gradient.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element|jQuery} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ColorGradientCoder = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Coder(
        "colorgradient",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.ColorGradientCoder._settingSpecs);
    
    this._gradientPoints = [];
    this._mixedCase = { 
        "label": Exhibit._("%coders.mixedCaseLabel"),
        "color": Exhibit.Coders.mixedCaseColor
    };
    this._missingCase = { 
        "label": Exhibit._("%coders.missingCaseLabel"),
        "color": Exhibit.Coders.missingCaseColor 
    };
    this._othersCase = { 
        "label": Exhibit._("%coders.othersCaseLabel"),
        "color": Exhibit.Coders.othersCaseColor 
    };

    this.register();
};

/**
 * @constant
 */
Exhibit.ColorGradientCoder._settingSpecs = {
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ColorGradientCoder}
 */
Exhibit.ColorGradientCoder.create = function(configuration, uiContext) {
    var div, coder;
    div = Exhibit.jQuery("<div>")
        .hide()
        .appendTo("body");
    coder = new Exhibit.ColorGradientCoder(
        div,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.ColorGradientCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ColorGradientCoder}
 */
Exhibit.ColorGradientCoder.createFromDOM = function(configElmt, uiContext) {
    var configuration, coder, gradientPoints, i, point, value, colorIndex, red, green, blue;

    Exhibit.jQuery(configElmt).hide();
    
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    coder = new Exhibit.ColorGradientCoder(
        configElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    try {
		gradientPoints = Exhibit.getAttribute(configElmt, "gradientPoints", ";");
		for (i = 0; i < gradientPoints.length; i++) {
			point = gradientPoints[i];
			value = parseFloat(point);
			colorIndex = point.indexOf("#") + 1;
			red = parseInt(point.slice(colorIndex, colorIndex + 2), 16);
			green = parseInt(point.slice(colorIndex + 2, colorIndex + 4), 16);
			blue = parseInt(point.slice(colorIndex + 4), 16);
			coder._gradientPoints.push({ value: value, red: red, green: green, blue: blue });
		}
		
        Exhibit.jQuery(configElmt).children().each(function(index, elmt) {
            coder._addEntry(
                Exhibit.getAttribute(this,  "case"),
                Exhibit.jQuery(this).text().trim(),
                Exhibit.getAttribute(this, "color")
            );
        });
    } catch (e) {
        Exhibit.Debug.exception(e, "ColorGradientCoder: Error processing configuration of coder");
    }
    
    Exhibit.ColorGradientCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Exhibit.ColorGradientCoder} coder
 * @param {Object} configuration
 */
Exhibit.ColorGradientCoder._configure = function(coder, configuration) {
    var entries, i;
    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    if (typeof configuration.entries !== "undefined") {
        entries = configuration.entries;
        for (i = 0; i < entries.length; i++) {
            coder._addEntry(entries[i].kase, entries[i].key, entries[i].color);
        }
    }
};

/**
 *
 */
Exhibit.ColorGradientCoder.prototype.dispose = function() {
    this._gradientPoints = null;
    this._dispose();
};

/**
 * @param {String} kase
 * @param {String} key
 * @param {String} color
 */
Exhibit.ColorGradientCoder.prototype._addEntry = function(kase, key, color) {
    var entry = null;
    switch (kase) {
    case "others":  entry = this._othersCase; break;
    case "mixed":   entry = this._mixedCase; break;
    case "missing": entry = this._missingCase; break;
    }
    if (entry !== null) {
        entry.label = key;
        entry.color = color;
	}
};

/**
 * @param {String} key
 * @param {Object} flags
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.translate = function(key, flags) {
    var gradientPoints, getColor, rgbToHex;
	gradientPoints = this._gradientPoints;
	getColor = function(key) {
        var j, fraction, newRed, newGreen, newBlue;
		if (key.constructor !== Number) {
			key = parseFloat(key);
		}
		for (j = 0; j < gradientPoints.length; j++) {
			if (key === gradientPoints[j].value) {
				return rgbToHex(gradientPoints[j].red, gradientPoints[j].green, gradientPoints[j].blue);
			} else if (gradientPoints[j+1] !== null) {
				if (key < gradientPoints[j+1].value) {
					fraction = (key - gradientPoints[j].value)/(gradientPoints[j+1].value - gradientPoints[j].value);
					newRed = Math.floor(gradientPoints[j].red + fraction*(gradientPoints[j+1].red - gradientPoints[j].red));
					newGreen = Math.floor(gradientPoints[j].green + fraction*(gradientPoints[j+1].green - gradientPoints[j].green));
					newBlue = Math.floor(gradientPoints[j].blue + fraction*(gradientPoints[j+1].blue - gradientPoints[j].blue));
					return rgbToHex(newRed, newGreen, newBlue);
				}
			}
		}
	};

	rgbToHex = function(r, g, b) {
        var decToHex;
		decToHex = function(n) {
			if (n === 0) {
                return "00";
            }
			else {
                return n.toString(16);
            }
		};
		return "#" + decToHex(r) + decToHex(g) + decToHex(b);
	};
	
    if (key >= gradientPoints[0].value & key <= gradientPoints[gradientPoints.length-1].value) {
        if (typeof flags !== "undefined" && flags !==  null) {
            flags.keys.add(key);
        }
        return getColor(key);
    } else if (typeof key === "undefined" || key === null) {
        if (typeof flags !== "undefined" && flags !==  null) {
            flags.missing = true;
        }
        return this._missingCase.color;
    } else {
        if (typeof flags !== "undefined" && flags !==  null) {
            flags.others = true;
        }
        return this._othersCase.color;
    }
};

/**
 * @param {Exhibit.Set} keys
 * @param {Object} flags
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.translateSet = function(keys, flags) {
    var color, self;
    color = null;
    self = this;
    keys.visit(function(key) {
        var color2 = self.translate(key, flags);
        if (color === null) {
            color = color2;
        } else if (color !== color2) {
            if (typeof flags !== "undefined" && flags !==  null) {
                flags.mixed = true;
            }
            color = self._mixedCase.color;
            return true;
        }
        return false;
    });
    
    if (color !== null) {
        return color;
    } else {
        if (typeof flags !== "undefined" && flags !==  null) {
            flags.missing = true;
        }
        return this._missingCase.color;
    }
};

/**
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.getOthersLabel = function() {
    return this._othersCase.label;
};

/**
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.getOthersColor = function() {
    return this._othersCase.color;
};

/**
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.getMissingLabel = function() {
    return this._missingCase.label;
};

/**
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.getMissingColor = function() {
    return this._missingCase.color;
};

/**
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.getMixedLabel = function() {
    return this._mixedCase.label;
};

/**
 * @returns {String}
 */
Exhibit.ColorGradientCoder.prototype.getMixedColor = function() {
    return this._mixedCase.color;
};
/**
 * @fileOverview Color coder to use when none is provided but one is needed.
 *     Does NOT extend Exhibit.Coder as it cannot be configured and has no
 *     need to inherit any of the structure used by other user-configured
 *     coders.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.DefaultColorCoder = function(uiContext) {
};

/**
 * @constant
 */
Exhibit.DefaultColorCoder.colors = [
    "#FF9000",
    "#5D7CBA",
    "#A97838",
    "#8B9BBA",
    "#FFC77F",
    "#003EBA",
    "#29447B",
    "#543C1C"
];

/**
 * @private
 */
Exhibit.DefaultColorCoder._map = {};

/**
 * @private
 */
Exhibit.DefaultColorCoder._nextColor = 0;

/**
 * @param {String} key
 * @param {Object} flags
 * @param {Boolean} flags.missing
 * @param {Exhibit.Set} flags.keys
 * @returns {String}
 * @depends Exhibit.Coders
 */
Exhibit.DefaultColorCoder.prototype.translate = function(key, flags) {
    if (typeof key === "undefined" || key === null) {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return Exhibit.Coders.missingCaseColor;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.keys.add(key);
        }
        if (typeof Exhibit.DefaultColorCoder._map[key] !== "undefined") {
            return Exhibit.DefaultColorCoder._map[key];
        } else {
            var color = Exhibit.DefaultColorCoder.colors[Exhibit.DefaultColorCoder._nextColor];
            Exhibit.DefaultColorCoder._nextColor = 
                (Exhibit.DefaultColorCoder._nextColor + 1) % Exhibit.DefaultColorCoder.colors.length;
                
            Exhibit.DefaultColorCoder._map[key] = color;
            return color;
        }
    }
};

/**
 * @param {Exhibit.Set} keys
 * @param {Object} flags
 * @param {Boolean} flags.missing
 * @param {Boolean} flags.mixed
 * @returns {String}
 */
Exhibit.DefaultColorCoder.prototype.translateSet = function(keys, flags) {
    var color, self;
    color = null;
    self = this;
    keys.visit(function(key) {
        var color2 = self.translate(key, flags);
        if (color === null) {
            color = color2;
        } else if (color !== color2) {
            color = Exhibit.Coders.mixedCaseColor;
            flags.mixed = true;
            return true; // exit visitation
        }
        return false;
    });
    
    if (color !== null) {
        return color;
    } else {
        flags.missing = true;
        return Exhibit.Coders.missingCaseColor;
    }
};

/**
 * @returns {String}
 */
Exhibit.DefaultColorCoder.prototype.getOthersLabel = function() {
    return Exhibit._("%coders.othersCaseLabel");
};

/**
 * @returns {String}
 */
Exhibit.DefaultColorCoder.prototype.getOthersColor = function() {
    return Exhibit.Coders.othersCaseColor;
};

/**
 * @returns {String}
 */
Exhibit.DefaultColorCoder.prototype.getMissingLabel = function() {
    return Exhibit._("%coders.missingCaseLabel");
};

/**
 * @returns {String}
 */
Exhibit.DefaultColorCoder.prototype.getMissingColor = function() {
    return Exhibit.Coders.missingCaseColor;
};

/**
 * @returns {String}
 */
Exhibit.DefaultColorCoder.prototype.getMixedLabel = function() {
    return Exhibit._("%coders.mixedCaseLabel");
};

/**
 * @returns {String}
 */
Exhibit.DefaultColorCoder.prototype.getMixedColor = function() {
    return Exhibit.Coders.mixedCaseColor;
};
/**
 * @fileOverview Code values with icons.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element|jQuery} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.IconCoder = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Coder(
        "icon",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.IconCoder._settingSpecs);
    
    this._map = {};
    this._mixedCase = {
        "label": Exhibit._("%coders.mixedCaseLabel"),
        "icon": null
    };
    this._missingCase = {
        "label": Exhibit._("%coders.missingCaseLabel"),
        "icon": null
    };
    this._othersCase = {
        "label": Exhibit._("%coders.othersCaseLabel"),
        "icon": null
    };

    this.register();
};

/**
 * @constant
 */
Exhibit.IconCoder._settingSpecs = {
};

/**
 * @constant
 */
Exhibit.IconCoder._iconTable = {
    // add built-in icons?
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.IconCoder}
 */
Exhibit.IconCoder.create = function(configuration, uiContext) {
    var coder, div;
    div = Exhibit.jQuery("<div>")
        .hide()
        .appendTo("body");
    coder = new Exhibit.IconCoder(
        div,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.IconCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.IconCoder}
 */
Exhibit.IconCoder.createFromDOM = function(configElmt, uiContext) {
    var configuration, coder;

    Exhibit.jQuery(configElmt).hide();
    
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    coder = new Exhibit.IconCoder(
        configElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    try {
        Exhibit.jQuery(configElmt).children().each(function(index, elmt) {
            coder._addEntry(
                Exhibit.getAttribute(this,  "case"),
                Exhibit.jQuery(this).text().trim(),
                Exhibit.getAttribute(this, "icon")
            );
        });
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%coders.error.configuration", "IconCoder"));
    }
    
    Exhibit.IconCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Exhibit.IconCoder} coder
 * @param {Object} configuration
 */ 
Exhibit.IconCoder._configure = function(coder, configuration) {
    var entries, i;

    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    if (typeof configuration.entries !== "undefined") {
        entries = configuration.entries;
        for (i = 0; i < entries.length; i++) {
            coder._addEntry(entries[i].kase, entries[i].key, entries[i].icon);
        }
    }
};

/**
 *
 */
Exhibit.IconCoder.prototype.dispose = function() {
    this._map = null;
    this._dispose();
};

/**
 * @param {String} kase
 * @param {String} key
 * @param {String} icon
 */
Exhibit.IconCoder.prototype._addEntry = function(kase, key, icon) {
    var entry;

    // used if there are built-in icons
    if (typeof Exhibit.IconCoder._iconTable[icon] !== "undefined") {
        icon = Exhibit.IconCoder._iconTable[icon];
    }
    
    entry = null;
    switch (kase) {
    case "others":  entry = this._othersCase; break;
    case "mixed":   entry = this._mixedCase; break;
    case "missing": entry = this._missingCase; break;
    }
    if (entry !== null) {
        entry.label = key;
        entry.icon = icon;
    } else {
        this._map[key] = { icon: icon };
    }
};

/**
 * @param {String} key
 * @param {Object} flags
 * @returns {String}
 */
Exhibit.IconCoder.prototype.translate = function(key, flags) {
    if (typeof this._map[key] !== "undefined") {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.keys.add(key);
        }
        return this._map[key].icon;
    } else if (typeof key === "undefined" || key === null) {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.icon;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.others = true;
        }
        return this._othersCase.icon;
    }
};

/**
 * @param {Exhibit.Set} keys
 * @param {Object} flags
 * @returns {String}
 */
Exhibit.IconCoder.prototype.translateSet = function(keys, flags) {
    var icon, self;
    icon = null;
    self = this;
    keys.visit(function(key) {
        var icon2 = self.translate(key, flags);
        if (icon === null) {
            icon = icon2;
        } else if (icon !== icon2) {
            if (typeof flags !== "undefined" && flags !== null) {
                flags.mixed = true;
            }
            icon = self._mixedCase.icon;
            return true;
        }
        return false;
    });
    
    if (icon !== null) {
        return icon;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.icon;
    }
};

/**
 * @returns {String}
 */
Exhibit.IconCoder.prototype.getOthersLabel = function() {
    return this._othersCase.label;
};

/**
 * @returns {String}
 */
Exhibit.IconCoder.prototype.getOthersIcon = function() {
    return this._othersCase.icon;
};

/**
 * @returns {String}
 */
Exhibit.IconCoder.prototype.getMissingLabel = function() {
    return this._missingCase.label;
};

/**
 * @returns {String}
 */
Exhibit.IconCoder.prototype.getMissingIcon = function() {
    return this._missingCase.icon;
};

/**
 * @returns {String}
 */
Exhibit.IconCoder.prototype.getMixedLabel = function() {
    return this._mixedCase.label;
};

/**
 * @returns {String}
 */
Exhibit.IconCoder.prototype.getMixedIcon = function() {
    return this._mixedCase.icon;
};
/**
 * @fileOverview  Reads the color coder entries as if they were
 *  in order.  Eliminates the mixed case and uses
 *  either the highest or lowest 'color' in any set.
 *  Note the 'other' and 'missing' cases will be
 *  included in the ordering.  If they are not
 *  included in the coder definition, they will be
 *  added as the lowest priority, other, then
 *  missing.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element|jQuery} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.OrderedColorCoder = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Coder(
        "orderedcolor",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.OrderedColorCoder._settingSpecs);
    
    this._map = {};
    this._order = new Exhibit.OrderedColorCoder._OrderedHash();
    this._usePriority = "highest";
    this._mixedCase = { 
        "label": null,
        "color": null,
	    "isDefault": true
    };
    this._missingCase = { 
        "label": Exhibit._("%coders.missingCaseLabel"),
        "color": Exhibit.Coders.missingCaseColor,
	    "isDefault": true
    };
    this._othersCase = { 
        "label": Exhibit._("%coders.othersCaseLabel"),
        "color": Exhibit.Coders.othersCaseColor,
	    "isDefault": true
    };

    this.register();
};

/**
 * @constructor
 * @class
 * @public
 */
Exhibit.OrderedColorCoder._OrderedHash = function() {
    this.size = 0;
    this.hash = {};
};

/**
 * @param {String} key
 */
Exhibit.OrderedColorCoder._OrderedHash.prototype.add = function(key) {
    this.hash[key] = this.size++;
};

/**
 * @returns {Number}
 */
Exhibit.OrderedColorCoder._OrderedHash.prototype.size = function() {
    return this.size;
};

/**
 * @param {String} key
 * @returns {String}
 */
Exhibit.OrderedColorCoder._OrderedHash.prototype.get = function(key) {
    return this.hash[key];
};

/**
 * @constant
 */
Exhibit.OrderedColorCoder._settingSpecs = {
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.OrderedColorCoder}
 */
Exhibit.OrderedColorCoder.create = function(configuration, uiContext) {
    var coder, div;
    div = Exhibit.jQuery("<div>")
        .hide()
        .appendTo("body");
    coder = new Exhibit.OrderedColorCoder(
        div,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.OrderedColorCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.OrderedColorCoder}
 */
Exhibit.OrderedColorCoder.createFromDOM = function(configElmt, uiContext) {
    var configuration, coder;

    Exhibit.jQuery(configElmt).hide();
    
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    coder = new Exhibit.OrderedColorCoder(
        configElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    try {
	    this._usePriority = coder._settings.usePriority;
        Exhibit.jQuery(configElmt).children().each(function(index, element) {
            coder._addEntry(
                Exhibit.getAttribute(this, "case"), 
                Exhibit.jQuery(this).text().trim(), 
                Exhibit.getAttribute(this, "color")
            );
        });
	    if (coder.getOthersIsDefault()) {
	        coder._addEntry(
		        "other",
		        coder.getOthersLabel(),
		        coder.getOthersColor());
	    }
	    if (coder.getMissingIsDefault()) {
	        coder._addEntry(
		        "missing",
		        coder.getMissingLabel(),
		        coder.getMissingColor());
	    }
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%coders.error.configuration", "OrderedColorCoder"));
    }
    
    Exhibit.OrderedColorCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Exhibit.OrderedColorCoder} coder
 * @param {Object} configuration
 */
Exhibit.OrderedColorCoder._configure = function(coder, configuration) {
    var entires, i;

    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    if (typeof configuration.entries !== "undefined") {
        entries = configuration.entries;
        for (i = 0; i < entries.length; i++) {
            coder._addEntry(entries[i].kase, entries[i].key, entries[i].color);
        }
	    if (this.getOthersIsDefault()) {
	        coder._addEntry(
		        "other",
		        this.getOthersLabel(),
		        this.getOthersColor());
	    }
	    if (this.getMissingIsDefault()) {
	        coder._addEntry(
		    "missing",
		        this.getMissingLabel(),
		        this.getMissingColor());
	    }
    }
};

/**
 *
 */
Exhibit.OrderedColorCoder.prototype.dispose = function() {
    this._map = null;
    this._order = null;
    this._dispose();
};

/**
 * @constant
 */
Exhibit.OrderedColorCoder._colorTable = {
    "red" :     "#ff0000",
    "green" :   "#00ff00",
    "blue" :    "#0000ff",
    "white" :   "#ffffff",
    "black" :   "#000000",
    "gray" :    "#888888"
};

/**
 * @param {String} kase
 * @param {String} key
 * @param {String} color
 */
Exhibit.OrderedColorCoder.prototype._addEntry = function(kase, key, color) {
    var entry, mixed;

    if (typeof Exhibit.OrderedColorCoder._colorTable[color] !== "undefined") {
        color = Exhibit.OrderedColorCoder._colorTable[color];
    }
    
    entry = null;
    mixed = false;
    switch (kase) {
    case "others":  entry = this._othersCase; break;
    case "missing": entry = this._missingCase; break;
    case "mixed": mixed = true; break;
    }
    if (entry !== null) {
        entry.label = key;
        entry.color = color;
	    entry.isDefault = false;
	    this._order.add(key);
    } else {
	    // the 'mixed' case will be entirely ignored
        if (!mixed) {
            this._map[key] = { color: color };
	        this._order.add(key);
	    }
    }
};

/**
 * @param {String} key
 * @param {Object} flags
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.translate = function(key, flags) {
    if (typeof this._map[key] !== "undefined") {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.keys.add(key);
        }
        return this._map[key].color;
    } else if (typeof key === "undefined" || key === null) {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.color;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.others = true;
        }
        return this._othersCase.color;
    }
};

/**
 * @param {Exhibit.Set} key
 * @param {Object} flags
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.translateSet = function(keys, flags) {
    var color, lastKey, self, keyOrder, lastKeyOrder;
    color = null;
    lastKey = null;
    self = this;
    keys.visit(function(key) {
        var color2 = self.translate(key, flags);
        if (color === null) {
            color = color2;
	        lastKey = key;
        } else if (color !== color2) {
	        if (key === null) {
	            key = self.getMissingLabel();
	        } else if (typeof self._map[key] === "undefined") {
	            key = self.getOthersLabel();
	        }
	        keyOrder = self._order.get(key);
	        lastKeyOrder = self._order.get(lastKey);
	        if (self._usePriority === "highest") {
		        if (keyOrder < lastKeyOrder) {
		            color = color2;
		            lastKey = key;
		        }
	        } else if (self._usePriority === "lowest") {
		        if (keyOrder > lastKeyOrder) {
		            color = color2;
		            lastKey = key;
		        }
	        } else {
		        // an incorrect setting value will cause problems
		        return false;
	        }
            return true;
        }
        return false;
    });
    
    if (color !== null) {
        return color;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.color;
    }
};

/**
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.getOthersLabel = function() {
    return this._othersCase.label;
};

/**
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.getOthersColor = function() {
    return this._othersCase.color;
};

/**
 * @returns {Boolean}
 */
Exhibit.OrderedColorCoder.prototype.getOthersIsDefault = function() {
    return this._othersCase.isDefault;
};

/**
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.getMissingLabel = function() {
    return this._missingCase.label;
};

/**
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.getMissingColor = function() {
    return this._missingCase.color;
};

/**
 * @returns {Boolean}
 */
Exhibit.OrderedColorCoder.prototype.getMissingIsDefault = function() {
    return this._missingCase.isDefault;
};

/**
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.getMixedLabel = function() {
    return this._mixedCase.label;
};

/**
 * @returns {String}
 */
Exhibit.OrderedColorCoder.prototype.getMixedColor = function() {
    return this._mixedCase.color;
};

/**
 * @returns {Boolean}
 */
Exhibit.OrderedColorCoder.prototype.getMixedIsDefault = function() {
    return this._mixedCase.isDefault;
};
/**
 * @fileOverview Code values with size.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {Element|jQuery} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.SizeCoder = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Coder(
        "size",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.SizeCoder._settingSpecs);
    
    this._map = {};
    this._mixedCase = {
        "label": Exhibit._("%coders.mixedCaseLabel"),
        "size": 10
    };
    this._missingCase = {
        "label": Exhibit._("%coders.missingCaseLabel"),
        "size": 10
    };
    this._othersCase = {
        "label": Exhibit._("%coders.othersCaseLabel"),
        "size": 10
    };

    this.register();
};

/**
 * @constant
 */
Exhibit.SizeCoder._settingSpecs = {
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.SizeCoder}
 */
Exhibit.SizeCoder.create = function(configuration, uiContext) {
    var coder, div;
    div = Exhibit.jQuery("<div>")
        .hide()
        .appendTo("body");
    coder = new Exhibit.SizeCoder(
        div,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SizeCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.SizeCoder}
 */
Exhibit.SizeCoder.createFromDOM = function(configElmt, uiContext) {
    var configuration, coder;

    Exhibit.jQuery(configElmt).hide();
    
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    coder = new Exhibit.SizeCoder(
        configElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    try {
        Exhibit.jQuery(configElmt).children().each(function(index, elmt) {
            coder._addEntry(
                Exhibit.getAttribute(this,  "case"),
                Exhibit.jQuery(this).text().trim(),
                Exhibit.getAttribute(this, "size")
            );
        });
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%coders.error.configuration", "SizeCoder"));
    }
    
    Exhibit.SizeCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Exhibit.SizeCoder} coder
 * @param {Object} configuration
 */
Exhibit.SizeCoder._configure = function(coder, configuration) {
    var entries, i;

    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        coder.getSettingSpecs(),
        coder._settings
    );
    
    if (typeof configuration.entries !== "undefined") {
        entries = configuration.entries;
        for (i = 0; i < entries.length; i++) {
            coder._addEntry(entries[i].kase, entries[i].key, entries[i].size);
        }
    }
};

/**
 *
 */
Exhibit.SizeCoder.prototype.dispose = function() {
    this._map = null;
    this._dispose();
};

/**
 * @param {String} kase
 * @param {String} key
 * @param {Number} size
 */
Exhibit.SizeCoder.prototype._addEntry = function(kase, key, size) {  
    var entry = null;
    switch (kase) {
    case "others":  entry = this._othersCase; break;
    case "mixed":   entry = this._mixedCase; break;
    case "missing": entry = this._missingCase; break;
    }
    if (entry !== null) {
        entry.label = key;
        entry.size = size;
    } else {
        this._map[key] = { size: size };
    }
};

/**
 * @param {String} key
 * @param {Object} flags
 * @returns {Number}
 */
Exhibit.SizeCoder.prototype.translate = function(key, flags) {
    if (typeof this._map[key] !== "undefined") {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.keys.add(key);
        }
        return this._map[key].size;
    } else if (typeof key === "undefined" || key === null) {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.size;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.others = true;
        }
        return this._othersCase.size;
    }
};

/**
 * @param {Exhibit.Set} keys
 * @param {Object} flags
 * @returns {Number}
 */
Exhibit.SizeCoder.prototype.translateSet = function(keys, flags) {
    var size, self;
    size = null;
    self = this;
    keys.visit(function(key) {
        var size2 = self.translate(key, flags);
        if (size === null) {
            size = size2;
        } else if (size !== size2) {
            if (typeof flags !== "undefined" && flags !== null) {
                flags.mixed = true;
            }
            size = self._mixedCase.size;
            return true;
        }
        return false;
    });
    
    if (size !== null) {
        return size;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.size;
    }
};

/**
 * @returns {String}
 */
Exhibit.SizeCoder.prototype.getOthersLabel = function() {
    return this._othersCase.label;
};

/**
 * @returns {Number}
 */
Exhibit.SizeCoder.prototype.getOthersSize = function() {
    return this._othersCase.size;
};

/**
 * @returns {String}
 */
Exhibit.SizeCoder.prototype.getMissingLabel = function() {
    return this._missingCase.label;
};

/**
 * @returns {Number}
 */
Exhibit.SizeCoder.prototype.getMissingSize = function() {
    return this._missingCase.size;
};

/**
 * @returns {String}
 */
Exhibit.SizeCoder.prototype.getMixedLabel = function() {
    return this._mixedCase.label;
};

/**
 * @returns {Number}
 */
Exhibit.SizeCoder.prototype.getMixedSize = function() {
    return this._mixedCase.size;
};
/**
 * @fileOverview Code values along a size gradient.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {Element|jQuery} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.SizeGradientCoder = function(containerElmt, uiContext) {
    Exhibit.jQuery.extend(this, new Exhibit.Coder(
        "sizegradient",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.SizeGradientCoder._settingSpecs);

    this._log = { 
        func: function(size) { return Math.ceil(Math.log(size)); },
        invFunc: function(size) { return Math.ceil(Math.exp(size)); }
    };
    this._linear = { 
        func: function(size) { return Math.ceil(size); },
        invFunc: function(size) { return Math.ceil(size); }
    };
    this._quad = {
        func: function(size) { return Math.ceil(Math.pow((size / 100), 2)); },
        invFunc: function(size) { return Math.sqrt(size) * 100; }
    };
    this._exp = { 
        func: function(size) { return Math.ceil(Math.exp(size)); },
        invFunc: function(size) { return Math.ceil(Math.log(size)); }
    };
    this._markerScale = this._quad; // default marker scale type
    this._valueScale = this._linear; // value scaling functionality needs to be added
    
    this._gradientPoints = [];
    this._mixedCase = {
        "label": Exhibit._("%coders.mixedCaseLabel"),
        "size": 20
    };
    this._missingCase = {
        "label": Exhibit._("%coders.missingCaseLabel"),
        "size": 20
    };
    this._othersCase = {
        "label": Exhibit._("%coders.othersCaseLabel"),
        "size": 20
    };
    this.register();
};

/**
 * @constant
 */
Exhibit.SizeGradientCoder._settingSpecs = {
};

/**
 * @param {Object} configuration
 * @param {Exhibit.UIContext} uiContext
 * @param {Exhibit.SizeGradientCoder}
 */
Exhibit.SizeGradientCoder.create = function(configuration, uiContext) {
    var coder, div;
    div = Exhibit.jQuery("<div>")
        .hide()
        .appendTo("body");
    coder = new Exhibit.SizeGradientCoder(
        div,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SizeGradientCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Element} configElmt
 * @param {Exhibit.UIContext} uiContext
 * @param {Exhibit.SizeGradientCoder}
 */
Exhibit.SizeGradientCoder.createFromDOM = function(configElmt, uiContext) {
    var configuration, coder, markerScale, gradientPoints, i, point, value, size;

    Exhibit.jQuery(configElmt).hide();
    
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    coder = new Exhibit.SizeGradientCoder(configElmt, Exhibit.UIContext.create(configuration, uiContext));
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        coder.getSettingSpecs(),
        coder._settings);
    
    try {
		markerScale = coder._settings.markerScale; 
		if (markerScale === "log") { coder._markerScale = coder._log; }
		if (markerScale === "linear") { coder._markerScale = coder._linear; }
		if (markerScale === "exp") { coder._markerScale = coder._exp; }
		
		gradientPoints = Exhibit.getAttribute(configElmt, "gradientPoints", ";");
		for (i = 0; i < gradientPoints.length; i++) {
			point = gradientPoints[i].split(',');
			value = parseFloat(point[0]); // add value scaling
			size = coder._markerScale.invFunc(parseFloat(point[1]));
			coder._gradientPoints.push({ value: value, size: size});
		}
		
        Exhibit.jQuery(configElmt).children().each(function(index, elmt) {
            coder._addEntry(
                Exhibit.getAttribute(this,  "case"),
                Exhibit.jQuery(this).text().trim(),
                Exhibit.getAttribute(this, "size")
            );
        });
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%coders.error.configuration", "SizeGradientCoder"));
    }
    
    Exhibit.SizeGradientCoder._configure(coder, configuration);
    return coder;
};

/**
 * @param {Exhibit.SizeGradientCoder} coder
 * @param {Object} configuration
 */
Exhibit.SizeGradientCoder._configure = function(coder, configuration) {
    var entries, i;

    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        coder.getSettingSpecs(),
        coder._settings);
    
    if (typeof configuration.entries !== "undefined") {
        entries = configuration.entries;
        for (i = 0; i < entries.length; i++) {
            coder._addEntry(entries[i].kase, entries[i].key, entries[i].size);
        }
    }
};

/**
 *
 */
Exhibit.SizeGradientCoder.prototype.dispose = function() {
    this._gradientPoints = null;
    this._dispose();
};

/**
 * @param {String} kase
 * @param {String} key
 * @param {Number} size
 */
Exhibit.SizeGradientCoder.prototype._addEntry = function(kase, key, size) {
    var entry = null;
    switch (kase) {
    case "others":  entry = this._othersCase; break;
    case "mixed":   entry = this._mixedCase; break;
    case "missing": entry = this._missingCase; break;
    }
    if (entry !== null) {
        entry.label = key;
        entry.size = size;
	}
};

/**
 * @param {String} key
 * @param {Object} flags
 * @returns {Number}
 */
Exhibit.SizeGradientCoder.prototype.translate = function(key, flags) {
    var self, gradientPoints, getSize;
	self = this;
	gradientPoints = this._gradientPoints;
	getSize = function(key) {
        var j, fraction, newSize;
		if (key.constructor !== Number) {
			key = parseFloat(key);
		}
		for (j = 0; j < gradientPoints.length; j++) {
			if (key === gradientPoints[j].value) {
				return self._markerScale.func(gradientPoints[j].size);
			} else if (gradientPoints[j+1] !== null) {
				if (key < gradientPoints[j+1].value) {
					fraction = (key - gradientPoints[j].value)/(gradientPoints[j+1].value - gradientPoints[j].value);
					newSize = Math.floor(gradientPoints[j].size + fraction*(gradientPoints[j+1].size - gradientPoints[j].size));
					return self._markerScale.func(newSize);
				}
			}
		}
	};
	
    if (key >= gradientPoints[0].value & key <= gradientPoints[gradientPoints.length-1].value) {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.keys.add(key);
        }
        return getSize(key);
    } else if (typeof key === "undefined" || key === null) {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.size;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.others = true;
        }
        return this._othersCase.size;
    }
};

/**
 * @param {Exhibit.Set} keys
 * @param {Object} flags
 * @returns {Number}
 */
Exhibit.SizeGradientCoder.prototype.translateSet = function(keys, flags) {
    var size, self;
    size = null;
    self = this;
    keys.visit(function(key) {
        var size2 = self.translate(key, flags);
        if (size === null) {
            size = size2;
        } else if (size !== size2) {
            if (typeof flags !== "undefined" && flags !== null) {
                flags.mixed = true;
            }
            size = self._mixedCase.size;
            return true;
        }
        return false;
    });
    
    if (size !== null) {
        return size;
    } else {
        if (typeof flags !== "undefined" && flags !== null) {
            flags.missing = true;
        }
        return this._missingCase.size;
    }
};

/**
 * @returns {String}
 */
Exhibit.SizeGradientCoder.prototype.getOthersLabel = function() {
    return this._othersCase.label;
};

/**
 * @returns {Number}
 */
Exhibit.SizeGradientCoder.prototype.getOthersSize = function() {
    return this._othersCase.size;
};

/**
 * @returns {String}
 */
Exhibit.SizeGradientCoder.prototype.getMissingLabel = function() {
    return this._missingCase.label;
};

/**
 * @returns {Number}
 */
Exhibit.SizeGradientCoder.prototype.getMissingSize = function() {
    return this._missingCase.size;
};

/**
 * @returns {String}
 */
Exhibit.SizeGradientCoder.prototype.getMixedLabel = function() {
    return this._mixedCase.label;
};

/**
 * @returns {Number}
 */
Exhibit.SizeGradientCoder.prototype.getMixedSize = function() {
    return this._mixedCase.size;
};
/**
 * @fileOverview
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Exhibit.UIContext} uiContext
 */ 
Exhibit.OrderedViewFrame = function(uiContext) {
    this._uiContext = uiContext;
    
    this._orders = null;
    this._possibleOrders = null;
    this._settings = {};

    this._historyKey = "orderedViewFrame";

    // functions to be defined by framed view
    this.parentReconstruct = null;
    this.parentHistoryAction = null;
};

/**
 * @constant
 */
Exhibit.OrderedViewFrame._settingSpecs = {
    "showAll":                  { type: "boolean", defaultValue: false },
    "grouped":                  { type: "boolean", defaultValue: true },
    "showDuplicates":           { type: "boolean", defaultValue: false },
    "abbreviatedCount":         { type: "int",     defaultValue: 10 },
    "showHeader":               { type: "boolean", defaultValue: true },
    "showSummary":              { type: "boolean", defaultValue: true },
    "showControls":             { type: "boolean", defaultValue: true },
    "showFooter":               { type: "boolean", defaultValue: true },
    "paginate":                 { type: "boolean", defaultValue: false },
    "pageSize":                 { type: "int",     defaultValue: 20 },
    "pageWindow":               { type: "int",     defaultValue: 2 },
    "page":                     { type: "int",     defaultValue: 0 },
    "alwaysShowPagingControls": { type: "boolean", defaultValue: false },
    "pagingControlLocations":   { type: "enum",    defaultValue: "topbottom",
                                  choices: [ "top", "bottom", "topbottom" ] }
};

/**
 * @param {Object} configuration
 */
Exhibit.OrderedViewFrame.prototype.configure = function(configuration) {
    if (typeof configuration.orders !== "undefined") {
        this._orders = [];
        this._configureOrders(configuration.orders);
    }
    if (typeof configuration.possibleOrders !== "undefined") {
        this._possibleOrders = [];
        this._configurePossibleOrders(configuration.possibleOrders);
    }

    Exhibit.SettingsUtilities.collectSettings(
        configuration, Exhibit.OrderedViewFrame._settingSpecs, this._settings);
        
    this._internalValidate();
};

/**
 * @param {Element} domConfiguration
 */
Exhibit.OrderedViewFrame.prototype.configureFromDOM = function(domConfiguration) {
    var orders, directions, i, possibleOrders, possibleDirections;
    orders = Exhibit.getAttribute(domConfiguration, "orders", ",");
    if (typeof orders !== "undefined" && orders !== null && orders.length > 0) {
        this._orders = [];
        this._configureOrders(orders);
    }
    
    directions = Exhibit.getAttribute(domConfiguration, "directions", ",");
    if (typeof directions !== "undefined" && directions !== null && directions.length > 0 && this._orders !== null) {
        for (i = 0; i < directions.length && i < this._orders.length; i++) {
            this._orders[i].ascending = (directions[i].toLowerCase() !== "descending");
        }
    }
    
    possibleOrders = Exhibit.getAttribute(domConfiguration, "possibleOrders", ",");
    if (typeof possibleOrders !== "undefined" && possibleOrders !== null && possibleOrders.length > 0) {
        this._possibleOrders = [];
        this._configurePossibleOrders(possibleOrders);
    }

    possibleDirections = Exhibit.getAttribute(domConfiguration, "possibleDirections", ",");
    if (typeof possibleDirections !== "undefined" && possibleDirections !== null && possibleDirections.length > 0 && typeof this._possibleOrders !== "undefined" && this._possibleOrders !== null) {
        for (i = 0; i < possibleDirections.length && i < this._possibleOrders.length; i++) {
            this._possibleOrders[i].ascending = (possibleDirections[i].toLowerCase() !== "descending");
        }
    }
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        domConfiguration, Exhibit.OrderedViewFrame._settingSpecs, this._settings);
        
    this._internalValidate();
};

/**
 *
 */
Exhibit.OrderedViewFrame.prototype.dispose = function() {
    if (this._headerDom) {
        this._headerDom.dispose();
        this._headerDom = null;
    }
    if (this._footerDom) {
        this._footerDom.dispose();
        this._footerDom = null;
    }
    
    this._divHeader = null;
    this._divFooter = null;
    this._uiContext = null;
};

/**
 *
 */
Exhibit.OrderedViewFrame.prototype._internalValidate = function() {
    if (this._orders !== null && this._orders.length === 0) {
        this._orders = null;
    }
    if (this._possibleOrders !== null && this._possibleOrders.length === 0) {
        this._possibleOrders = null;
    }
    if (this._settings.paginate) {
        this._settings.grouped = false;
    }
};

/**
 * @param {Array} orders
 */
Exhibit.OrderedViewFrame.prototype._configureOrders = function(orders) {
    var i, order, expr, ascending, expression, path, segment;
    for (i = 0; i < orders.length; i++) {
        order = orders[i];
        ascending = true;
        expr = null;

        if (typeof order === "string") {
            expr = order;
        } else if (typeof order === "object") {
            expr = order.expression;
            ascending = (typeof order.ascending !== "undefined") ?
                (order.ascending) :
                true;
        }

        if (expr !== null) {
            try {
                expression = Exhibit.ExpressionParser.parse(expr);
                if (expression.isPath()) {
                    path = expression.getPath();
                    if (path.getSegmentCount() === 1) {
                        segment = path.getSegment(0);
                        this._orders.push({
                            property:   segment.property,
                            forward:    segment.forward,
                            ascending:  ascending
                        });
                    }
                }
            } catch (e) {
                Exhibit.Debug.warn(Exhibit._("%orderedViewFrame.error.orderExpression", expr));
            }
        } else {
            Exhibit.Debug.warn(Exhibit._("%orderedViewFrame.error.orderObject", JSON.stringify(order)));
        }
    }
};

/**
 * @param {Array} possibleOrders
 */
Exhibit.OrderedViewFrame.prototype._configurePossibleOrders = function(possibleOrders) {
    var i, order, expr, ascending, expression, path, segment;
    for (i = 0; i < possibleOrders.length; i++) {
        order = possibleOrders[i];
        ascending = true;
        expr = null;
        
        if (typeof order === "string") {
            expr = order;
        } else if (typeof order === "object") {
            expr = order.expression;
            ascending = (typeof order.ascending !== "undefined") ?
                (order.ascending) :
                true;
        }

        if (expr !== null) {
            try {
                expression = Exhibit.ExpressionParser.parse(expr);
                if (expression.isPath()) {
                    path = expression.getPath();
                    if (path.getSegmentCount() === 1) {
                        segment = path.getSegment(0);
                        this._possibleOrders.push({
                            property:   segment.property,
                            forward:    segment.forward,
                            ascending:  ascending
                        });
                    }
                }
            } catch (e) {
                Exhibit.Debug.warn(Exhibit._("%orderedViewFrame.error.possibleOrderExpression", expr));
            }
        }  else {
            Exhibit.Debug.warn(Exhibit._("%orderedViewFrame.error.possibleOrderObject", JSON.stringify(order)));
        }
    }
};

/**
 *
 */
Exhibit.OrderedViewFrame.prototype.initializeUI = function() {
    var self;
    self = this;
    if (this._settings.showHeader) {
        this._headerDom = Exhibit.OrderedViewFrame.createHeaderDom(
            this._uiContext,
            this._divHeader, 
            this._settings.showSummary,
            this._settings.showControls,
            function(evt) { self._openSortPopup(evt, -1); },
            function(evt) { self._toggleGroup(evt); },
            function(pageIndex) { self._gotoPage(pageIndex); }
        );
    }
    if (this._settings.showFooter) {
        this._footerDom = Exhibit.OrderedViewFrame.createFooterDom(
            this._uiContext,
            this._divFooter, 
            function(evt) { self._setShowAll(true); },
            function(evt) { self._setShowAll(false); },
            function(pageIndex) { self._gotoPage(pageIndex); }
        );
    }
};

/**
 *
 */
Exhibit.OrderedViewFrame.prototype.reconstruct = function() {
    var self, collection, database, originalSize, currentSize, hasSomeGrouping, currentSet, orderElmts, buildOrderElmt, orders;
    self = this;
    collection = this._uiContext.getCollection();
    database = this._uiContext.getDatabase();
    
    originalSize = collection.countAllItems();
    currentSize = collection.countRestrictedItems();
    
    hasSomeGrouping = false;
    if (currentSize > 0) {
        currentSet = collection.getRestrictedItems();
        
        hasSomeGrouping = this._internalReconstruct(currentSet);
        
        /*
         *  Build sort controls
         */
        orderElmts = [];
        buildOrderElmt = function(order, index) {
            var property, label;
            property = database.getProperty(order.property);
            label = (typeof property !== "undefined" && property !== null) ?
                (order.forward ? property.getPluralLabel() : property.getReversePluralLabel()) :
                (order.forward ? order.property : "reverse of " + order.property);
                
            orderElmts.push(Exhibit.UI.makeActionLink(
                label,
                function(evt) {
                    self._openSortPopup(evt, index);
                }
            ));
        };
        orders = this._getOrders();
        for (i = 0; i < orders.length; i++) {
            buildOrderElmt(orders[i], i);
        }
        
        if (this._settings.showHeader && this._settings.showControls) {
            this._headerDom.setOrders(orderElmts);
            this._headerDom.enableThenByAction(orderElmts.length < this._getPossibleOrders().length);
        }
    }
    
    if (this._settings.showHeader && this._settings.showControls) {
        this._headerDom.groupOptionWidget.setChecked(this._settings.grouped);
    }

    if (this._settings.showFooter) {
        this._footerDom.setCounts(
            currentSize, 
            this._settings.abbreviatedCount, 
            this._settings.showAll, 
            (!(hasSomeGrouping && this._settings.grouped)
             && !this._settings.paginate)
        );
    }
};

/** 
 * @param {Exhibit.Set} allItems
 * @returns {Boolean}
 */
Exhibit.OrderedViewFrame.prototype._internalReconstruct = function(allItems) {
    var self, settings, database, orders, itemIndex, hasSomeGrouping, createItem, createGroup, processLevel, processNonNumericLevel, processNumericLevel, totalCount, pageCount, fromIndex, toIndex;
    self = this;
    settings = this._settings;
    database = this._uiContext.getDatabase();
    orders = this._getOrders();
    itemIndex = 0;
    
    hasSomeGrouping = false;
    createItem = function(itemID) {
        if ((itemIndex >= fromIndex && itemIndex < toIndex) || (hasSomeGrouping && settings.grouped)) {
            self.onNewItem(itemID, itemIndex);
        }
        itemIndex++;
    };
    createGroup = function(label, valueType, index) {
        if ((itemIndex >= fromIndex && itemIndex < toIndex) || (hasSomeGrouping && settings.grouped)) {
            self.onNewGroup(label, valueType, index);
        }
    };

    processLevel = function(items, index) {
        var order, values, valueType, property, keys, grouped, k, key;
        order = orders[index];
         values = order.forward ? 
            database.getObjectsUnion(items, order.property) : 
            database.getSubjectsUnion(items, order.property);
        
        valueType = "text";
        if (order.forward) {
            property = database.getProperty(order.property);
            valueType = (typeof property !== "undefined" && property !== null) ? property.getValueType() : "text";
        } else {
            valueType = "item";
        }
        
        keys = (valueType === "item" || valueType === "text") ?
            processNonNumericLevel(items, index, values, valueType) :
            processNumericLevel(items, index, values, valueType);
        
        grouped = false;
        for (k = 0; k < keys.length; k++) {
            if (keys[k].items.size() > 1) {
                grouped = true;
            }
        }

        if (grouped) {
            hasSomeGrouping = true;
        }
        
        for (k = 0; k < keys.length; k++) {
            key = keys[k];
            if (key.items.size() > 0) {
                if (grouped && settings.grouped) {
                    createGroup(key.display, valueType, index);
                }
                
                items.removeSet(key.items);
                if (key.items.size() > 1 && index < orders.length - 1) {
                    processLevel(key.items, index+1);
                } else {
                    key.items.visit(createItem);
                }
            }
        }
        
        if (items.size() > 0) {
            if (grouped && settings.grouped) {
                createGroup(Exhibit._("%general.missingSortKey"), valueType, index);
            }
            
            if (items.size() > 1 && index < orders.length - 1) {
                processLevel(items, index+1);
            } else {
                items.visit(createItem);
            }
        }
    };
    
    processNonNumericLevel = function(items, index, values, valueType) {
        var keys, compareKeys, retrieveItems, order, k, key, vals;
        keys = [];
        order = orders[index];
        
        if (valueType === "item") {
            values.visit(function(itemID) {
                var label = database.getObject(itemID, "label");
                label = (typeof label !== "undefined" && label !== null) ? label : itemID;
                keys.push({ itemID: itemID, display: label });
            });
            
            compareKeys = function(key1, key2) {
                var c = key1.display.localeCompare(key2.display);
                return c !== 0 ? c : key1.itemID.localeCompare(key2.itemID);
            };
            
            retrieveItems = order.forward ? function(key) {
                return database.getSubjects(key.itemID, order.property, null, items);
            } : function(key) {
                return database.getObjects(key.itemID, order.property, null, items);
            };
        } else { //text
            values.visit(function(value) {
                keys.push({ display: value });
            });
            
            compareKeys = function(key1, key2) {
                return key1.display.localeCompare(key2.display);
            };
            retrieveItems = order.forward ? function(key) {
                return database.getSubjects(key.display, order.property, null, items);
            } : function(key) {
                return database.getObjects(key.display, order.property, null, items);
            };
        }
        
        keys.sort(function(key1, key2) { 
            return (order.ascending ? 1 : -1) * compareKeys(key1, key2); 
        });
        
        for (k = 0; k < keys.length; k++) {
            key = keys[k];
            key.items = retrieveItems(key);
            if (!settings.showDuplicates) {
                items.removeSet(key.items);
            }
        }
        
        return keys;
    };
    
    processNumericLevel = function(items, index, values, valueType) {
        var keys, keyMap, order, valueParser, key, k, v;
        keys = [];
        keyMap = {};
        order = orders[index];
        
        if (valueType === "number") {
            valueParser = function(value) {
                if (typeof value === "number") {
                    return value;
                } else {
                    try {
                        return parseFloat(value);
                    } catch (e) {
                        return null;
                    }
                }
            };
        } else { //date
            valueParser = function(value) {
                if (value instanceof Date) {
                    return value.getTime();
                } else {
                    try {
                        return Exhibit.DateTime.parseIso8601DateTime(value.toString()).getTime();
                    } catch (e) {
                        return null;
                    }
                }
            };
        }
        
        values.visit(function(value) {
            var sortkey, key;
            sortkey = valueParser(value);
            if (typeof sortKey !== "undefined" && sortkey !== null) {
                key = keyMap[sortkey];
                if (!key) {
                    key = { sortkey: sortkey, display: value, values: [], items: new Exhibit.Set() };
                    keyMap[sortkey] = key;
                    keys.push(key);
                }
                key.values.push(value);
            }
        });
        
        keys.sort(function(key1, key2) { 
            return (order.ascending ? 1 : -1) * (key1.sortkey - key2.sortkey); 
        });
        
        for (k = 0; k < keys.length; k++) {
            key = keys[k];
            vals = key.values;
            for (v = 0; v < vals.length; v++) {
                if (order.forward) {
                    database.getSubjects(vals[v], order.property, key.items, items);
                } else {
                    database.getObjects(vals[v], order.property, key.items, items);
                }
            }
            
            if (!settings.showDuplicates) {
                items.removeSet(key.items);
            }
        }
        
        return keys;
    };

    totalCount = allItems.size();
    pageCount = Math.ceil(totalCount / settings.pageSize);
    fromIndex = 0;
    toIndex = settings.showAll ? totalCount : Math.min(totalCount, settings.abbreviatedCount);
    
    if (!settings.grouped && settings.paginate && (pageCount > 1 || (pageCount > 0 && settings.alwaysShowPagingControls))) {
        fromIndex = settings.page * settings.pageSize;
        toIndex = Math.min(fromIndex + settings.pageSize, totalCount);
        
        if (settings.showHeader && (settings.pagingControlLocations === "top" || settings.pagingControlLocations === "topbottom")) {
            this._headerDom.renderPageLinks(
                settings.page,
                pageCount,
                settings.pageWindow
            );
        }
        if (settings.showFooter && (settings.pagingControlLocations === "bottom" || settings.pagingControlLocations === "topbottom")) {
            this._footerDom.renderPageLinks(
                settings.page,
                pageCount,
                settings.pageWindow
            );
        }
    } else {
        if (settings.showHeader) {
            this._headerDom.hidePageLinks();
        }
        if (settings.showFooter) {
            this._footerDom.hidePageLinks();
        }
    }
    
    processLevel(allItems, 0);
    
    return hasSomeGrouping;
};

/**
 * @returns {Array}
 */
Exhibit.OrderedViewFrame.prototype._getOrders = function() {
    return this._orders || [ this._getPossibleOrders()[0] ];
};

/**
 * @returns {Array}
 */
Exhibit.OrderedViewFrame.prototype._getPossibleOrders = function() {
    var possibleOrders, i, p;
    possibleOrders = null;
    if (typeof this._possibleOrders === "undefined" ||
        this._possibleOrders === null) {
        possibleOrders = this._uiContext.getDatabase().getAllProperties();
        for (i = 0; i < possibleOrders.length; i++ ) {
            p = possibleOrders[i];
            possibleOrders[i] = { ascending:true, forward:true, property:p };
        }
    } else {
        possibleOrders = [].concat(this._possibleOrders);
    }
    
    if (possibleOrders.length === 0) {
        possibleOrders.push({
            property:   "label", 
            forward:    true, 
            ascending:  true 
        });
    }
    return possibleOrders;
};

/**
 * @pararm {jQuery.Event} evt
 * @param {Number} index
 * @returns {Object}
 */
Exhibit.OrderedViewFrame.prototype._openSortPopup = function(evt, index) {
    var self, database, popupDom, configuredOrders, order, property, propertyLabel, valueType, sortLabels, orders, possibleOrders, possibleOrder, skip, j, existingOrder, appendOrder;
    self = this;
    database = this._uiContext.getDatabase();
    
    popupDom = Exhibit.UI.createPopupMenuDom(evt.target);

    /*
     *  Ascending/descending/remove options for the current order
     */
    configuredOrders = this._getOrders();
    if (index >= 0) {
        order = configuredOrders[index];
        property = database.getProperty(order.property);
        propertyLabel = order.forward ? property.getPluralLabel() : property.getReversePluralLabel();
        valueType = order.forward ? property.getValueType() : "item";
        sortLabels = Exhibit.ViewUtilities.getSortLabels(valueType);

        popupDom.appendMenuItem(
            sortLabels.ascending, 
            Exhibit.urlPrefix +
                (order.ascending ? "images/option-check.png" : "images/option.png"),
            order.ascending ?
                function() {} :
                function() {
                    self._reSort(
                        index, 
                        order.property, 
                        order.forward, 
                        true,
                        false
                    );
                }
        );
        popupDom.appendMenuItem(
            sortLabels.descending, 
            Exhibit.urlPrefix +
                (order.ascending ? "images/option.png" : "images/option-check.png"),
            order.ascending ?
                function() {
                    self._reSort(
                        index, 
                        order.property, 
                        order.forward, 
                        false,
                        false
                    );
                } :
                function() {}
        );
        if (configuredOrders.length > 1) {
            popupDom.appendSeparator();
            popupDom.appendMenuItem(
                Exhibit._("%orderedViewFrame.removeOrderLabel"),
                null,
                function() {self._removeOrder(index);}
            );
        }
    }
    
    /*
     *  The remaining possible orders
     */
    orders = [];
    possibleOrders = this._getPossibleOrders();
    for (i = 0; i < possibleOrders.length; i++) {
        possibleOrder = possibleOrders[i];
        skip = false;
        for (j = (index < 0) ? configuredOrders.length - 1 : index; j >= 0; j--) {
            existingOrder = configuredOrders[j];
            if (existingOrder.property === possibleOrder.property && 
                existingOrder.forward === possibleOrder.forward) {
                skip = true;
                break;
            }
        }
        
        if (!skip) {
            property = database.getProperty(possibleOrder.property);
            orders.push({
                property:   possibleOrder.property,
                forward:    possibleOrder.forward,
                ascending:  possibleOrder.ascending,
                label:      possibleOrder.forward ? 
                                property.getPluralLabel() : 
                                property.getReversePluralLabel()
            });
        }
    }
    
    if (orders.length > 0) {
        if (index >= 0) {
            popupDom.appendSeparator();
        }
        
        orders.sort(function(order1, order2) {
            return order1.label.localeCompare(order2.label);
        });
        
        appendOrder = function(order) {
            popupDom.appendMenuItem(
                order.label,
                null,
                function() {
                    self._reSort(
                        index, 
                        order.property, 
                        order.forward, 
                        order.ascending,
                        true
                    );
                }
            );
        };
        
        for (i = 0; i < orders.length; i++) {
            appendOrder(orders[i]);
        }
    }
    popupDom.open(evt);
};

/**
 * @param {Number} index
 * @param {String} propertyID
 * @param {Boolean} forward
 * @param {Boolean} ascending
 * @param {Number} slice
 */
Exhibit.OrderedViewFrame.prototype._reSort = function(index, propertyID, forward, ascending, slice) {
    var newOrders, property, propertyLabel, valueType, sortLabels;
    oldOrders = this._getOrders();
    index = (index < 0) ? oldOrders.length : index;
    
    newOrders = oldOrders.slice(0, index);
    newOrders.push({ property: propertyID, forward: forward, ascending: ascending });
    if (!slice) {
        newOrders = newOrders.concat(oldOrders.slice(index+1));
    }
    
    property = this._uiContext.getDatabase().getProperty(propertyID);
    propertyLabel = forward ? property.getPluralLabel() : property.getReversePluralLabel();
    valueType = forward ? property.getValueType() : "item";
    sortLabels = Exhibit.ViewUtilities.getSortLabels(valueType);

    this.parentHistoryAction(
        this._historyKey,
        this.makeState(newOrders),
        Exhibit._("%orderedViewFrame.formatSortActionTitle",
            propertyLabel,
            ascending ?
                sortLabels.ascending :
                sortLabels.descending
        )
    );
};

/**
 * @param {Number} index
 */
Exhibit.OrderedViewFrame.prototype._removeOrder = function(index) {
    var oldOrders, newOrders, order, property, propertyLabel, valueType, sortLabels;
    oldOrders = this._getOrders();
    newOrders = oldOrders.slice(0, index).concat(oldOrders.slice(index + 1));
    
    order = oldOrders[index];
    property = this._uiContext.getDatabase().getProperty(order.property);
    propertyLabel = order.forward ?
        property.getPluralLabel() :
        property.getReversePluralLabel();
    valueType = order.forward ?
        property.getValueType() :
        "item";
    sortLabels = Exhibit.ViewUtilities.getSortLabels(valueType);
    
    this.parentHistoryAction(
        this._historyKey,
        this.makeState(newOrders),
        Exhibit._("%orderedViewFrame.formatRemoveOrderActionTitle",
            propertyLabel, order.ascending ?
                sortLabels.ascending :
                sortLabels.descending)
    );
};

/**
 * @param {Boolean} showAll
 */
Exhibit.OrderedViewFrame.prototype._setShowAll = function(showAll) {
    this.parentHistoryAction(
        this._historyKey,
        this.makeState(null, showAll),
        Exhibit._(
            showAll ?
                "%orderedViewFrame.showAllActionTitle" :
                "%orderedViewFrame.dontShowAllActionTitle")
    );
};

/**
 *
 */
Exhibit.OrderedViewFrame.prototype._toggleGroup = function() {
    var oldGrouped;
    oldGrouped = this._settings.grouped;

    this.parentHistoryAction(
        this._historyKey,
        this.makeState(null, !oldGrouped ? true : null, null, !oldGrouped),
        Exhibit._(
            oldGrouped ?
                "%orderedViewFrame.ungroupAsSortedActionTitle" :
                "%orderedViewFrame.groupAsSortedActionTitle")
    );
};

/**
 *
 */
Exhibit.OrderedViewFrame.prototype._toggleShowDuplicates = function() {
    var oldShowDuplicates;
    oldShowDuplicates = this._settings.showDuplicates;

    this.parentHistoryAction(
        this._historyKey,
        this.makeState(null, null, !oldShowDuplicates),
        Exhibit._(
            oldShowDuplicates ?
                "%orderedViewFrame.hideDuplicatesActionTitle" :
                "%orderedViewFrame.showDuplicatesActionTitle")
    );
};

/**
 * @param {Number} pageIndex
 */ 
Exhibit.OrderedViewFrame.prototype._gotoPage = function(pageIndex) {
    this.parentHistoryAction(
        this._historyKey,
        this.makeState(null, null, null, null, pageIndex),
        Exhibit.ViewUtilities.makePagingActionTitle(pageIndex)
    );
};

/**
 * @constant
 */
Exhibit.OrderedViewFrame.headerTemplate =
    '<div id="collectionSummaryDiv" style="display: none;"></div>' +
    '<div class="exhibit-collectionView-header-sortControls" style="display: none;" id="controlsDiv">' +
        '%1$s' + // sorting controls template
        '<span class="exhibit-collectionView-header-groupControl"> &bull; ' +
            '<a id="groupOption" class="exhibit-action"></a>' + 
        '</span>' +
    '</div>';

/**
 * @param {Exhibit.UIContext} uiContext
 * @param {Element} headerDiv
 * @param {Boolean} showSummary
 * @param {Boolean} showControls
 * @param {Function} onThenSortBy
 * @param {Function} onGroupToggle
 * @param {Function} gotoPage
 * @returns {Object}
 */
Exhibit.OrderedViewFrame.createHeaderDom = function(
    uiContext,
    headerDiv,
    showSummary,
    showControls,
    onThenSortBy,
    onGroupToggle,
    gotoPage
) {
    var template, dom;
    template = sprintf(
        Exhibit.OrderedViewFrame.headerTemplate +
            '<div class="exhibit-collectionView-pagingControls" style="display: none;" id="topPagingDiv"></div>',
        Exhibit._("%orderedViewFrame.sortingControlsTemplate"));

    dom = Exhibit.jQuery.simileDOM("string", headerDiv, template, {});
    Exhibit.jQuery(headerDiv).attr("class", "exhibit-collectionView-header");
    
    if (showSummary) {
        Exhibit.jQuery(dom.collectionSummaryDiv).show();
        dom.collectionSummaryWidget = Exhibit.CollectionSummaryWidget.create(
            {},
            dom.collectionSummaryDiv, 
            uiContext
        );
    }
    if (showControls) {
        Exhibit.jQuery(dom.controlsDiv).show();
        dom.groupOptionWidget = Exhibit.OptionWidget.create(
            {   label:      Exhibit._("%orderedViewFrame.groupedAsSortedOptionLabel"),
                onToggle:   onGroupToggle
            },
            dom.groupOption,
            uiContext
        );

        Exhibit.jQuery(dom.thenSortByAction).bind("click", onThenSortBy);

        dom.enableThenByAction = function(enabled) {
            Exhibit.UI.enableActionLink(dom.thenSortByAction, enabled);
        };
        dom.setOrders = function(orderElmts) {
            var addDelimter, i;
            Exhibit.jQuery(dom.ordersSpan).empty();
            
            addDelimiter = Exhibit.Formatter.createListDelimiter(dom.ordersSpan, orderElmts.length, uiContext);
            for (i = 0; i < orderElmts.length; i++) {
                addDelimiter();
                Exhibit.jQuery(dom.ordersSpan).append(orderElmts[i]);
            }
            addDelimiter();
        };
    }
    dom.renderPageLinks = function(page, totalPage, pageWindow) {
        Exhibit.OrderedViewFrame.renderPageLinks(dom.topPagingDiv, page, totalPage, pageWindow, gotoPage);
        Exhibit.jQuery(dom.topPagingDiv).show();
    };
    dom.hidePageLinks = function() {
        Exhibit.jQuery(dom.topPagingDiv).hide();
    };
    dom.dispose = function() {
        if (typeof dom.collectionSummaryWidget !== "undefined") {
            dom.collectionSummaryWidget.dispose();
            dom.collectionSummaryWidget = null;
        }
        
        dom.groupOptionWidget.dispose();
        dom.groupOptionWidget = null;
    };
    
    return dom;
};

/**
 * @constant
 */
Exhibit.OrderedViewFrame.footerTemplate = "<div id='showAllSpan'></div>";

/**
 * @param {Exhibit.UIContext} uiContext
 * @param {Element} footerDiv
 * @param {Function} onShowAll
 * @param {Function} onDontShowAll
 * @param {Function} gotoPage
 * @returns {Object}
 */ 
Exhibit.OrderedViewFrame.createFooterDom = function(
    uiContext,
    footerDiv,
    onShowAll,
    onDontShowAll,
    gotoPage
) {
    var dom;
    
    dom = Exhibit.jQuery.simileDOM(
        "string",
        footerDiv,
        Exhibit.OrderedViewFrame.footerTemplate +
            '<div class="exhibit-collectionView-pagingControls" style="display: none;" id="bottomPagingDiv"></div>',
        {}
    );
    Exhibit.jQuery(footerDiv).attr("class", "exhibit-collectionView-footer");
    
    dom.setCounts = function(count, limitCount, showAll, canToggle) {
        Exhibit.jQuery(dom.showAllSpan).empty();
        if (canToggle && count > limitCount) {
            Exhibit.jQuery(dom.showAllSpan).show();
            if (showAll) {
                Exhibit.jQuery(dom.showAllSpan).append(
                    Exhibit.UI.makeActionLink(
                        Exhibit._("%orderedViewFrame.formatDontShowAll", limitCount), onDontShowAll));
            } else {
                Exhibit.jQuery(dom.showAllSpan).append(
                    Exhibit.UI.makeActionLink(
                        Exhibit._("%orderedViewFrame.formatShowAll", count), onShowAll));
            }
        }
    };
    dom.renderPageLinks = function(page, totalPage, pageWindow) {
        Exhibit.OrderedViewFrame.renderPageLinks(dom.bottomPagingDiv, page, totalPage, pageWindow, gotoPage);
        Exhibit.jQuery(dom.bottomPagingDiv).show();
        Exhibit.jQuery(dom.showAllSpan).hide();
    };
    dom.hidePageLinks = function() {
        Exhibit.jQuery(dom.bottomPagingDiv).hide();
    };
    dom.dispose = function() {};
    
    return dom;
};

/**
 * @param {Element} parentElmt
 * @param {Number} page
 * @param {Number} pageCount
 * @param {Number} pageWindow
 * @param {Function} gotoPage
 */
Exhibit.OrderedViewFrame.renderPageLinks = function(parentElmt, page, pageCount, pageWindow, gotoPage) {
    var self, renderPageLink, renderPageNumber, renderHTML, pageWindowStart, pageWindowEnd, i;
    
    Exhibit.jQuery(parentElmt).attr("class", "exhibit-collectionView-pagingControls");
    Exhibit.jQuery(parentElmt).empty();
    
    self = this;
    renderPageLink = function(label, index) {
        var elmt, a, handler;
        elmt = Exhibit.jQuery("<span>")
            .attr("class", "exhibit-collectionView-pagingControls-page");
        Exhibit.jQuery(parentElmt).append(elmt);
        
        a = Exhibit.jQuery("<a>")
            .html(label)
            .attr("href", "#")
            .attr("title", Exhibit.ViewUtilities.makePagingLinkTooltip(index));
        elmt.append(a);
        
        handler = function(evt) {
            gotoPage(index);
            evt.preventDefault();
            evt.stopPropagation();
        };
        a.bind("click", handler);
    };

    renderPageNumber = function(index) {
        if (index === page) {
            var elmt = Exhibit.jQuery("<span>")
                .attr("class",
                      "exhibit-collectionView-pagingControls-currentPage")
                .html(index + 1);
            
            Exhibit.jQuery(parentElmt).append(elmt);
        } else {
            renderPageLink(index + 1, index);
        }
    };
    renderHTML = function(html) {
        var elmt = Exhibit.jQuery("<span>")
            .html(html);
        
        Exhibit.jQuery(parentElmt).append(elmt);
    };
    
    if (page > 0) {
        renderPageLink(Exhibit._("%orderedViewFrame.previousPage"), page - 1);
        if (Exhibit._("%orderedViewFrame.pageSeparator").length > 0) {
            renderHTML(" ");
        }
    }
    
    pageWindowStart = 0;
    pageWindowEnd = pageCount - 1;
    
    if (page - pageWindow > 1) {
        renderPageNumber(0);
        renderHTML(Exhibit._("%orderedViewFrame.pageWindowEllipses"));
        
        pageWindowStart = page - pageWindow;
    }
    if (page + pageWindow < pageCount - 2) {
        pageWindowEnd = page + pageWindow;
    }
    
    for (i = pageWindowStart; i <= pageWindowEnd; i++) {
        if (i > pageWindowStart && Exhibit._("%orderedViewFrame.pageSeparator").length > 0) {
            renderHTML(Exhibit._("%orderedViewFrame.pageSeparator"));
        }
        renderPageNumber(i);
    }
    
    if (pageWindowEnd < pageCount - 1) {
        renderHTML(Exhibit._("%orderedViewFrame.pageWindowEllipses"));
        renderPageNumber(pageCount - 1);
    }
    
    if (page < pageCount - 1) {
        if (Exhibit._("%orderedViewFrame.pageSeparator").length > 0) {
            renderHTML(" ");
        }
        renderPageLink(Exhibit._("%orderedViewFrame.nextPage"), page + 1);
    }
};

/**
 * Sub-component of components with identifiers, does not need its
 * own identifier.
 * @param {Object} [state]
 * @returns {Object}
 */
Exhibit.OrderedViewFrame.prototype.exportState = function(state) {
    if (typeof state === "undefined" || state === null) {
        return this.makeState();
    } else {
        return state;
    }
};

/**
 * @param {Object} state
 * @param {Array} state.orders
 * @param {Boolean} state.showAll
 * @param {Boolean} state.showDuplicates
 * @param {Boolean} state.grouped
 * @param {Number} state.page
 */
Exhibit.OrderedViewFrame.prototype.importState = function(state) {
    var changed, i, currentOrders;
    changed = false;

    // too many toggles to bother with monolithic state difference checking,
    // check each in turn
    if (state.grouped !== this._settings.grouped) {
        this._settings.grouped = state.grouped;
        changed = true;
    }
    if (state.showAll !== this._settings.showAll) {
        this._settings.showAll = state.showAll;
        changed = true;
    }
    if (state.showDuplicates !== this._settings.showDuplicates) {
        this._settings.showDuplicates = showDuplicates;
        changed = true;
    }
    if (state.page !== this._settings.page) {
        this._settings.page = state.page;
        changed = true;
    }
    if (state.orders.length !== this._getOrders().length) {
        this._orders = state.orders;
        changed = true;
    } else {
        currentOrders = this._getOrders();
        for (i = 0; i < state.orders.length; i++) {
            if (state.orders[i].property !== currentOrders[i].property ||
                state.orders[i].ascending !== currentOrders[i].ascending ||
                state.orders[i].descending !== currentOrders[i].descending) {
                this._orders = state.orders;
                changed = true;
                break;
            }
        }
    }

    if (changed) {
        this.parentReconstruct();
    }
};

/**
 * @param {Array} orders
 * @param {Boolean} showAll
 * @param {Boolean} showDuplicates
 * @param {Boolean} grouped
 * @param {Number} page
 * @returns {Object}
 */
Exhibit.OrderedViewFrame.prototype.makeState = function(
    orders,
    showAll,
    showDuplicates,
    grouped,
    page
) {
    orders = (typeof orders !== "undefined" && orders !== null) ?
        orders :
        this._getOrders();
    showAll = (typeof showAll !== "undefined" && showAll !== null) ?
        showAll :
        this._settings.showAll;
    showDuplicates = (typeof showDuplicates !== "undefined" &&
                      showDuplicates !== null) ?
        showDuplicates :
        this._settings.showDuplicates;
    grouped = (typeof grouped !== "undefined" && grouped !== null) ?
        grouped :
        this._settings.grouped;
    page = (typeof page !== "undefined" && page !== null) ?
        page :
        this._settings.page;
    
    return {
        "orders": orders,
        "showAll": showAll,
        "showDuplicates": showDuplicates,
        "grouped": grouped,
        "page": page
    };
};

/**
 * @param {Object} state
 * @returns {Boolean}
 */
Exhibit.OrderedViewFrame.prototype.stateDiffers = function(state) {
    var differs, currentOrders;
    differs = false;
    differs = (state.page !== this._settings.page ||
               state.grouped !== this._settings.grouped ||
               state.showAll !== this._settings.showAll ||
               state.showDuplicates !== this._settings.showDuplicates ||
               state.orders.length !== this._getOrders().length);
    if (!differs) {
        currentOrders = this._getOrders();
        for (i = 0; i < state.orders.length; i++) {
            if (state.orders[i].property !== currentOrders[i].property ||
                state.orders[i].ascending !== currentOrders[i].ascending ||
                state.orders[i].descending !== currentOrders[i].descending) {
                differs = true;
                break;
            }
        }
    }

    return differs;
};
/**
 * @fileOverview Tabular view methods and UI.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.TabularView = function(containerElmt, uiContext) {
    var view = this;
    Exhibit.jQuery.extend(this, new Exhibit.View(
        "tabular",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.TabularView._settingSpecs);
    Exhibit.jQuery.extend(this._settings, { rowStyler: null, tableStyler: null, indexMap: {} });

    this._columns = [];
    this._rowTemplate = null;
    this._dom = null;

    this._onItemsChanged = function(evt) {
        view._settings.page = 0;
        view._reconstruct();
    };

    Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
        "onItemsChanged.exhibit",
        view._onItemsChanged
    );

    this.register();
};

/**
 * @constant
 */
Exhibit.TabularView._settingSpecs = {
    "sortAscending":        { type: "boolean", defaultValue: true },
    "sortColumn":           { type: "int",     defaultValue: 0 },
    "showSummary":          { type: "boolean", defaultValue: true },
    "border":               { type: "int",     defaultValue: 1 },
    "cellPadding":          { type: "int",     defaultValue: 5 },
    "cellSpacing":          { type: "int",     defaultValue: 3 },
    "paginate":             { type: "boolean", defaultValue: false },
    "pageSize":             { type: "int",     defaultValue: 20 },
    "pageWindow":           { type: "int",     defaultValue: 2 },
    "page":                 { type: "int",     defaultValue: 0 },
    "alwaysShowPagingControls": { type: "boolean", defaultValue: false },
    "pagingControlLocations":   { type: "enum",    defaultValue: "topbottom", choices: [ "top", "bottom", "topbottom" ] }
};

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.TabularView}
 */
Exhibit.TabularView.create = function(configuration, containerElmt, uiContext) {
    var view = new Exhibit.TabularView(
        containerElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    Exhibit.TabularView._configure(view, configuration);
    
    view._internalValidate();

    view._initializeUI();
    return view;
};

/**
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.TabularView}
 */
Exhibit.TabularView.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, view, expressions, labels, s, i, expression, formats, index, startPosition, column, o, tables, f;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    
    uiContext = Exhibit.UIContext.createFromDOM(configElmt, uiContext);
    
    view = new Exhibit.TabularView(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt : configElmt, 
        uiContext
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, view.getSettingSpecs(), view._settings);
    
    try {
        expressions = [];
        labels = Exhibit.getAttribute(configElmt, "columnLabels", ",") || [];
        
        s = Exhibit.getAttribute(configElmt, "columns");
        if (typeof s !== "undefined" && s !== null && s.length > 0) {
            expressions = Exhibit.ExpressionParser.parseSeveral(s);
        }
        
        for (i = 0; i < expressions.length; i++) {
            expression = expressions[i];
            view._columns.push({
                expression: expression,
                uiContext:  Exhibit.UIContext.create({}, view.getUIContext(), true),
                styler:     null,
                label:      i < labels.length ? labels[i] : null,
                format:     "list"
            });
        }
        
        formats = Exhibit.getAttribute(configElmt, "columnFormats");
        if (typeof formats !== "undefined" && formats !== null && formats.length > 0) {
            index = 0;
            startPosition = 0;
            while (index < view._columns.length && startPosition < formats.length) {
                column = view._columns[index];
                o = {};
                
                column.format = Exhibit.FormatParser.parseSeveral(column.uiContext, formats, startPosition, o);
                
                startPosition = o.index;
                while (startPosition < formats.length && " \t\r\n".indexOf(formats.charAt(startPosition)) >= 0) {
                    startPosition++;
                }
                if (startPosition < formats.length && formats.charAt(startPosition) === ",") {
                    startPosition++;
                }
                
                index++;
            }
        }
        
        tables = Exhibit.jQuery("table", configElmt);
        if (tables.length > 0 && Exhibit.jQuery("table:eq(0) tr", configElmt).length > 0) {
            view._rowTemplate = Exhibit.Lens.compileTemplate(Exhibit.jQuery("table:eq(0) tr:eq(0)", configElmt).get(0), false, uiContext);
        }
    } catch (e) {
        Exhibit.Debug.exception(e, Exhibit._("%TabularView.error.configuration"));
    }
    
    s = Exhibit.getAttribute(configElmt, "rowStyler");
    if (typeof s !== "undefined" && s !== null && s.length > 0) {
        f = eval(s);
        if (typeof f === "function") {
            view._settings.rowStyler = f;
        }
    }
    s = Exhibit.getAttribute(configElmt, "tableStyler");
    if (typeof s !== "undefined" && s !== null && s.length > 0) {
        f = eval(s);
        if (typeof f === "function") {
            view._settings.tableStyler = f;
        }
    }
        
    Exhibit.TabularView._configure(view, configuration);
    view._internalValidate();

    view._initializeUI();
    return view;
};

/**
 * @param {Exhibit.TabularView} view
 * @param {Object} configuration
 */
Exhibit.TabularView._configure = function(view, configuration) {
    var columns, i, column, expr, styler, label, format, expression, path;
    Exhibit.SettingsUtilities.collectSettings(configuration, Exhibit.TabularView._settingSpecs, view._settings);
    
    if (typeof configuration.columns !== "undefined") {
        columns = configuration.columns;
        for (i = 0; i < columns.length; i++) {
            column = columns[i];
            styler = null;
            label = null;
            format = null;
            
            if (typeof column === "string") {
                expr = column;
            } else {
                expr = column.expression;
                styler = column.styler;
                label = column.label;
                format = column.format;
            }
            
            expression = Exhibit.ExpressionParser.parse(expr);
            if (expression.isPath()) {
                path = expression.getPath();
                if (typeof format !== "undefined" && format !== null && format.length > 0) {
                    format = Exhibit.FormatParser.parse(view.getUIContext(), format, 0);
                } else {
                    format = "list";
                }
                
                view._columns.push({
                    expression: expression,
                    styler:     styler,
                    label:      label,
                    format:     format,
                    uiContext:  view.getUIContext()
                });
            }
        }
    }
    
    if (typeof configuration.rowStyler !== "undefined") {
        view._settings.rowStyler = configuration.rowStyler;
    }
    if (typeof configuration.tableStyler !== "undefined") {
        view._settings.tableStyler = configuration.tableStyler;
    }
};

/**
 *
 */
Exhibit.TabularView.prototype._internalValidate = function() {
    var database, propertyIDs, i, propertyID;
    if (this._columns.length === 0) {
        database = this.getUIContext().getDatabase();
        propertyIDs = database.getAllProperties();
        for (i = 0; i < propertyIDs.length; i++) {
            propertyID = propertyIDs[i];
            if (propertyID !== "uri") {
                this._columns.push(
                    {   expression: Exhibit.ExpressionParser.parse("." + propertyID),
                        styler:     null,
                        label:      database.getProperty(propertyID).getLabel(),
                        format:     "list"
                    }
                );
            }
        }
    }
    this._settings.sortColumn = 
        Math.max(0, Math.min(this._settings.sortColumn,
                             this._columns.length - 1));
};

/**
 *
 */
Exhibit.TabularView.prototype.dispose = function() {
    Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
        "onItemsChanged.exhibit",
        this._onItemsChanged
    );

    this._collectionSummaryWidget.dispose();
    this._collectionSummaryWidget = null;
    this._dom = null;

    this._dispose();
};

/**
 *
 */
Exhibit.TabularView.prototype._initializeUI = function() {
    var self = this;
    
    Exhibit.jQuery(this.getContainer()).empty();
    self._initializeViewUI(function() {
        return Exhibit.jQuery(self._dom.bodyDiv).html();
    });

    this._dom = Exhibit.TabularView.createDom(this.getContainer());
    this._collectionSummaryWidget = Exhibit.CollectionSummaryWidget.create(
        {}, 
        this._dom.collectionSummaryDiv, 
        this.getUIContext()
    );
    
    if (!this._settings.showSummary) {
        Exhibit.jQuery(this._dom.collectionSummaryDiv).hide();
    }
    
    Exhibit.View.addViewState(
        this.getID(),
        this.exportState()
    );

    this._reconstruct();
};

/**
 *
 */
Exhibit.TabularView.prototype._reconstruct = function() {
    var self, collection, database, bodyDiv, items, originalSize, currentSet, sortColumn, sorter, table, tr, createColumnHeader, i, renderItem, start, end, generatePagingControls;
    self = this;
    collection = this.getUIContext().getCollection();
    database = this.getUIContext().getDatabase();
    
    bodyDiv = this._dom.bodyDiv;
    Exhibit.jQuery(bodyDiv).empty();

    /*
     *  Get the current collection and check if it's empty
     */
    items = [];
    originalSize = collection.countAllItems();
    if (originalSize > 0) {
        currentSet = collection.getRestrictedItems();
        currentSet.visit(function(itemID) { items.push({ id: itemID, sortKey: "" }); });
    }
    
    if (items.length > 0) {
        /*
         *  Sort the items
         */
        sortColumn = this._columns[this._settings.sortColumn];
        sorter = this._createSortFunction(
            items,
            sortColumn.expression,
            this._settings.sortAscending
        );
        items.sort(
            this._stabilize(
                sorter,
                this._settings.indexMap,
                originalSize + 1
            )
        );
    
        // preserve order for next time
        for (i = 0; i < items.length; i++) {
            this._settings.indexMap[items[i].id] = i;
        }

        /*
         *  Style the table
         */
        table = Exhibit.jQuery("<table>");
        table.attr("class", "exhibit-tabularView-body");
        if (this._settings.tableStyler !== null) {
            this._settings.tableStyler(table.get(0), database);
        } else {
            table.attr("cellSpacing", this._settings.cellSpacing)
                .attr("cellPadding", this._settings.cellPadding)
                .attr("border", this._settings.border);
        }
        
        /*
         *  Create the column headers
         */
        tr = Exhibit.jQuery("<tr>");
        table.prepend(tr);
        createColumnHeader = function(i) {
            var column, td;
            column = self._columns[i];
            if (typeof column.label === "undefined" || column.label === null) {
                column.label = self._getColumnLabel(column.expression);
            }

            td = Exhibit.jQuery("<th>");
            Exhibit.TabularView.createColumnHeader(
                exhibit, td.get(0), column.label, i === self._settings.sortColumn, self._settings.sortAscending,
                function(evt) {
                    self._doSort(i);
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            );
            tr.append(td);
        };
        for (i = 0; i < this._columns.length; i++) {
            createColumnHeader(i);
        }

        /*
         *  Create item rows
         */
        if (this._rowTemplate !== null) {
            renderItem = function(i) {
                var item, tr;
                item = items[i];
                tr = Exhibit.Lens.constructFromLensTemplate(item.id, self._rowTemplate, table, self.getUIContext());
                
                if (self._settings.rowStyler !== null) {
                    self._settings.rowStyler(item.id, database, tr, i);
                }
            };
        } else {
            renderItem = function(i) {
                var item, tr, makeAppender, c, column, td, results, valueType;
                item = items[i];
                tr = Exhibit.jQuery("<tr>");
                table.append(tr);
                makeAppender = function(el) {
                    return function(elmt) {
                        Exhibit.jQuery(el).append(elmt);
                    };
                };
                for (c = 0; c < self._columns.length; c++) {
                    column = self._columns[c];
                    td = Exhibit.jQuery("<td>");
                    tr.append(td);
                    
                    results = column.expression.evaluate(
                        { "value" : item.id }, 
                        { "value" : "item" }, 
                        "value",
                        database
                    );
                    
                    valueType = column.format === "list" ? results.valueType : column.format;
                    column.uiContext.formatList(
                        results.values, 
                        results.size,
                        valueType,
                        makeAppender(td)
                    );
                    
                    if (typeof column.styler !== "undefined" && column.styler !== null) {
                        column.styler(item.id, database, td.get(0));
                    }
                }
                
                if (self._settings.rowStyler !== null) {
                    self._settings.rowStyler(item.id, database, tr.get(0), i);
                }
            };
        }
        generatePagingControls = false;
        if (this._settings.paginate) {
            start = this._settings.page * this._settings.pageSize;
            end = Math.min(start + this._settings.pageSize, items.length);
            
            generatePagingControls = (items.length > this._settings.pageSize) || (items.length > 0 && this._settings.alwaysShowPagingControls);
        } else {
            start = 0;
            end = items.length;
        }
        for (i = start; i < end; i++) {
            renderItem(i);
        }

        Exhibit.jQuery(bodyDiv).append(table);

        if (generatePagingControls) {
            if (this._settings.pagingControlLocations === "top" || this._settings.pagingControlLocations === "topbottom") {
                this._renderPagingDiv(this._dom.topPagingDiv, items.length, this._settings.page);
                Exhibit.jQuery(this._dom.topPagingDiv).show();
            }
            
            if (this._settings.pagingControlLocations === "bottom" || this._settings.pagingControlLocations === "topbottom") {
                this._renderPagingDiv(this._dom.bottomPagingDiv, items.length, this._settings.page);
                Exhibit.jQuery(this._dom.bottomPagingDiv).show();
            }
        } else {
            Exhibit.jQuery(this._dom.topPagingDiv).hide();
            Exhibit.jQuery(this._dom.bottomPagingDiv).hide();
        }
    }
};

/**
 * @param {Element} parentElmt
 * @param {Number} itemCount
 * @param {Number} page
 */
Exhibit.TabularView.prototype._renderPagingDiv = function(parentElmt, itemCount, page) {
    var pageCount, self;
    pageCount = Math.ceil(itemCount / this._settings.pageSize);
    self = this;
    
    Exhibit.OrderedViewFrame.renderPageLinks(
        parentElmt, 
        page,
        pageCount,
        this._settings.pageWindow,
        function(p) {
            self._gotoPage(p);
        }
    );
};

/**
 * @param {Exhibit.Expression} expression
 * @returns {String}
 */
Exhibit.TabularView.prototype._getColumnLabel = function(expression) {
    var database, path, segment, propertyID, property;
    database = this.getUIContext().getDatabase();
    path = expression.getPath();
    segment = path.getSegment(path.getSegmentCount() - 1);
    propertyID = segment.property;
    property = database.getProperty(propertyID);
    if (typeof property !== "undefined" && property !== null) {
        return segment.forward ? property.getLabel() : property.getReverseLabel();
    } else {
        return propertyID;
    }
};

/**
 * Stablize converts an arbitrary sorting function into one that breaks ties 
 * in that function according to item indices stored in indexMap.  Thus if
 * indexMap contains the indices of items under a previous order, then the
 * sort will preserve that previous order in the case of ties.
 *
 * If sorting is interleaved with faceting, items that go out-of and back-into 
 * view will not be stabilized as their past index will be forgotten while they
 * are out of view.
 *
 * @param {Function} f
 * @param {Object} indexMap
 * @returns {Function}
 */
Exhibit.TabularView.prototype._stabilize = function(f, indexMap)  {
    var stable;
    stable = function(item1, item2) {
        var cmp = f(item1, item2);
        if (cmp) {
            return cmp;
        }
        else {
            i1 = typeof indexMap[item1.id] !== "undefined" ?
                indexMap[item1.id] :
                -1;
            i2 = typeof indexMap[item2.id] !== "undefined" ?
                indexMap[item2.id] :
                -1;
            return i1-i2;
        }
    };
    return stable;
};

/**
 * @param {Array} items
 * @param {Exhibit.Expression} expression
 * @param {Boolean} ascending
 * @returns {Function}
 */
Exhibit.TabularView.prototype._createSortFunction = function(items, expression, ascending) {
    var database, multiply, numericFunction, textFunction, valueTypes, valueTypeMap, makeSetter, i, item, r, coercedValueType, coersion, sortingFunction;
    database = this.getUIContext().getDatabase();
    multiply = ascending ? 1 : -1;
    
    numericFunction = function(item1, item2) {
        var val = multiply * (item1.sortKey - item2.sortKey);
        return isNaN(val) ? 0 : val;
    };
    textFunction = function(item1, item2) {
        return multiply * item1.sortKey.localeCompare(item2.sortKey);
    };
    
    valueTypes = [];
    valueTypeMap = {};
    makeSetter = function(it) {
        return function(value) {
            it.sortKey = value;
        };
    };
    for (i = 0; i < items.length; i++) {
        item = items[i];
        r = expression.evaluate(
            { "value" : item.id }, 
            { "value" : "item" }, 
            "value",
            database
        );
        r.values.visit(makeSetter(item));
        
        if (typeof valueTypeMap[r.valueType] === "undefined") {
            valueTypeMap[r.valueType] = true;
            valueTypes.push(r.valueType);
        }
    }
    
    coercedValueType = "text";
    if (valueTypes.length === 1) {
        coercedValueType = valueTypes[0];
    } else {
        coercedValueType = "text";
    }
    
    if (coercedValueType === "number") {
        sortingFunction = numericFunction;
        coersion = function(v) {
            if (typeof v === "undefined" || v === null) {
                return Number.NEGATIVE_INFINITY;
            } else if (typeof v === "number") {
                return v;
            } else {
                var n = parseFloat(v);
                if (isNaN(n)) {
                    return Number.MAX_VALUE;
                } else {
                    return n;
                }
            }
        };
    } else if (coercedValueType === "date") {
        sortingFunction = numericFunction;
        coersion = function(v) {
            if (typeof v === "undefined" || v === null) {
                return Number.NEGATIVE_INFINITY;
            } else if (v instanceof Date) {
                return v.getTime();
            } else {
                try {
                    return Exhibit.DateTime.parseIso8601DateTime(v).getTime();
                } catch (e) {
                    return Number.MAX_VALUE;
                }
            }
        };
    } else if (coercedValueType === "boolean") {
        sortingFunction = numericFunction;
        coersion = function(v) {
            if (typeof v === "undefined" || v === null) {
                return Number.MAX_VALUE;
            } else if (typeof v === "boolean") {
                return v ? 1 : 0;
            } else {
                return v.toString().toLowerCase() === "true";
            }
        };
    } else if (coercedValueType === "item") {
        sortingFunction = textFunction;
        coersion = function(v) {
            if (typeof v === "undefined" || v === null) {
                return Exhibit._("%general.missingSortKey");
            } else {
                var label = database.getObject(v, "label");
                return (typeof label === "undefined" || label === null) ? v : label;
            }
        };
    } else {
        sortingFunction = textFunction;
        coersion = function(v) {
            if (typeof v === "undefined" || v === null) {
                return Exhibit._("%general.missingSortKey");
            } else {
                return v.toString();
            }
        };
    }
    
    for (i = 0; i < items.length; i++) {
        item = items[i];
        item.sortKey = coersion(item.sortKey);
    }
    
    return sortingFunction;
};

/**
 * @param {Number} columnIndex
 */
Exhibit.TabularView.prototype._doSort = function(columnIndex) {
    var oldSortColumn, oldSortAscending;
    oldSortColumn = this._settings.sortColumn;
    oldSortAscending = this._settings.sortAscending;
    this._settings.sortColumn = columnIndex;
    this._settings.sortAscending = oldSortColumn === columnIndex ? !oldSortAscending : true;
    this._settings.page = 0;
    
    Exhibit.History.pushComponentState(
        this,
        Exhibit.View._registryKey,
        this.exportState(),
        Exhibit._(this._settings.sortAscending ? "%TabularView.sortColumnAscending" : "%TabularView.sortColumnDescending", this._columns[columnIndex].label),
        true
    );
};

/**
 * @param {Number} page
 */
Exhibit.TabularView.prototype._gotoPage = function(page) {
    this._settings.page = page;

    Exhibit.History.pushComponentState(
        this,
        Exhibit.View._registryKey,
        this.exportState(),
        Exhibit.ViewUtilities.makePagingActionTitle(page),
        true
    );
};

/**
 * @returns {Object}
 */
Exhibit.TabularView.prototype.exportState = function() {
    return {
        "page": this._settings.page,
        "sortColumn": this._settings.sortColumn,
        "sortAscending": this._settings.sortAscending
    };
};

/**
 * @param {Object} state
 */
Exhibit.TabularView.prototype.importState = function(state) {
    if (this.getUIContext() !== null) {
        this._settings.page = state.page;
        this._settings.sortColumn = state.sortColumn;
        this._settings.sortAscending = state.sortAscending;
        // this should probably take args, the way facets do - applyState
        this._reconstruct();
    }
};

/**
 * @param {Exhibit.Set} values
 * @param {String} valueType
 * @param {Element} parentElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.TabularView._constructDefaultValueList = function(values, valueType, parentElmt, uiContext) {
    uiContext.formatList(values, values.size(), valueType, function(elmt) {
        parentElmt.appendChild(elmt);
    });
};

/**
 * @param {Element} div
 * @returns {Element}
 */
Exhibit.TabularView.createDom = function(div) {
    var headerTemplate;
    headerTemplate = {
        elmt:       div,
        "class":  "exhibit-collectionView-header",
        children: [
            {   "tag":    "div",
                "field":  "collectionSummaryDiv"
            },
            {   "tag":    "div",
                "class":  "exhibit-tabularView-pagingControls",
                "field":  "topPagingDiv"
            },
            {   "tag":    "div",
                "field":  "bodyDiv"
            },
            {   "tag":    "div",
                "class":  "exhibit-tabularView-pagingControls",
                "field":  "bottomPagingDiv"
            }
        ]
    };
    return Exhibit.jQuery.simileDOM("template", headerTemplate);
};

/**
 * @param {Exhibit._Impl} exhibit
 * @param {Element} th
 * @param {String} label
 * @param {Boolean} sort
 * @param {Boolean} sortAscending
 * @param {Function} sortFunction
 * @returns {Element}
 */
Exhibit.TabularView.createColumnHeader = function(
    exhibit, 
    th,
    label,
    sort,
    sortAscending,
    sortFunction
) {
    var template, dom;
    template = {
        "elmt":   th,
        "class":  sort ? 
                    "exhibit-tabularView-columnHeader-sorted" : 
                    "exhibit-tabularView-columnHeader",
        "title": Exhibit._(sort ? "%TabularView.columnHeaderReSortTooltip" : "%TabularView.columnHeaderSortTooltip"),
        "children": [ label ]
    };
    if (sort) {
        template.children.push({
            elmt: Exhibit.UI.createTranslucentImage(
                sortAscending ? "images/up-arrow.png" : "images/down-arrow.png")
        });
    }
    Exhibit.jQuery(th).bind("click", sortFunction);
    
    dom = Exhibit.jQuery.simileDOM("template", template);
    return dom;
};
/**
 * @fileOverview Thumbnail view functions and UI.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 * @author <a href="mailto:axel@pike.org">Axel Hecht</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElement
 * @param {Exhibit.UIContext} uiContext
 */ 
Exhibit.ThumbnailView = function(containerElmt, uiContext) {
    var view = this;
    Exhibit.jQuery.extend(this, new Exhibit.View(
        "thumbnail",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.ThumbnailView._settingSpecs);

    this._onItemsChanged = function() {
        // @@@this will ignore the stored state, which is odd
        // it should probably replace the state after doing this - 
        // or forget it since this will always ignore the stored state,
        // correctly
        view._orderedViewFrame._settings.page = 0;
        view._reconstruct();
    };
    Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
        "onItemsChanged.exhibit",
        view._onItemsChanged
    );

    this._orderedViewFrame = new Exhibit.OrderedViewFrame(uiContext);
    this._orderedViewFrame.parentReconstruct = function() {
        view._reconstruct();
    };
    this._orderedViewFrame.parentHistoryAction = function(child, state, title) {
        Exhibit.History.pushComponentState(
            view,
            Exhibit.View.getRegistryKey(),
            view.exportState(view.makeStateWithSub(child, state)),
            title,
            true
        );
    };

    this.register();
};

/**
 * @constant
 */
Exhibit.ThumbnailView._settingSpecs = {
    "columnCount":          { type: "int", defaultValue: -1 }
};

/**
 * Constant leftover from a now unnecessary IE hack.
 * @constant
 */
Exhibit.ThumbnailView._itemContainerClass = "exhibit-thumbnailView-itemContainer";

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ThumbnailView}
 */
Exhibit.ThumbnailView.create = function(configuration, containerElmt, uiContext) {
    var view = new Exhibit.ThumbnailView(
        containerElmt,
        Exhibit.UIContext.create(configuration, uiContext, true)
    );

    view._lensRegistry = Exhibit.UIContext.createLensRegistry(
        configuration,
        uiContext.getLensRegistry()
    );

    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        view.getSettingSpecs(),
        view._settings
    );

    view._orderedViewFrame.configure(configuration);

    view._initializeUI();
    return view;
};

/**
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ThumbnailView}
 */
Exhibit.ThumbnailView.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, view;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    view = new Exhibit.ThumbnailView(
        typeof containerElmt !== "undefined" && containerElmt !== null ?
            containerElmt :
            configElmt,
        Exhibit.UIContext.createFromDOM(configElmt, uiContext, true)
    );

    view._lensRegistry = Exhibit.UIContext.createLensRegistryFromDOM(
        configElmt,
        configuration,
        uiContext.getLensRegistry()
    );

    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt,
        view.getSettingSpecs(),
        view._settings
    );
    Exhibit.SettingsUtilities.collectSettings(
        configuration,
        view.getSettingSpecs(),
        view._settings
    );

    view._orderedViewFrame.configureFromDOM(configElmt);
    view._orderedViewFrame.configure(configuration);

    view._initializeUI();
    return view;
};

/**
 *
 */
Exhibit.ThumbnailView.prototype.dispose = function() {
    var view = this;
    Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
        "onItemsChanged.exhibit",
        view._onItemsChanged
    );

    this._orderedViewFrame.dispose();
    this._orderedViewFrame = null;

    this._lensRegistry = null;
    this._dom = null;

    this._dispose();
};

/**
 *
 */
Exhibit.ThumbnailView.prototype._initializeUI = function() {
    var self, template;

    self = this;

    Exhibit.jQuery(this.getContainer()).empty();
    self._initializeViewUI(function() {
        return Exhibit.jQuery(self._dom.bodyDiv).html();
    });

    template = {
        elmt: this.getContainer(),
        children: [
            {   tag: "div",
                field: "headerDiv"
            },
            {   tag: "div",
                "class": "exhibit-collectionView-body",
                field: "bodyDiv"
            },
            {   tag: "div",
                field: "footerDiv"
            }
        ]
    };

    this._dom = Exhibit.jQuery.simileDOM("template", template);

    this._orderedViewFrame._divHeader = this._dom.headerDiv;
    this._orderedViewFrame._divFooter = this._dom.footerDiv;
    this._orderedViewFrame._generatedContentElmtRetriever = function() {
        return self._dom.bodyDiv;
    };

    this._orderedViewFrame.initializeUI();

    Exhibit.View.addViewState(
        this.getID(),
        this.exportState()
    );

    this._reconstruct();
};

/**
 *
 */
Exhibit.ThumbnailView.prototype._reconstruct = function() {
    if (this._settings.columnCount < 2) {
        this._reconstructWithFloats();
    } else {
        this._reconstructWithTable();
    }
};

Exhibit.ThumbnailView.prototype._reconstructWithFloats = function() {
    var view, state, closeGroups, i;
    view = this;
    state = {
        div:            this._dom.bodyDiv,
        itemContainer:  null,
        groupDoms:      [],
        groupCounts:    []
    };

    closeGroups = function(groupLevel) {
        for (i = groupLevel; i < state.groupDoms.length; i++) {
            state.groupDoms[i].countSpan.innerHTML = state.groupCounts[i];
        }
        state.groupDoms = state.groupDoms.slice(0, groupLevel);
        state.groupCounts = state.groupCounts.slice(0, groupLevel);

        if (groupLevel > 0) {
            state.div = state.groupDoms[groupLevel - 1].contentDiv;
        } else {
            state.div = view._dom.bodyDiv;
        }
        state.itemContainer = null;
    };

    this._orderedViewFrame.onNewGroup = function(groupSortKey, keyType, groupLevel) {
        closeGroups(groupLevel);

        var groupDom = Exhibit.ThumbnailView.constructGroup(
            groupLevel,
            groupSortKey
        );

        Exhibit.jQuery(state.div).append(groupDom.elmt);
        state.div = groupDom.contentDiv;

        state.groupDoms.push(groupDom);
        state.groupCounts.push(0);
    };

    this._orderedViewFrame.onNewItem = function(itemID, index) {
        //if (index > 10) return;

        var i, itemLensItem, itemLens;
        if (typeof state.itemContainer === "undefined" || state.itemContainer === null) {
            state.itemContainer = Exhibit.ThumbnailView.constructItemContainer();
            Exhibit.jQuery(state.div).append(state.itemContainer);
        }

        for (i = 0; i < state.groupCounts.length; i++) {
            state.groupCounts[i]++;
        }

        itemLensDiv = Exhibit.jQuery("<div>");
        itemLensDiv.attr("class", Exhibit.ThumbnailView._itemContainerClass);

        itemLens = view._lensRegistry.createLens(itemID, itemLensDiv, view.getUIContext());
        state.itemContainer.append(itemLensDiv);
    };

    Exhibit.jQuery(this.getContainer()).hide();

    Exhibit.jQuery(this._dom.bodyDiv).empty();
    this._orderedViewFrame.reconstruct();
    closeGroups(0);

    Exhibit.jQuery(this.getContainer()).show();
};

Exhibit.ThumbnailView.prototype._reconstructWithTable = function() {
    var view, state, closeGroups;
    view = this;
    state = {
        div:            this._dom.bodyDiv,
        groupDoms:      [],
        groupCounts:    [],
        table:          null,
        columnIndex:    0
    };

    closeGroups = function(groupLevel) {
        var i;
        for (i = groupLevel; i < state.groupDoms.length; i++) {
            state.groupDoms[i].countSpan.innerHTML = state.groupCounts[i];
        }
        state.groupDoms = state.groupDoms.slice(0, groupLevel);
        state.groupCounts = state.groupCounts.slice(0, groupLevel);

        if (groupLevel > 0) {
            state.div = state.groupDoms[groupLevel - 1].contentDiv;
        } else {
            state.div = view._dom.bodyDiv;
        }
        state.itemContainer = null;
        state.table = null;
        state.columnIndex = 0;
    };

    this._orderedViewFrame.onNewGroup = function(groupSortKey, keyType, groupLevel) {
        closeGroups(groupLevel);

        var groupDom = Exhibit.ThumbnailView.constructGroup(
            groupLevel,
            groupSortKey
        );

        Exhibit.jQuery(state.div).append(groupDom.elmt);
        state.div = groupDom.contentDiv;

        state.groupDoms.push(groupDom);
        state.groupCounts.push(0);
    };

    this._orderedViewFrame.onNewItem = function(itemID, index) {
        //if (index > 10) return;

        var i, td, itemLensDiv, ItemLens;
        if (state.columnIndex >= view._settings.columnCount) {
            state.columnIndex = 0;
        }

        if (typeof state.table === "undefined" || state.table === null) {
            state.table = Exhibit.ThumbnailView.constructTableItemContainer();
            Exhibit.jQuery(state.div).append(state.table);
        }

        // one could jQuerify this with just append, but it seems less
        // precise than this DOM-based method
        if (state.columnIndex === 0) {
            state.table.insertRow(state.table.rows.length);
        }
        td = state.table.rows[state.table.rows.length - 1].insertCell(state.columnIndex++);

        for (i = 0; i < state.groupCounts.length; i++) {
            state.groupCounts[i]++;
        }

        itemLensDiv = Exhibit.jQuery("<div>");
        itemLensDiv.attr("class", Exhibit.ThumbnailView._itemContainerClass);

        itemLens = view._lensRegistry.createLens(itemID, itemLensDiv, view.getUIContext());
        Exhibit.jQuery(td).append(itemLensDiv);
    };

    Exhibit.jQuery(this.getContainer()).hide();

    Exhibit.jQuery(this._dom.bodyDiv).empty();
    this._orderedViewFrame.reconstruct();
    closeGroups(0);

    Exhibit.jQuery(this.getContainer()).show();
};


/**
 * @returns {Object}
 */
Exhibit.ThumbnailView.prototype.makeState = function() {
    return {};
};

/**
 * @param {String} sub
 * @param {Object} state
 * @returns {Object}
 */
Exhibit.ThumbnailView.prototype.makeStateWithSub = function(sub, state) {
    var original;
    original = this.makeState();
    original[sub] = state;
    return original;
};

/**
 * @param {Object} state
 * @returns {Object}
 */
Exhibit.ThumbnailView.prototype.exportState = function(state) {
    if (typeof state === "undefined" || state === null) {
        return this.makeStateWithSub(this._orderedViewFrame._historyKey,
                                     this._orderedViewFrame.exportState());
    } else {
        return state;
    }
};

/**
 * @param {Object} state
 * @param {Object} state.orderedViewFrame
 */
Exhibit.ThumbnailView.prototype.importState = function(state) {
    if (this._orderedViewFrame !== null && this.stateDiffers(state)) {
        this._orderedViewFrame.importState(state.orderedViewFrame);
    }
};

/**
 * @param {Object} state
 * @param {Object} state.orderedViewFrame
 * @returns {Boolean}
 */
Exhibit.ThumbnailView.prototype.stateDiffers = function(state) {
    if (typeof state.orderedViewFrame !== "undefined") {
        return this._orderedViewFrame.stateDiffers(state.orderedViewFrame);
    } else {
        return false;
    }
};

/**
 * @static
 * @param {Number} groupLevel
 * @param {String} label
 * @returns {Element}
 */
Exhibit.ThumbnailView.constructGroup = function(groupLevel, label) {
    var template = {
        tag: "div",
        "class": "exhibit-thumbnailView-group",
        children: [
            {   tag: "h" + (groupLevel + 1),
                children: [ 
                    label,
                    {   tag:        "span",
                        "class":  "exhibit-collectionView-group-count",
                        children: [
                            " (",
                            {   tag: "span",
                                field: "countSpan"
                            },
                            ")"
                        ]
                    }
                ],
                field: "header"
            },
            {   tag: "div",
                "class": "exhibit-collectionView-group-content",
                field: "contentDiv"
            }
        ]
    };
    return Exhibit.jQuery.simileDOM("template", template);
};

/**
 * @returns {jQuery}
 */
Exhibit.ThumbnailView.constructItemContainer = function() {
    var div = Exhibit.jQuery("<div>");
    div.addClass("exhibit-thumbnailView-body");
    return div;
};
    
/**
 * @returns table element
 */
Exhibit.ThumbnailView.constructTableItemContainer = function() {
    var table = Exhibit.jQuery("<table>");
    table.addClass("exhibit-thumbnailView-body");
    return table.get(0);
};
/**
 * @fileOverview Tile view functions and UI.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElement
 * @param {Exhibit.UIContext} uiContext
 */ 
Exhibit.TileView = function(containerElmt, uiContext) {
    var view = this;
    Exhibit.jQuery.extend(this, new Exhibit.View(
        "tile",
        containerElmt,
        uiContext
    ));
    this.addSettingSpecs(Exhibit.TileView._settingSpecs);

    this._onItemsChanged = function() {
        // @@@this will ignore the stored state, which is odd
        // it should probably replace the state after doing this - 
        // or forget it since this will always ignore the stored state,
        // correctly
        view._orderedViewFrame._settings.page = 0;
        view._reconstruct();
    };
    Exhibit.jQuery(uiContext.getCollection().getElement()).bind(
        "onItemsChanged.exhibit",
        view._onItemsChanged
    );

    this._orderedViewFrame = new Exhibit.OrderedViewFrame(uiContext);
    this._orderedViewFrame.parentReconstruct = function() {
        view._reconstruct();
    };
    this._orderedViewFrame.parentHistoryAction = function(child, state, title) {
        Exhibit.History.pushComponentState(
            view,
            Exhibit.View.getRegistryKey(),
            view.exportState(view.makeStateWithSub(child, state)),
            title,
            true
        );
    };

    this.register();
};

/**
 * @constant
 */
Exhibit.TileView._settingSpecs = { };

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.TileView}
 */
Exhibit.TileView.create = function(configuration, containerElmt, uiContext) {
    var view = new Exhibit.TileView(
        containerElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    
    Exhibit.SettingsUtilities.collectSettings(
        configuration, view.getSettingSpecs(), view._settings);
        
    view._orderedViewFrame.configure(configuration);

    view._initializeUI();
    return view;
};

/**
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.TileView}
 */
Exhibit.TileView.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, view;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    view = new Exhibit.TileView(
        typeof containerElmt !== "undefined" && containerElmt !== null ?
            containerElmt :
            configElmt,
        Exhibit.UIContext.createFromDOM(configElmt, uiContext)
    );
    
    Exhibit.SettingsUtilities.collectSettingsFromDOM(
        configElmt, view.getSettingSpecs(), view._settings);
    Exhibit.SettingsUtilities.collectSettings(
        configuration, view.getSettingSpecs(), view._settings);
    
    view._orderedViewFrame.configureFromDOM(configElmt);
    view._orderedViewFrame.configure(configuration);
    view._initializeUI();
    return view;
};

/**
 *
 */
Exhibit.TileView.prototype.dispose = function() {
    var view = this;
    Exhibit.jQuery(this.getUIContext().getCollection().getElement()).unbind(
        "onItemsChanged.exhibit",
        view._onItemsChanged
    );

    this._orderedViewFrame.dispose();
    this._orderedViewFrame = null;
    this._dom = null;

    this._dispose();
};

/**
 *
 */
Exhibit.TileView.prototype._initializeUI = function() {
    var self, template;

    self = this;
    
    Exhibit.jQuery(this.getContainer()).empty();
    self._initializeViewUI(function() {
        return Exhibit.jQuery(self._dom.bodyDiv).html();
    });

    template = {
        elmt: this.getContainer(),
        children: [
            {   tag: "div",
                field: "headerDiv"
            },
            {   tag: "div",
                "class": "exhibit-collectionView-body",
                field: "bodyDiv"
            },
            {   tag: "div",
                field: "footerDiv"
            }
        ]
    };
    this._dom = Exhibit.jQuery.simileDOM("template", template);
    this._orderedViewFrame._divHeader = this._dom.headerDiv;
    this._orderedViewFrame._divFooter = this._dom.footerDiv;
    this._orderedViewFrame.initializeUI();

    Exhibit.View.addViewState(
        this.getID(),
        this.exportState()
    );

    this._reconstruct();
};

/**
 *
 */
Exhibit.TileView.prototype._reconstruct = function() {
    var view, state, closeGroups, i;
    view = this;
    state = {
        div:            this._dom.bodyDiv,
        contents:       null,
        groupDoms:      [],
        groupCounts:    []
    };

    closeGroups = function(groupLevel) {
        for (i = groupLevel; i < state.groupDoms.length; i++) {
            Exhibit.jQuery(state.groupDoms[i].countSpan).html(state.groupCounts[i]);
        }
        state.groupDoms = state.groupDoms.slice(0, groupLevel);
        state.groupCounts = state.groupCounts.slice(0, groupLevel);

        if (groupLevel > 0) {
            state.div = state.groupDoms[groupLevel - 1].contentDiv;
        } else {
            state.div = view._dom.bodyDiv;
        }
        state.contents = null;
    };

    this._orderedViewFrame.onNewGroup = function(groupSortKey, keyType, groupLevel) {
        closeGroups(groupLevel);

        var groupDom = Exhibit.TileView.constructGroup(groupLevel, groupSortKey);

        Exhibit.jQuery(state.div).append(groupDom.elmt);
        state.div = groupDom.contentDiv;

        state.groupDoms.push(groupDom);
        state.groupCounts.push(0);
    };

    this._orderedViewFrame.onNewItem = function(itemID, index) {
        var i, itemLensItem, itemLens;
        if (typeof state.contents === "undefined" || state.contents === null) {
            state.contents = Exhibit.TileView.constructList();
            Exhibit.jQuery(state.div).append(state.contents);
        }

        for (i = 0; i < state.groupCounts.length; i++) {
            state.groupCounts[i]++;
        }

        itemLensItem = Exhibit.jQuery("<li>");
        itemLens = view.getUIContext().getLensRegistry().createLens(itemID, itemLensItem, view.getUIContext());
        state.contents.append(itemLensItem);
    };

    Exhibit.jQuery(this.getContainer()).hide();

    Exhibit.jQuery(this._dom.bodyDiv).empty();
    this._orderedViewFrame.reconstruct();
    closeGroups(0);

    Exhibit.jQuery(this.getContainer()).show();
};

/**
 * @returns {Object}
 */
Exhibit.TileView.prototype.makeState = function() {
    return {};
};

/**
 * @param {String} sub
 * @param {Object} state
 * @returns {Object}
 */
Exhibit.TileView.prototype.makeStateWithSub = function(sub, state) {
    var original;
    original = this.makeState();
    original[sub] = state;
    return original;
};

/**
 * @param {Object} state
 * @returns {Object}
 */
Exhibit.TileView.prototype.exportState = function(state) {
    if (typeof state === "undefined" || state === null) {
        return this.makeStateWithSub(this._orderedViewFrame._historyKey,
                                     this._orderedViewFrame.exportState());
    } else {
        return state;
    }
};

/**
 * @param {Object} state
 * @param {Object} state.orderedViewFrame
 */
Exhibit.TileView.prototype.importState = function(state) {
    if (this._orderedViewFrame !== null && this.stateDiffers(state)) {
        this._orderedViewFrame.importState(state.orderedViewFrame);
    }
};

/**
 * @param {Object} state
 * @param {Object} state.orderedViewFrame
 * @returns {Boolean}
 */
Exhibit.TileView.prototype.stateDiffers = function(state) {
    if (typeof state.orderedViewFrame !== "undefined") {
        return this._orderedViewFrame.stateDiffers(state.orderedViewFrame);
    } else {
        return false;
    }
};

/**
 * @static
 * @param {Number} groupLevel
 * @param {String} label
 * @returns {Element}
 */
Exhibit.TileView.constructGroup = function(groupLevel, label) {
    var template = {
        tag: "div",
        "class": "exhibit-collectionView-group",
        children: [
            {   tag: "h" + (groupLevel + 1),
                children: [
                    label,
                    {   tag:        "span",
                        "class":  "exhibit-collectionView-group-count",
                        children: [
                            " (",
                            {   tag: "span",
                                field: "countSpan"
                            },
                            ")"
                        ]
                    }
                ],
                field: "header"
            },
            {   tag: "div",
                "class": "exhibit-collectionView-group-content",
                field: "contentDiv"
            }
        ]
    };
    return Exhibit.jQuery.simileDOM("template", template);
};

/**
 * @returns {jQuery}
 */
Exhibit.TileView.constructList = function() {
    return Exhibit.jQuery("<ol>").addClass("exhibit-tileView-body");
};
/**
 * @fileOverview View panel functions and UI.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ViewPanel = function(div, uiContext) {
    this._uiContext = uiContext;
    this._div = div;
    this._uiContextCache = {};
    
    this._viewConstructors = [];
    this._viewConfigs = [];
    this._viewLabels = [];
    this._viewTooltips = [];
    this._viewDomConfigs = [];
    
    this._viewIndex = 0;
    this._view = null;

    this._registered = false;
};

/**
 * @private
 * @constant
 */
Exhibit.ViewPanel._registryKey = "viewPanel";

/**
 * @private
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.ViewPanel._registerComponent = function(evt, reg) {
    if (!reg.hasRegistry(Exhibit.ViewPanel._registryKey)) {
        reg.createRegistry(Exhibit.ViewPanel._registryKey);
    }
};

/**
 * @param {Object} configuration
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ViewPanel}
 */
Exhibit.ViewPanel.create = function(configuration, div, uiContext) {
    var viewPanel, i, viewconfig, viewClass, label, tooltip, id, viewClassName;
    viewPanel = new Exhibit.ViewPanel(div, uiContext);
    
    if (typeof configuration.views !== "undefined") {
        for (i = 0; i < configuration.views.length; i++) {
            viewConfig = configuration.views[i];
            
            viewClass = (typeof view.viewClass !== "undefined") ?
                view.viewClass :
                Exhibit.TileView;
            if (typeof viewClass === "string") {
                viewClassName = viewClass;
                viewClass = Exhibit.UI.viewClassNameToViewClass(viewClass);
            }
            
            label = null;
            if (typeof viewConfig.viewLabel !== "undefined") {
                label = viewConfig.viewLabel;
            } else if (typeof viewConfig.label !== "undefined") {
                label = viewConfig.label;
            } else if (Exhibit.ViewPanel.getViewLabel(viewClassName) !== null) {
                label = Exhibit.ViewPanel.getViewLabel(viewClassName);
            } else if (typeof viewClassName !== "undefined") {
                label = viewClassName;
            } else {
                label = Exhibit._("%viewPanel.noViewLabel");
            }
            
            // @@@ if viewClassName is null, Tile View will come up as the
            //     default in all cases but this one, where the tooltip used
            //     is just the view name again.  There were hacks here too
            //     eval()-like to be future proof.  To get tooltip and view to
            //     match in the default case is going to take some work.
            tooltip = null;
            if (typeof viewConfig.tooltip !== "undefined") {
                tooltip = viewConfig.tooltip;
            } else if (Exhibit.ViewPanel.getViewTooltip(viewClassName) !== null) {
                tooltip = Exhibit.ViewPanel.getViewTooltip(viewClassName);
            } else {
                tooltip = label;
            }
            
            viewPanel._viewConstructors.push(viewClass);
            viewPanel._viewConfigs.push(viewConfig);
            viewPanel._viewLabels.push(label);
            viewPanel._viewTooltips.push(tooltip);
            viewPanel._viewDomConfigs.push(null);
        }
    }
    
    if (typeof configuration.initialView !== "undefined") {
        viewPanel._viewIndex = configuration.initialView;
    }
    
    viewPanel._setIdentifier();
    viewPanel.register();
    viewPanel._internalValidate();
    viewPanel._initializeUI();
    
    return viewPanel;
};

/**
 * @param {Element} div
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ViewPanel}
 */
Exhibit.ViewPanel.createFromDOM = function(div, uiContext) {
    var viewPanel, role, viewClass, viewClassName, viewLabel, tooltip, label, id, intialView, n;
    viewPanel = new Exhibit.ViewPanel(div, Exhibit.UIContext.createFromDOM(div, uiContext, false));
    
    Exhibit.jQuery(div).children().each(function(index, elmt) {
        Exhibit.jQuery(this).hide();
        role = Exhibit.getRoleAttribute(this);
        if (role === "view") {
            viewClass = Exhibit.TileView;
            viewClassName = Exhibit.getAttribute(this, "viewClass");
            if (typeof viewClassName !== "undefined" && viewClassName !== null && viewClassName.length > 0) {
                viewClass = Exhibit.UI.viewClassNameToViewClass(viewClassName);
                if (typeof viewClass === "undefined" || viewClass === null) {
                    Exhibit.Debug.warn(Exhibit._("%viewPanel.error.unknownView", viewClassName));
                }
            }

            viewLabel = Exhibit.getAttribute(this, "viewLabel");
            label = (typeof viewLabel !== "undefined" && viewLabel !== null && viewLabel.length > 0) ?
                viewLabel :
                Exhibit.getAttribute(this, "label");
            tooltip = Exhibit.getAttribute(this, "title");
                
            if (typeof label === "undefined" || label === null) {
                if (Exhibit.ViewPanel.getViewLabel(viewClassName) !== null) {
                    label = Exhibit.ViewPanel.getViewLabel(viewClassName);
                } else if (typeof viewClassName !== "undefined") {
                    label = viewClassName;
                } else {
                    label = Exhibit._("%viewPanel.noViewLabel");
                }
            }

            // @@@ see note in above create method
            if (typeof tooltip === "undefined" || tooltip === null) {
                if (Exhibit.ViewPanel.getViewTooltip(viewClassName) !== null) {
                    tooltip = Exhibit.ViewPanel.getViewTooltip(viewClassName);
                } else {
                    tooltip = label;
                }
            }
            
            viewPanel._viewConstructors.push(viewClass);
            viewPanel._viewConfigs.push(null);
            viewPanel._viewLabels.push(label);
            viewPanel._viewTooltips.push(tooltip);
            viewPanel._viewDomConfigs.push(this);
        }
    });
    
    initialView = Exhibit.getAttribute(div, "initialView");
    if (typeof initialView !== "undefined" && initialView !== null && initialView.length > 0) {
        try {
            n = parseInt(initialView, 10);
            if (!isNaN(n)) {
                viewPanel._viewIndex = n;
            }
        } catch (e) {
        }
    }
    
    viewPanel._setIdentifier();
    viewPanel.register();
    viewPanel._internalValidate();
    viewPanel._initializeUI();
    
    return viewPanel;
};

/**
 * @static
 * @param {String} viewClass
 * @returns {String}
 */
Exhibit.ViewPanel.getViewLabel = function(viewClass) {
    return Exhibit.ViewPanel._getLocalized(viewClass, "label");
};

/**
 * @static
 * @param {String} viewClass
 * @returns {String}
 */
Exhibit.ViewPanel.getViewTooltip = function(viewClass) {
    return Exhibit.ViewPanel._getLocalized(viewClass, "tooltip");
};

/**
 * @static
 * @param {String} viewClass
 * @param {String} type
 * @returns {String}
 */
Exhibit.ViewPanel._getLocalized = function(viewClass, type) {
    if (typeof viewClass === "undefined" || viewClass === null) {
        return null;
    } else {
        // normalize the view class name
        if (viewClass.indexOf("View") === -1) {
            viewClass += "View";
        }
        if (viewClass.indexOf("Exhibit.") === 0) {
            viewClass = viewClass.substring("Exhibit.".length);
        }
        return Exhibit._("%" + viewClass + "." + type);
    }
};

/**
 *
 */
Exhibit.ViewPanel.prototype.dispose = function() {
    if (this._view !== null) {
        this._view.dispose();
        this._view = null;
    }
    
    Exhibit.jQuery(this._div).empty();
    
    this.unregister();
    this._uiContext.dispose();
    this._uiContext = null;
    this._div = null;
};

/**
 * @returns {jQuery}
 */
Exhibit.ViewPanel.prototype.getContainer = function() {
    return Exhibit.jQuery(this._div);
};

/**
 *
 */
Exhibit.ViewPanel.prototype._setIdentifier = function() {
    this._id = Exhibit.jQuery(this._div).attr("id");

    if (typeof this._id === "undefined" || this._id === null) {
        this._id = Exhibit.ViewPanel._registryKey
            + "-"
            + this._uiContext.getCollection().getID()
            + "-"
            + this._uiContext.getMain().getRegistry().generateIdentifier(
                Exhibit.ViewPanel._registryKey
            );
    }
};

/**
 * 
 */
Exhibit.ViewPanel.prototype.register = function() {
    if (!this._uiContext.getMain().getRegistry().isRegistered(
        Exhibit.ViewPanel._registryKey,
        this.getID()
    )) {
        this._uiContext.getMain().getRegistry().register(
            Exhibit.ViewPanel._registryKey,
            this.getID(),
            this
        );
        this._registered = true;
    }
};

/**
 *
 */
Exhibit.ViewPanel.prototype.unregister = function() {
    this._uiContext.getMain().getRegistry().unregister(
        Exhibit.ViewPanel._registryKey,
        this.getID()
    );
    this._registered = false;
};

/**
 * @returns {String}
 */
Exhibit.ViewPanel.prototype.getID = function() {
    return this._id;
};

/**
 *
 */
Exhibit.ViewPanel.prototype._internalValidate = function() {
    if (this._viewConstructors.length === 0) {
        this._viewConstructors.push(Exhibit.TileView);
        this._viewConfigs.push({});
        this._viewLabels.push(Exhibit._("%TileView.label"));
        this._viewTooltips.push(Exhibit._("%TileView.tooltip"));
        this._viewDomConfigs.push(null);
    }
    
    this._viewIndex = 
        Math.max(0, Math.min(this._viewIndex, this._viewConstructors.length - 1));
};

/**
 *
 */
Exhibit.ViewPanel.prototype._initializeUI = function() {
    var div, self;
    div = Exhibit.jQuery("<div>");
    if (Exhibit.jQuery(this._div).children().length > 0) {
        Exhibit.jQuery(this._div).prepend(div);
    } else {
        Exhibit.jQuery(this._div).append(div);
    }
    
    self = this;
    this._dom = Exhibit.ViewPanel.constructDom(
        Exhibit.jQuery(this._div).children().get(0),
        this._viewLabels,
        this._viewTooltips,
        function(index) {
            self._selectView(index);
        }
    );
    
    this._createView();
};

/**
 *
 */
Exhibit.ViewPanel.prototype._createView = function() {
    var viewContainer, viewDiv, index, context;
    viewContainer = this._dom.getViewContainer();
    Exhibit.jQuery(viewContainer).empty();

    viewDiv = Exhibit.jQuery("<div>");
    Exhibit.jQuery(viewContainer).append(viewDiv);
    
    index = this._viewIndex;
    context = this._uiContextCache[index] || this._uiContext;
    try {
        if (this._viewDomConfigs[index] !== null) {
            this._view = this._viewConstructors[index].createFromDOM(
                this._viewDomConfigs[index],
                viewContainer, 
                context
            );
        } else {
            this._view = this._viewConstructors[index].create(
                this._viewConfigs[index],
                viewContainer, 
                context
            );
        }
    } catch (e) {
        Exhibit.Debug.log(Exhibit._("%viewPanel.error.failedViewCreate", this._viewLabels[index], index));
        Exhibit.Debug.exception(e);
    }
    
    this._uiContextCache[index] = this._view.getUIContext();
    this._view.setLabel(this._viewLabels[index]);
    this._view.setViewPanel(this);

    this._dom.setViewIndex(index);
};

/**
 * @param {Number} newIndex
 */
Exhibit.ViewPanel.prototype._switchView = function(newIndex) {
    Exhibit.jQuery(this.getContainer()).trigger(
        "onBeforeViewPanelSwitch.exhibit",
        [ this._viewIndex ]
    );
    if (this._view !== null) {
        this._view.dispose();
        this._view = null;
    }
    this._viewIndex = newIndex;
    this._createView();
    Exhibit.jQuery(this.getContainer()).trigger(
        "onAfterViewPanelSwitch.exhibit",
        [ this._viewIndex, this._view ]
    );
};

/**
 * @param {Number} newIndex
 */
Exhibit.ViewPanel.prototype._selectView = function(newIndex) {
    var oldIndex, self;
    oldIndex = this._viewIndex;
    self = this;
    Exhibit.History.pushComponentState(
        this,
        Exhibit.ViewPanel._registryKey,
        this.exportState(this.makeState(newIndex)),
        Exhibit._("%viewPanel.selectViewActionTitle", self._viewLabels[newIndex]),
        true
    );
};

/**
 * @param {String} itemID
 * @param {Array} propertyEntries
 * @param {Exhibit.Database} database
 * @returns {Array}
 */
Exhibit.ViewPanel.getPropertyValuesPairs = function(itemID, propertyEntries, database) {
    var pairs, enterPair, i, entry;
    pairs = [];
    enterPair = function(propertyID, forward) {
        var property, values, count, itemValues, pair;
        property = database.getProperty(propertyID);
        values = forward ? 
            database.getObjects(itemID, propertyID) :
            database.getSubjects(itemID, propertyID);
        count = values.size();
        
        if (count > 0) {
            itemValues = property.getValueType() === "item";
            pair = { 
                propertyLabel:
                    forward ?
                        (count > 1 ? property.getPluralLabel() : property.getLabel()) :
                        (count > 1 ? property.getReversePluralLabel() : property.getReverseLabel()),
                valueType:  property.getValueType(),
                values:     []
            };
            
            if (itemValues) {
                values.visit(function(value) {
                    var label = database.getObject(value, "label");
                    pair.values.push(typeof label !== "undefined" && label !== null ? label : value);
                });
            } else {
                values.visit(function(value) {
                    pair.values.push(value);
                });
            }
            pairs.push(pair);
        }
    };
    
    for (i = 0; i < propertyEntries.length; i++) {
        entry = propertyEntries[i];
        if (typeof entry === "string") {
            enterPair(entry, true);
        } else {
            enterPair(entry.property, entry.forward);
        }
    }
    return pairs;
};

/**
 * @param {Element} div
 * @param {Array} viewLabels
 * @param {Array} viewTooltips
 * @param {Function} onSelectView
 */
Exhibit.ViewPanel.constructDom = function(
    div,
    viewLabels,
    viewTooltips,
    onSelectView
) {
    var template, dom;
    template = {
        "elmt": div,
        "class": "exhibit-viewPanel exhibit-ui-protection",
        "children": [
            {   "tag":    "div",
                "class":  "exhibit-viewPanel-viewSelection",
                "field":  "viewSelectionDiv"
            },
            {   "tag":    "div",
                "class":  "exhibit-viewPanel-viewContainer",
                "field":  "viewContainerDiv"
            }
        ]
    };
    dom = Exhibit.jQuery.simileDOM("template", template);
    dom.getViewContainer = function() {
        return dom.viewContainerDiv;
    };
    dom.setViewIndex = function(index) {
        var appendView, i;
        if (viewLabels.length > 1) {
            Exhibit.jQuery(dom.viewSelectionDiv).empty();
            
            appendView = function(i) {
                var selected, span, handler;
                selected = (i === index);
                if (i > 0) {
                    Exhibit.jQuery(dom.viewSelectionDiv).append(Exhibit._("%viewPanel.viewSeparator"));
                }
                
                span = Exhibit.jQuery("<span>");
                span.attr("class", selected ? 
                          "exhibit-viewPanel-viewSelection-selectedView" :
                          "exhibit-viewPanel-viewSelection-view")
                    .attr("title", viewTooltips[i])
                    .html(viewLabels[i]);
                
                if (!selected) {
                    handler = function(evt) {
                        onSelectView(i);
                        evt.preventDefault();
                        evt.stopPropagation();
                    };
                    span.bind("click", handler);
                }
                Exhibit.jQuery(dom.viewSelectionDiv).append(span);
            };
            
            for (i = 0; i < viewLabels.length; i++) {
                appendView(i);
            }
        }
    };
    
    return dom;
};

/**
 * @param {Object} state
 * @returns {Object} state
 */
Exhibit.ViewPanel.prototype.exportState = function(state) {
    if (typeof state === "undefined" || state === null) {
        return {
            "viewIndex": this._viewIndex
        };
    } else {
        return state;
    }
};

/**
 * @param {Object} state
 * @param {Number} state.viewIndex
 */
Exhibit.ViewPanel.prototype.importState = function(state) {
    if (this.stateDiffers(state)) {
        this._switchView(state.viewIndex);
    }
};

/**
 * @param {Number} viewIndex
 * @returns {Object}
 */
Exhibit.ViewPanel.prototype.makeState = function(viewIndex) {
    return {
        "viewIndex": viewIndex
    };
};

/**
 * @param {Object} state
 * @param {Number} state.viewIndex
 * @returns {Boolean}
 */
Exhibit.ViewPanel.prototype.stateDiffers = function(state) {
    return state.viewIndex !== this._viewIndex;
};

Exhibit.jQuery(document).one("registerComponents.exhibit",
                Exhibit.ViewPanel._registerComponent);
/**
 * @fileOverview View component.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @class
 * @constructor
 * @param {String} key
 * @param {Element|jQuery} div
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.View = function(key, div, uiContext) {
    var self, _id, _instanceKey, _toolbox, _label, _viewPanel, _settingSpecs, _div, _uiContext, _registered, _setIdentifier;

    /**
     * @private
     */
    self = this;

    /**
     * @private
     */
    _instanceKey = key;

    /**
     * @private
     */
    _uiContext = uiContext;

    /**
     * @private
     */
    _div = Exhibit.jQuery(div);

    /**
     * @private
     */
    _registered = false;

    /**
     * @private
     */
    _id = null;

    /**
     * @private
     */
    _toolbox = null;

    /**
     * @private
     */
    _label = null;

    /**
     * @private
     */
    _viewPanel = null;

    /**
     * @private
     */
    _settingSpecs = {};

    /**
     * @public
     */
    this._settings = {};

    /**
     * @public
     * @param {String} label
     */
    this.setLabel = function(label) {
        _label = label;
    };
    
    /**
     * @public
     * @returns {String}
     */
    this.getLabel = function() {
        return _label;
    };
    
    /**
     * @public
     * @param {Exhibit.ViewPanel} panel
     */
    this.setViewPanel = function(panel) {
        _viewPanel = panel;
    };

    /**
     * @public
     * @returns {Exhibit.ViewPanel}
     */
    this.getViewPanel = function() {
        return _viewPanel;
    };

    /**
     * @public
     * @param {Object} specs
     */
    this.addSettingSpecs = function(specs) {
        Exhibit.jQuery.extend(true, _settingSpecs, specs);
    };
    
    /**
     * @public
     * @returns {Object}
     */
    this.getSettingSpecs = function() {
        return _settingSpecs;
    };

    /**
     * @public
     * @param {Exhibit.ToolboxWidget} widget
     * @param {Function} [retriever]
     */
    this.setToolbox = function(widget, retriever) {
        _toolbox = widget;
        if (typeof retriever !== "undefined" && retriever !== null) {
            _toolbox.getGeneratedHTML = retriever;
        }
    };

    /**
     * Returns the toolbox widget associated with this view.
     * @returns {Exhibit.ToolboxWidget}
     */
    this.getToolbox = function() {
        return _toolbox;
    };

    /**
     * Returns the programmatic identifier used for this view.
     * @public
     * @returns {String}
     */
    this.getID = function() {
        return _id;
    };

    /**
     * Returns the UI context for this view.
     * @public
     * @returns {Exhibit.UIContext}
     */
    this.getUIContext = function() {
        return _uiContext;
    };

    /**
     * Returns the containing element for this view.
     * @public
     * @returns {jQuery}
     */
    this.getContainer = function() {
        return _div;
    };

    /**
     * Enter this view into the registry, making it easier to locate.
     * By convention, this should be called at the end of the constructor.
     * @example MyView = function() { ...; this.register(); };
     */
    this.register = function() {
        this.getUIContext().getMain().getRegistry().register(
            Exhibit.View.getRegistryKey(),
            this.getID(),
            this
        );
        _registered = true;
    };

    /**
     * Remove this view from the registry.
     */
    this.unregister = function() {
        self.getUIContext().getMain().getRegistry().unregister(
            Exhibit.View.getRegistryKey(),
            self.getID()
        );
        _registered = false;
    };

    /**
     * Free up all references to objects, empty related elements, unregister.
     */
    this._dispose = function() {
        _viewPanel = null;
        _label = null;
        _settingSpecs = null;
        if (_toolbox !== null) {
            _toolbox.dispose();
        }
        _toolbox = null;
        this._settings = null;

        Exhibit.jQuery(_div).empty();
        _div = null;

        this.unregister();
        _uiContext = null;
    };

    /**
     * @private
     */
    _setIdentifier = function() {
        _id = Exhibit.jQuery(_div).attr("id");
        if (typeof _id === "undefined" || _id === null) {
            _id = _instanceKey
                + "-"
                + self.getUIContext().getCollection().getID()
                + "-"
                + self.getUIContext().getMain().getRegistry().generateIdentifier(Exhibit.View.getRegistryKey());
        }
    };

    _setIdentifier();
    this.addSettingSpecs(Exhibit.View._settingSpecs);
};

/**
 * Every view should call this method in its own UI initializing method,
 * by convention _initializeUI.
 *
 * @private
 * @param {Function} retriever
 */
Exhibit.View.prototype._initializeViewUI = function(retriever) {
    if (this._settings.showToolbox) {
        this.setToolbox(
            Exhibit.ToolboxWidget.create(
                { "toolboxHoverReveal": this._settings.toolboxHoverReveal },
                this.getContainer(),
                this.getUIContext()
            ),
            retriever
        );
    }
};

/**
 * @private
 * @constant
 */
Exhibit.View._registryKey = "view";

/**
 * @private
 * @constant
 */
Exhibit.View._settingSpecs = {
    "showToolbox":          { "type": "boolean", "defaultValue": true },
    "toolboxHoverReveal":   { "type": "boolean", "defaultValue": false }
};

/**
 * @public
 * @static
 * @returns {String}
 */
Exhibit.View.getRegistryKey = function() {
    return Exhibit.View._registryKey;
};

/**
 * @static
 * @public
 * @param {jQuery.Event} evt
 * @param {Exhibit.Registry} reg
 */
Exhibit.View.registerComponent = function(evt, reg) {
    if (!reg.hasRegistry(Exhibit.View.getRegistryKey())) {
        reg.createRegistry(Exhibit.View.getRegistryKey());
    }
};


/**
 * @static
 * @public
 * @param {String} id
 * @param {Object} state
 */
Exhibit.View.addViewState = function(id, state) {
    var fullState;

    fullState = Exhibit.History.getState();
    // If History has been initialized already; don't worry if not
    if (fullState !== null) {
        if (typeof fullState.data.components[id] === "undefined") {
            fullState.data.components[id] = {
                "state": state,
                "type": Exhibit.View.getRegistryKey()
            };
            Exhibit.History.replaceState(fullState.data);
        } else {
            Exhibit.jQuery(document).trigger(
                "importReady.exhibit",
                [Exhibit.View.getRegistryKey(), id]
            );
        }
    }
};

Exhibit.jQuery(document).one(
    "registerComponents.exhibit",
    Exhibit.View.registerComponent
);
/**
 * @fileOverview Widget for acquiring permalink to state of Exhibit.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

// @@@ integrate bit.ly or some other url shortener?

/**
 * @class
 * @constructor
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.BookmarkWidget = function(elmt, uiContext) {
    this._uiContext = uiContext;
    this._div = elmt;
    this._settings = {};
    this._controlPanel = null;
    this._popup = null;
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.BookmarkWidget}
 */
Exhibit.BookmarkWidget.create = function(configuration, elmt, uiContext) {
    var widget = new Exhibit.BookmarkWidget(
        elmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    Exhibit.BookmarkWidget._configure(widget, configuration);
    widget._initializeUI();
    return widget;
};

Exhibit.BookmarkWidget.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, widget;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    widget = new Exhibit.BookmarkWidget(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt : configElmt,
        Exhibit.UIContext.createFromDOM(configElmt, uiContext)
    );
    Exhibit.BookmarkWidget._configure(widget, configuration);
    widget._initializeUI();
    return widget;
};

/**
 * @static
 * @private
 * @param {Exhibit.BookmarkWidget} widget
 * @param {Object} configuration
 */
Exhibit.BookmarkWidget._configure = function(widget, configuration) {
};

/**
 *
 */
Exhibit.BookmarkWidget.prototype._initializeUI = function() {
    var popup;
    popup = Exhibit.jQuery("<div>")
        .attr("class", "exhibit-bookmarkWidget-popup");
    this._fillPopup(popup);
    Exhibit.jQuery(this.getContainer()).append(popup);
    this._popup = popup;
};

/**
 * @public
 * @param {Exhibit.ControlPanel} panel
 */
Exhibit.BookmarkWidget.prototype.reconstruct = function(panel) {
    this._popup = null;
    this._initializeUI();
};

/**
 * @param {jQuery} popup
 */
Exhibit.BookmarkWidget.prototype._fillPopup = function(popup) {
    var self, img;

    self = this;
    img = Exhibit.UI.createTranslucentImage("images/bookmark-icon.png");
    Exhibit.jQuery(img)
        .attr("class", "exhibit-bookmarkWidget-button")
        .attr("title", Exhibit._("%widget.bookmark.tooltip"))
        .bind("click", function(evt) {
            self._showBookmark(img, evt);
        })
        .appendTo(popup);
};

/**
 * @param {jQuery} elmt
 * @param {jQuery.Event} evt
 */
Exhibit.BookmarkWidget.prototype._showBookmark = function(elmt, evt) {
    var self, popupDom, el;
    self = this;
    self._controlPanel.childOpened();
    popupDom = Exhibit.UI.createPopupMenuDom(elmt);
    el = Exhibit.jQuery('<input type="text" />').
        attr("value", Exhibit.Bookmark.generateBookmark()).
        attr("size", 40);
    Exhibit.jQuery(popupDom.elmt).append(Exhibit.jQuery(el));
    Exhibit.jQuery(popupDom.elmt).one("closed.exhibit", function(evt) {
        self.dismiss();
    });
    popupDom.open(evt);
    Exhibit.jQuery(el).get(0).select();
};

/**
 * @returns {jQuery}
 */
Exhibit.BookmarkWidget.prototype.getContainer = function() {
    return Exhibit.jQuery(this._div);
};

/**
 *
 */
Exhibit.BookmarkWidget.prototype.dispose = function() {
    this._uiContext.dispose();
    this._uiContext = null;
    this._div = null;
    this._settings = null;
};

/**
 * @param {Exhibit.ControlPanel} panel
 */
Exhibit.BookmarkWidget.prototype.setControlPanel = function(panel) {
    this._controlPanel = panel;
};

/**
 *
 */
Exhibit.BookmarkWidget.prototype.dismiss = function() {
    this._controlPanel.childClosed();
};
/**
 * @fileOverview Collection summary information
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.CollectionSummaryWidget = function(containerElmt, uiContext) {
    this._exhibit = uiContext.getMain();
    this._collection = uiContext.getCollection();
    this._uiContext = uiContext;
    this._div = containerElmt;

    var widget = this;
    this._onItemsChanged = function() {
        widget._reconstruct();
    };
    Exhibit.jQuery(this._collection.getElement()).bind(
        "onItemsChanged.exhibit",
        this._onItemsChanged
    );
};

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.CollectionSummaryWidget}
 */
Exhibit.CollectionSummaryWidget.create = function(configuration, containerElmt, uiContext) {
    var widget = new Exhibit.CollectionSummaryWidget(
        containerElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    widget._initializeUI();
    return widget;
};

/**
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.CollectionSummaryWidget}
 */
Exhibit.CollectionSummaryWidget.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var widget = new Exhibit.CollectionSummaryWidget(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt : configElmt, 
        Exhibit.UIContext.createFromDOM(configElmt, uiContext)
    );
    widget._initializeUI();
    return widget;
};

/**
 *
 */
Exhibit.CollectionSummaryWidget.prototype.dispose = function() {
    Exhibit.jQuery(this._uiContext.getCollection().getElement()).unbind(
        "onItemsChanged.exhibit",
        this._onItemsChanged
    );
    Exhibit.jQuery(this._div).empty();
    
    this._noResultsDom = null;
    this._allResultsDom = null;
    this._filteredResultsDom = null;
    this._div = null;
    this._collection = null;
    this._exhibit = null;
};

/**
 *
 */
Exhibit.CollectionSummaryWidget.prototype._initializeUI = function() {
    var self, onClearFilters;
    self = this;
    
    onClearFilters = function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        self._resetCollection();
    };

    Exhibit.jQuery(this._div).hide();
    this._allResultsDom = Exhibit.jQuery.simileDOM(
        "string",
        "span",
        Exhibit._("%widget.collectionSummary.allResultsTemplate", "exhibit-collectionSummaryWidget-results")
    );
    this._filteredResultsDom = Exhibit.jQuery.simileDOM(
        "string", 
        "span",
        Exhibit._("%widget.collectionSummary.filteredResultsTemplate", "exhibit-collectionSummaryWidget-results"),
        {   resetActionLink: Exhibit.UI.makeActionLink(Exhibit._("%widget.collectionSummary.resetFiltersLabel"), onClearFilters)
        }
    );
    this._noResultsDom = Exhibit.jQuery.simileDOM(
        "string",
        "span",
        Exhibit._("%widget.collectionSummary.noResultsTemplate", "exhibit-collectionSummaryWidget-results", "exhibit-collectionSummaryWidget-count"),
        {   resetActionLink: Exhibit.UI.makeActionLink(Exhibit._("%widget.collectionSummary.resetFiltersLabel"), onClearFilters)
        }
    );
    Exhibit.jQuery(this._div).append(this._allResultsDom.elmt);
    Exhibit.jQuery(this._div).append(this._filteredResultsDom.elmt);
    Exhibit.jQuery(this._div).append(this._noResultsDom.elmt);
    this._reconstruct();
};

/**
 *
 */
Exhibit.CollectionSummaryWidget.prototype._reconstruct = function() {
    var originalSize, currentSize, database, dom, typeIDs, typeID, description;
    originalSize = this._collection.countAllItems();
    currentSize = this._collection.countRestrictedItems();
    database = this._uiContext.getDatabase();
    dom = this._dom;

    Exhibit.jQuery(this._div).hide();
    Exhibit.jQuery(this._allResultsDom.elmt).hide();
    Exhibit.jQuery(this._filteredResultsDom.elmt).hide();
    Exhibit.jQuery(this._noResultsDom.elmt).hide();
    
    if (originalSize > 0) {
        if (currentSize === 0) {
            Exhibit.jQuery(this._noResultsDom.elmt).show();
        } else {
            typeIDs = database.getTypeIDs(this._collection.getRestrictedItems()).toArray();
            typeID = typeIDs.length === 1 ? typeIDs[0] : "Item";
            
            description = 
                database.labelItemsOfType(currentSize, typeID, "exhibit-collectionSummaryWidget-count");
            
            if (currentSize === originalSize) {
                Exhibit.jQuery(this._allResultsDom.elmt).show();
                Exhibit.jQuery(this._allResultsDom.resultDescription).empty();
                Exhibit.jQuery(this._allResultsDom.resultDescription).append(description);
            } else {
                Exhibit.jQuery(this._filteredResultsDom.elmt).show();
                Exhibit.jQuery(this._filteredResultsDom.resultDescription).empty();
                Exhibit.jQuery(this._filteredResultsDom.resultDescription).append(description);
                Exhibit.jQuery(this._filteredResultsDom.originalCountSpan).html(originalSize);
            }
        }
    }

    Exhibit.jQuery(this._div).show();
};

/**
 *
 */
Exhibit.CollectionSummaryWidget.prototype._resetCollection = function() {
    var state, collection;
    collection = this._collection;

    Exhibit.jQuery(this._collection.getElement()).trigger("onResetAllFilters.exhibit");
    state = this._collection.clearAllRestrictions();

    Exhibit.History.pushState(
        state.data,
        Exhibit._("%widget.collectionSummary.resetActionTitle")
    );
};
/**
 * @fileOverview Provide an easy way to attach classifications to a
 *     view with a legend widget.
 * @author David Huynh
 * @author Johan Sundström
 * @author Margaret Leibovic
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.LegendWidget = function(configuration, containerElmt, uiContext) {
    this._configuration = configuration;
    this._div = containerElmt;
    this._uiContext = uiContext;
    
    this._colorMarkerGenerator = typeof configuration.colorMarkerGenerator !== "undefined" ?
        configuration.colorMarkerGenerator :
        Exhibit.LegendWidget._defaultColorMarkerGenerator;	 
	this._sizeMarkerGenerator = typeof configuration.sizeMarkerGenerator !== "undefined" ?
		configuration.sizeMarkerGenerator :
		Exhibit.LegendWidget._defaultSizeMarkerGenerator;
	this._iconMarkerGenerator = typeof configuration.iconMarkerGenerator !== "undefined" ?
		configuration.iconMarkerGenerator :
		Exhibit.LegendWidget._defaultIconMarkerGenerator;

    this._labelStyler = typeof configuration.labelStyler !== "undefined" ?
        configuration.labelStyler :
        Exhibit.LegendWidget._defaultColorLabelStyler;
    
    this._initializeUI();
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.LegendWidget}
 */
Exhibit.LegendWidget.create = function(configuration, containerElmt, uiContext) {
    return new Exhibit.LegendWidget(configuration, containerElmt, uiContext);
};

/**
 *
 */
Exhibit.LegendWidget.prototype.dispose = function() {
    Exhibit.jQuery(this._div).empty();
    
    this._div = null;
    this._uiContext = null;
};

/**
 *
 */
Exhibit.LegendWidget.prototype._initializeUI = function() {
    Exhibit.jQuery(this._div).attr("class", "exhibit-legendWidget");
    this.clear();
};

/**
 *
 */
Exhibit.LegendWidget.prototype.clear = function() {
    Exhibit.jQuery(this._div).html('<div id="exhibit-color-legend"></div><div id="exhibit-size-legend"></div><div id="exhibit-icon-legend"></div>');
};

/**
 * @param {String} label
 * @param {String} type
 */
Exhibit.LegendWidget.prototype.addLegendLabel = function(label, type) {
    var dom;
	dom = Exhibit.jQuery.simileDOM("string",
			"div",
			'<div id="legend-label">' +
				'<span id="label" class="exhibit-legendWidget-entry-title">' + 
					label.replace(/\s+/g, "&nbsp;") + 
				"</span>" +
			"&nbsp;&nbsp; </div>",
			{ }
		);
	Exhibit.jQuery(dom.elmt).attr("class","exhibit-legendWidget-label");
	Exhibit.jQuery('#exhibit-' + type + '-legend').append(dom.elmt);
}

/**
 * @param {} value
 * @param {String} label
 * @param {String} type
 */
Exhibit.LegendWidget.prototype.addEntry = function(value, label, type) {
    var dom, legendDiv;

	type = type || "color";
    label = (typeof label === "object") ? label.toString() : label;

    if (type === "color") {
		dom = Exhibit.jQuery.simileDOM("string",
			"span",
			'<span id="marker"></span>&nbsp;' +
				'<span id="label" class="exhibit-legendWidget-entry-title">' + 
					label.replace(/\s+/g, "&nbsp;") + 
				"</span>" +
				"&nbsp;&nbsp; ",
			{ marker: this._colorMarkerGenerator(value) }
		);
		legendDiv = Exhibit.jQuery("#exhibit-color-legend");
	}

	if (type === "size") {
		dom = Exhibit.jQuery.simileDOM("string",
			"span",
			'<span id="marker"></span>&nbsp;' +
				'<span id="label" class="exhibit-legendWidget-entry-title">' + 
					label.replace(/\s+/g, "&nbsp;") + 
				"</span>" +
				"&nbsp;&nbsp; ",
			{ marker: this._sizeMarkerGenerator(value) }
		);
		legendDiv = Exhibit.jQuery("#exhibit-size-legend");
	}

	if (type === "icon") {
		dom = Exhibit.jQuery.simileDOM("string",
			"span",
			'<span id="marker"></span>&nbsp;' +
				'<span id="label" class="exhibit-legendWidget-entry-title">' + 
					label.replace(/\s+/g, "&nbsp;") + 
				"</span>" +
				"&nbsp; ",
			{ marker: this._iconMarkerGenerator(value) }
		);
		legendDiv = Exhibit.jQuery("#exhibit-icon-legend");
	}
    Exhibit.jQuery(dom.elmt).attr("class", "exhibit-legendWidget-entry");
    this._labelStyler(dom.label, value);
    Exhibit.jQuery(legendDiv).append(dom.elmt);
};

/**
 * @static
 * @private
 * @param {} a
 * @param {} b
 * @returns {Number}
 */
Exhibit.LegendWidget._localeSort = function(a, b) {
    return a.localeCompare(b);
}

/**
 * @static
 * @private
 * @param {String} value
 * @returns {Element}
 */
Exhibit.LegendWidget._defaultColorMarkerGenerator = function(value) {
    var span;
    span = Exhibit.jQuery("<span>")
        .attr("class", "exhibit-legendWidget-entry-swatch")
        .css("background", value)
        .html("&nbsp;&nbsp;");
    return span.get(0);
};

/** 
 * @static
 * @private
 * @param {Number} value
 * @returns {Element}
 */
Exhibit.LegendWidget._defaultSizeMarkerGenerator = function(value) {
    var span;
    span = Exhibit.jQuery("<span>")
        .attr("class", "exhibit-legendWidget-entry-swatch")
        .height(value)
        .width(value)
        .css("background", "#C0C0C0")
        .html("&nbsp;&nbsp;");
    return span.get(0);
}

/**
 * @static
 * @private
 * @param {String} value
 * @returns {Element}
 */
Exhibit.LegendWidget._defaultIconMarkerGenerator = function(value) {
    var span;
    span = Exhibit.jQuery("<span>")
        .append('<img src="'+value+'"/>');
    return span.get(0);
}

/**
 * @static
 * @private
 * @param {Element} elmt
 * @param {String} value
 */
Exhibit.LegendWidget._defaultColorLabelStyler = function(elmt, value) {
    // Exhibit.jQuery(elmt).css("color", "#" + value);
};
/**
 * @fileOverview 
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} elmt
 * @param {Exhibit._Impl} exhibit
 */ 
Exhibit.Logo = function(elmt, exhibit) {
    this._exhibit = exhibit;
    this._elmt = elmt;
    this._color = "Silver";
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit._Impl} exhibit
 * @returns {Exhibit.Logo}
 */
Exhibit.Logo.create = function(configuration, elmt, exhibit) {
    var logo;

    logo = new Exhibit.Logo(elmt, exhibit);
    
    if (typeof configuration.color !== "undefined") {
        logo._color = configuration.color;
    }
    
    logo._initializeUI();
    return logo;
};

/**
 * @static
 * @param {Element} elmt
 * @param {Exhibit._Impl} exhibit
 * @returns {Exhibit.Logo}
 */
Exhibit.Logo.createFromDOM = function(elmt, exhibit) {
    var logo, color;
    logo = new Exhibit.Logo(elmt, exhibit);
    
    color = Exhibit.getAttribute(elmt, "color");
    if (color !== null && color.length > 0) {
        logo._color = color;
    }
    
    logo._initializeUI();
    return logo;
};

/**
 *
 */
Exhibit.Logo.prototype.dispose = function() {
    this._elmt = null;
    this._exhibit = null;
};

/**
 * @private
 */
Exhibit.Logo.prototype._initializeUI = function() {
    var logoURL, img, id, a;

    logoURL = Exhibit.urlPrefix + "images/logos/exhibit-small-" + this._color + ".png";
    img = Exhibit.jQuery.simileBubble("createTranslucentImage", logoURL);
    id = "exhibit-logo-image";
    if (Exhibit.jQuery('#' + id).length === 0) {
        Exhibit.jQuery(img).attr("id", id);
    }
    a = Exhibit.jQuery("<a>")
        .attr("href", Exhibit.exhibitLink)
        .attr("title", Exhibit.exhibitLink)
        .attr("targe", "_blank")
        .append(img);
    
    Exhibit.jQuery(this._elmt).append(a);
};
/**
 * @fileOverview View header option making widget
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.OptionWidget = function(configuration, containerElmt, uiContext) {
    this._label = configuration.label;
    this._checked = typeof configuration.checked !== "undefined" ?
        configuration.checked :
        false;
    this._onToggle = configuration.onToggle;
    
    this._containerElmt = containerElmt;
    this._uiContext = uiContext;
    this._initializeUI();
};

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.OptionWidget}
 */
Exhibit.OptionWidget.create = function(configuration, containerElmt, uiContext) {
    return new Exhibit.OptionWidget(configuration, containerElmt, uiContext);
};

/**
 *
 */
Exhibit.OptionWidget.prototype.dispose = function() {
    Exhibit.jQuery(this._containerElmt).empty();
    
    this._dom = null;
    this._containerElmt = null;
    this._uiContext = null;
};

/**
 * @constant
 */
Exhibit.OptionWidget.uncheckedImageURL = Exhibit.urlPrefix + "images/option.png";

/**
 * @constant
 */
Exhibit.OptionWidget.checkedImageURL = Exhibit.urlPrefix + "images/option-check.png";

/**
 * @constant
 */
Exhibit.OptionWidget.uncheckedTemplate = 
    "<span id=\"uncheckedSpan\" style=\"display: none;\"><img id=\"uncheckedImage\" /> %1$s</span>";
    
/**
 * @constant
 */
Exhibit.OptionWidget.checkedTemplate = 
    "<span id=\"checkedSpan\" style=\"display: none;\"><img id=\"checkedImage\" /> %1$s</span>";
    
/**
 *
 */
Exhibit.OptionWidget.prototype._initializeUI = function() {
    this._containerElmt.className = "exhibit-optionWidget";
    this._dom = Exhibit.jQuery.simileDOM(
        "string",
        this._containerElmt,
        sprintf(
            Exhibit.OptionWidget.uncheckedTemplate + Exhibit.OptionWidget.checkedTemplate,
            this._label
        ),
        {   uncheckedImage: Exhibit.jQuery.simileBubble("createTranslucentImage", Exhibit.OptionWidget.uncheckedImageURL),
            checkedImage:   Exhibit.jQuery.simileBubble("createTranslucentImage", Exhibit.OptionWidget.checkedImageURL)
        }
    );
    
    if (this._checked) {
        Exhibit.jQuery(this._dom.checkedSpan).show();
    } else {
        Exhibit.jQuery(this._dom.uncheckedSpan).show();
    }

    Exhibit.jQuery(this._containerElmt).bind("click", this._onToggle);
};

/**
 * @returns {Boolean}
 */
Exhibit.OptionWidget.prototype.getChecked = function() {
    return this._checked;
};

/**
 * @param {Boolean} checked
 */
Exhibit.OptionWidget.prototype.setChecked = function(checked) {
    if (checked !== this._checked) {
        this._checked = checked;
        if (checked) {
            Exhibit.jQuery(this._dom.checkedSpan).show();
            Exhibit.jQuery(this._dom.uncheckedSpan).hide();
        } else {
            Exhibit.jQuery(this._dom.checkedSpan).hide();
            Exhibit.jQuery(this._dom.uncheckedSpan).show();
        }
    }
};

/**
 *
 */
Exhibit.OptionWidget.prototype.toggle = function() {
    this.setChecked(!this._checked);
};
/**
 * @fileOverview Development widget to assist with resetting history, which
 *     can get in an odd state if the Exhibit is being designed.
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext 
 */
Exhibit.ResetHistoryWidget = function(containerElmt, uiContext) {
    this._containerElmt = containerElmt;
    this._uiContext = uiContext;
    this._settings = {};
};

/**
 * @static
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ResetHistoryWidget}
 */
Exhibit.ResetHistoryWidget.create = function(configuration, elmt, uiContext) {
    var widget = new Exhibit.ResetHistoryWidget(
        elmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    Exhibit.ResetHistoryWidget._configure(widget, configuration);
    widget._initializeUI();
    return widget;
};

/**
 * @static
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ResetHistoryWidget}
 */
Exhibit.ResetHistoryWidget.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, widget;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    widget = new Exhibit.ResetHistoryWidget(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt : configElmt,
        Exhibit.UIContext.createFromDOM(configElmt, uiContext)
    );
    Exhibit.ResetHistoryWidget._configure(widget, configuration);
    widget._initializeUI();
    return widget;
};

/**
 * @static
 * @private
 * @param {Exhibit.ResetHistoryWidget} widget
 * @param {Object} configuration
 */
Exhibit.ResetHistoryWidget._configure = function(widget, configuration) {
};

/**
 * Sets the history to its initial, empty state and reloads the page.
 * @static
 */
Exhibit.ResetHistoryWidget.resetHistory = function() {
    Exhibit.History.eraseState();
    window.location.reload();
};

/**
 *
 */
Exhibit.ResetHistoryWidget.prototype._initializeUI = function() {
    var img;

    img = Exhibit.UI.createTranslucentImage("images/reset-history-icon.png");
    Exhibit.jQuery(img)
        .attr("class", "exhibit-resetHistoryWidget-button")
        .attr("title", "Click to clear state and refresh window")
        .bind("click", function(evt) {
            Exhibit.ResetHistoryWidget.resetHistory();
        });
    Exhibit.jQuery(this._containerElmt).append(img);
};

/**
 * @public
 * @param {Exhibit.ControlPanel} panel
 */
Exhibit.ResetHistoryWidget.prototype.reconstruct = function(panel) {
    this._initializeUI();
};

/**
 *
 */
Exhibit.ResetHistoryWidget.prototype.dispose = function() {
    this._uiContext.dispose();
    this._uiContext = null;
    this._div = null;
    this._settings = null;
};
/**
 * @fileOverview Resizable element widget
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 */
Exhibit.ResizableDivWidget = function(configuration, elmt, uiContext) {
    this._div = elmt;
    this._configuration = configuration;
    if (typeof configuration.minHeight === "undefined") {
        configuration.minHeight = 10; // pixels
    }
    this._dragging = false;
    this._height = null;
    this._origin = null;
    this._ondrag = null;
    
    this._initializeUI();
};

/**
 * @param {Object} configuration
 * @param {Element} elmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ResizableDivWidget}
 */
Exhibit.ResizableDivWidget.create = function(configuration, elmt, uiContext) {
    return new Exhibit.ResizableDivWidget(configuration, elmt, uiContext);
};

/**
 *
 */
Exhibit.ResizableDivWidget.prototype.dispose = function() {
    Exhibit.jQuery(this._div).empty();
    this._contentDiv = null;
    this._resizerDiv = null;
    this._div = null;
};

/**
 * @returns {Element}
 */
Exhibit.ResizableDivWidget.prototype.getContentDiv = function() {
    return this._contentDiv;
};

/**
 *
 */
Exhibit.ResizableDivWidget.prototype._initializeUI = function() {
    var self = this;
    
    Exhibit.jQuery(this._div).html(
        "<div></div>" +
        '<div class="exhibit-resizableDivWidget-resizer">' +
            Exhibit.UI.createTranslucentImageHTML("images/down-arrow.png") +
            "</div>");
        
    this._contentDiv = Exhibit.jQuery(this._div).children().get(0);
    this._resizerDiv = Exhibit.jQuery(this._div).children().get(1);

    Exhibit.jQuery(this._resizerDiv).bind("mousedown", function(evt) {
        self._dragging = true;
        self._height = Exhibit.jQuery(self._contentDiv).height();
        self._origin = { "x": evt.pageX, "y": evt.pageY };

        self._ondrag = function(evt2) {
            var height = self._height + evt2.pageY - self._origin.y;
            evt.preventDefault();
            evt.stopPropagation();
            Exhibit.jQuery(self._contentDiv).height(Math.max(
                height,
                self._configuration.minHeight
            ));
        };
        Exhibit.jQuery(document).bind("mousemove", self._ondrag);

        self._dragdone = function(evt) {
            self._dragging = false;
            Exhibit.jQuery(document).unbind("mousemove", self._ondrag);
            if (typeof self._configuration.onResize === "function") {
                self._configuration.onResize();
            }
        };
        Exhibit.jQuery(self._resizerDiv).one("mouseup", self._dragdone);
    });
};
/**
 * @fileOverview Toolbox widget, the scissors, for exporting data.
 * @author David Huynh
 * @author <a href="mailto:ryanlee@zepheira.com">Ryan Lee</a>
 */

/**
 * @constructor
 * @class
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 */ 
Exhibit.ToolboxWidget = function(containerElmt, uiContext) {
    var self = this;
    this._popup = null;
    this._containerElmt = containerElmt;
    this._uiContext = uiContext;
    this._settings = {};
    this._hovering = false;
};

/**
 * @constant
 */
Exhibit.ToolboxWidget._settingSpecs = {
    "itemID":               { "type": "text" },
    "toolboxHoverReveal":   { "type": "boolean", "defaultValue": false }
};

/**
 * @param {Object} configuration
 * @param {Element} containerElmt
 * @param {Exhibit.UIContexT} uiContext
 * @returns {Exhibit.ToolboxWidget}
 */
Exhibit.ToolboxWidget.create = function(configuration, containerElmt, uiContext) {
    var widget = new Exhibit.ToolboxWidget(
        containerElmt,
        Exhibit.UIContext.create(configuration, uiContext)
    );
    Exhibit.ToolboxWidget._configure(widget, configuration);

    widget._initializeUI();
    return widget;
};

/**
 * @param {Element} configElmt
 * @param {Element} containerElmt
 * @param {Exhibit.UIContext} uiContext
 * @returns {Exhibit.ToolboxWidget}
 */
Exhibit.ToolboxWidget.createFromDOM = function(configElmt, containerElmt, uiContext) {
    var configuration, widget;
    configuration = Exhibit.getConfigurationFromDOM(configElmt);
    widget = new Exhibit.ToolboxWidget(
        (typeof containerElmt !== "undefined" && containerElmt !== null) ?
            containerElmt : configElmt, 
        Exhibit.UIContext.createFromDOM(configElmt, uiContext)
    );

    Exhibit.SettingsUtilities.collectSettingsFromDOM(configElmt, Exhibit.ToolboxWidget._settingSpecs, widget._settings);    
    Exhibit.ToolboxWidget._configure(widget, configuration);
    
    widget._initializeUI();
    return widget;
};

/**
 * @param {Exhibit.ToolboxWidget} widget
 * @param {Object} configuration
 */
Exhibit.ToolboxWidget._configure = function(widget, configuration) {
    Exhibit.SettingsUtilities.collectSettings(configuration, Exhibit.ToolboxWidget._settingSpecs, widget._settings);
};

/**
 *
 */
Exhibit.ToolboxWidget.prototype.dispose = function() {
    Exhibit.jQuery(this._containerElmt).unbind("mouseover mouseout");
    this._dismiss();
    this._settings = null;
    this._containerElmt = null;
    this._uiContext = null;
};

/**
 *
 */
Exhibit.ToolboxWidget.prototype._initializeUI = function() {
    var self = this;
    if (this._settings.toolboxHoverReveal) {
        Exhibit.jQuery(this._containerElmt).bind("mouseover", function(evt) {
            self._onContainerMouseOver(evt);
        })
        Exhibit.jQuery(this._containerElmt).bind("mouseout", function(evt) {
            self._onContainerMouseOut(evt);
        });
    } else {
        this._makePopup();
    }
};

/**
 *
 */
Exhibit.ToolboxWidget.prototype._makePopup = function() {
    var coords, docWidth, popup, self, right;
    self = this;

    coords = Exhibit.jQuery(this._containerElmt).offset();
    docWidth = Exhibit.jQuery(document.body).width();

    // Don't widen the page
    right = docWidth - coords.left - Exhibit.jQuery(this._containerElmt).width();
    if (right <= 0) {
        right = 1;
    }

    popup = Exhibit.jQuery("<div>")
        .attr("class", "exhibit-toolboxWidget-popup screen")
        .css("position", "absolute")
        .css("top", coords.top + "px")
        .css("right", right + "px");

    this._popup = popup;
    this._fillPopup(popup);
    Exhibit.jQuery(this._containerElmt).append(popup);
};

/**
 * @param {jQuery.Event}
 */
Exhibit.ToolboxWidget.prototype._onContainerMouseOver = function(evt) {
    var self, coords, docWidth, popup;
    if (!this._hovering) {
        self = this;
        coords = Exhibit.jQuery(this._containerElmt).offset();
        docWidth = Exhibit.jQuery(document.body).width();

        popup = Exhibit.jQuery("<div>")
            .hide()
            .attr("class", "exhibit-toolboxWidget-popup screen")
            .css("position", "absolute")
            .css("top", coords.top + "px")
            .css("right", (docWidth - coords.left - Exhibit.jQuery(this._containerElmt).width()) + "px");
        this._fillPopup(popup);
        Exhibit.jQuery(popup).fadeIn();
        Exhibit.jQuery(document.body).append(popup);
        popup.bind("mouseover", function(evt) {
            self._onPopupMouseOver(evt);
        });
        popup.bind("mouseout", function(evt) {
            self._onPopupMouseOut(evt);
        });
        
        this._popup = popup;
        this._hovering = true;
    } else {
        this._clearTimeout();
    }
};

/**
 * @param {jQuery.Event} evt
 */
Exhibit.ToolboxWidget.prototype._onContainerMouseOut = function(evt) {
    if (Exhibit.ToolboxWidget._mouseOutsideElmt(evt, this._containerElmt)) {
        this._setTimeout();
    }
};

/**
 * @param {jQuery.Event} evt
 */
Exhibit.ToolboxWidget.prototype._onPopupMouseOver = function(evt) {
    this._clearTimeout();
};

/**
 * @param {jQuery.Event} evt
 */
Exhibit.ToolboxWidget.prototype._onPopupMouseOut = function(evt) {
    if (Exhibit.ToolboxWidget._mouseOutsideElmt(evt, this._containerElmt)) {
        this._setTimeout();
    }
};

/**
 *
 */
Exhibit.ToolboxWidget.prototype._setTimeout = function() {
    var self = this;
    this._timer = window.setTimeout(function() {
        self._onTimeout();
    }, 200);
};

/**
 *
 */
Exhibit.ToolboxWidget.prototype._clearTimeout = function() {
    if (this._timer) {
        window.clearTimeout(this._timer);
        this._timer = null;
    }
};

/**
 *
 */
Exhibit.ToolboxWidget.prototype._onTimeout = function() {
    this._dismiss();
    this._hovering = false;
    this._timer = null;
};

/**
 * @param {jQuery} elmt
 */
Exhibit.ToolboxWidget.prototype._fillPopup = function(elmt) {
    var self, exportImg;
    self = this;
    
    exportImg = Exhibit.UI.createTranslucentImage("images/liveclipboard-icon.png");
    Exhibit.jQuery(exportImg).attr("class", "exhibit-toolboxWidget-button");
    Exhibit.jQuery(exportImg).bind("click", function(evt) {
        self._showExportMenu(exportImg, evt);
    });
    Exhibit.jQuery(elmt).append(exportImg);
};

Exhibit.ToolboxWidget.prototype._dismiss = function() {
    if (this._popup !== null) {
        Exhibit.jQuery(this._popup).fadeOut("fast", function() {
            Exhibit.jQuery(this).remove();
        });
        this._popup = null;
    }
};

/**
 * @param {jQuery.Event} evt
 * @param {Element|jQuery} elmt
 * @returns {Boolean}
 * @depends jQuery
 */
Exhibit.ToolboxWidget._mouseOutsideElmt = function(evt, elmt) {
    var eventCoords, coords;
    eventCoords = { "x": evt.pageX, "y": evt.pageY };
    coords = Exhibit.jQuery(elmt).offset();
    return (eventCoords.x < coords.left ||
            eventCoords.x > coords.left + elmt.offsetWidth ||
            eventCoords.y < coords.top ||
            eventCoords.y > coords.top + elmt.offsetHeight);
};

/**
 * @param {Element} elmt
 * @param {jQuery.Event} evt
 */
Exhibit.ToolboxWidget.prototype._showExportMenu = function(elmt, evt) {
    var self, popupDom, makeMenuItem, exporters, i;

    self = this;

    popupDom = Exhibit.UI.createPopupMenuDom(elmt);
    
    makeMenuItem = function(exporter) {
        popupDom.appendMenuItem(
            exporter.getLabel(),
            null,
            function() {
                var database, text;
                database = self._uiContext.getDatabase();
                text = (typeof self._settings.itemID !== "undefined") ?
                    exporter.exportOne(self._settings.itemID, database) :
                    exporter.exportMany(
                        self._uiContext.getCollection().getRestrictedItems(), 
                        database
                    );
                Exhibit.ToolboxWidget.createExportDialogBox(text).open();
            }
        );
    };
    
    exporters = Exhibit.staticRegistry.getKeys(Exhibit.Exporter._registryKey);
    for (i = 0; i < exporters.length; i++) {
        makeMenuItem(Exhibit.staticRegistry.get(
            Exhibit.Exporter._registryKey,
            exporters[i]
        ));
    }
    
    if (typeof this.getGeneratedHTML === "function") {
        makeMenuItem({
            "getLabel":  function() { return Exhibit._("%export.htmlExporterLabel"); },
            "exportOne":  this.getGeneratedHTML,
            "exportMany": this.getGeneratedHTML
        });
    }

    popupDom.open(evt);
};

/**
 * @param {String} string
 * @returns {Object}
 */
Exhibit.ToolboxWidget.createExportDialogBox = function(string) {
    var template, dom;
    template = {
        "tag":      "div",
        "class":    "exhibit-copyDialog exhibit-ui-protection",
        "children": [
            {   tag:        "button",
                field:      "closeButton",
                children:    [ Exhibit._("%export.exportDialogBoxCloseButtonLabel") ]
            },
            {   tag:        "p",
                children:   [ Exhibit._("%export.exportDialogBoxPrompt") ]
            },
            {   tag:        "div",
                field:      "textAreaContainer"
            }
        ]
    };
    dom = Exhibit.jQuery.simileDOM("template", template);
    Exhibit.jQuery(dom.textAreaContainer).html("<textarea wrap='off' rows='15'>" + string + "</textarea>");
        
    Exhibit.UI.setupDialog(dom, true);

    dom.open = function() {
        var textarea;

        Exhibit.jQuery(dom.elmt).css("top", (document.body.scrollTop + 100) + "px");
        
        Exhibit.jQuery(document.body).append(Exhibit.jQuery(dom.elmt));
        Exhibit.jQuery(document).trigger("modalSuperseded.exhibit");
        
        textarea = Exhibit.jQuery(dom.textAreaContainer).children().get(0);
        textarea.select();
        Exhibit.jQuery(dom.closeButton).bind("click", function(evt) {
            dom.close();
        });
        Exhibit.jQuery(textarea).bind("keyup", function(evt) {
            if (evt.keyCode === 27) { // ESC
                dom.close();
            }
        });
    };
    
    return dom;
};
Exhibit.jQuery(document).bind("registerLocales.exhibit", function() {
    Exhibit.jQuery(document).trigger("beforeLocalesRegistered.exhibit");
    new Exhibit.Locale("default", Exhibit.urlPrefix + "locales/en/locale.js");
    new Exhibit.Locale("en", Exhibit.urlPrefix + "locales/en/locale.js");
    new Exhibit.Locale("de", Exhibit.urlPrefix + "locales/de/locale.js");
    new Exhibit.Locale("es", Exhibit.urlPrefix + "locales/es/locale.js");
    new Exhibit.Locale("fr", Exhibit.urlPrefix + "locales/fr/locale.js");
    new Exhibit.Locale("nl", Exhibit.urlPrefix + "locales/nl/locale.js");
    new Exhibit.Locale("no", Exhibit.urlPrefix + "locales/no/locale.js");
    new Exhibit.Locale("sv", Exhibit.urlPrefix + "locales/sv/locale.js");
    new Exhibit.Locale("pt-BR", Exhibit.urlPrefix + "locales/pt-BR/locale.js");
    Exhibit.jQuery(document).trigger("localesRegistered.exhibit");
});
/**
 * @fileOverview Load locales, any dynamic post-script loading activities.
 */

Exhibit.jQuery(document).ready(function() {
    var delays, localeLoaded;
    // Without threading, this shouldn't introduce a race condition,
    // but it is definitely a problem if concurrency comes into play.
    // Maybe refactoring so everything uses the delay queue under the hood
    // would make more sense.
    delays = [];
    localeLoaded = false;

    Exhibit.jQuery(document).bind("delayCreation.exhibit", function(evt, delayID) {
        delays.push(delayID);
    });

    Exhibit.jQuery(document).bind("delayFinished.exhibit", function(evt, delayID) {
        var idx = delays.indexOf(delayID);
        if (idx >= 0) {
            delays.splice(idx);
            if (delays.length === 0 && localeLoaded) {
                delays = null;
                Exhibit.jQuery(document).trigger("scriptsLoaded.exhibit");
            }
        }
    });
    
    Exhibit.jQuery(document).bind("localeSet.exhibit", function(evt, localeURLs) {
        var i;
        for (i = 0; i < localeURLs.length; i++) {
            Exhibit.loader.script(localeURLs[i]);
        }
        Exhibit.jQuery(document).trigger("loadExtensions.exhibit");
    });

    Exhibit.jQuery(document).bind("error.exhibit", function(evt, e, msg) {
        Exhibit.UI.hideBusyIndicator();
        Exhibit.Debug.exception(e, msg);
        alert(msg);
    });

    Exhibit.jQuery(document).one("localeLoaded.exhibit", function(evt) {
        localeLoaded = true;
        if (delays.length === 0) {
            Exhibit.jQuery(document).trigger("scriptsLoaded.exhibit");
        }
    });

    Exhibit.jQuery(document).one("scriptsLoaded.exhibit", function(evt) {
        Exhibit.jQuery(document).trigger("registerStaticComponents.exhibit", Exhibit.staticRegistry);
    });

    Exhibit.jQuery(document).one("exhibitConfigured.exhibit", function(evt, ex) {
        Exhibit.Bookmark.init();
        Exhibit.History.init(ex);
    });

    // Signal recording
    Exhibit.jQuery(document).one("loadExtensions.exhibit", function(evt) {
        Exhibit.signals["loadExtensions.exhibit"] = true;
    });

    Exhibit.jQuery(document).one("exhibitConfigured.exhibit", function(evt) {
        Exhibit.signals["exhibitConfigured.exhibit"] = true;
    });

    Exhibit.checkBackwardsCompatibility();
    Exhibit.staticRegistry = new Exhibit.Registry(true);

    Exhibit.jQuery("link[rel='exhibit-extension']").each(function(idx, el) {
        Exhibit.loader.script(Exhibit.jQuery(el).attr("href"));
    });

    Exhibit.loader.wait(function() {
        Exhibit.jQuery(document).trigger("registerLocalization.exhibit", Exhibit.staticRegistry);
    });
});
