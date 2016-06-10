;(function ($, window, document, undefined) {

    var pluginName = "scopeLinkTags",
        defaults = {
            // http://stackoverflow.com/questions/12575845/what-is-the-regex-of-a-css-selector
            // http://regexr.com/328s7
            cssRuleRegex: /(([^\r\n,{}]+)(,(?=[^}]*{)|\s*{))/g, // /(^[a-zA-Z]*\.[\S])/g
            useScopedStyle: true,
            useParentElementID: true,
            scopeCssSelector: null
        };

    function scopeCss (css, scopeSelector, cssRuleRegex) {
        cssRuleRegex = cssRuleRegex || defaults.cssRuleRegex;
        return css.replace(cssRuleRegex, scopeSelector + ' $1');
    }

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function () {
            var options = this.options;
            var $element = this.$element;

            var linkHref = $element.attr('href');
            var linkCssPromise = $.ajax({
                mimeType: 'text/css',
                url: linkHref
            });
            return linkCssPromise.then(function (css) {

                var $parent = $element.parent();

                var $scopedStyleTag = $('<style>').data('scoped-link-href', linkHref);
                if (options.useScopedStyle &&
                    !options.scopeCssSelector &&
                    'scoped' in $scopedStyleTag[0]) {

                    $scopedStyleTag.prop('scoped', true);
                    $scopedStyleTag.html(css);
                } else {
                    var scopeSelector = '';
                    var parentID = $parent.attr('id');
                    if (options.scopeCssSelector) {
                        scopeSelector = options.scopeCssSelector;
                    } else if (parentID && options.useScopedStyle) {
                        scopeSelector = parentID;
                    } else {
                        scopeSelector = '.' + $.grep($parent.attr('class').split(' '), function(x){ return !!x; }).join('.');
                    }

                    $scopedStyleTag.data('scope-css-selector', scopeSelector);

                    var scopedCss = scopeCss(css, scopeSelector, options.cssRuleRegex);

                    $scopedStyleTag.html(scopedCss);
                }

                $scopedStyleTag.insertBefore($element);
                $element.remove();
            }).then(null, function (error) {
                if (typeof console !== 'undefined' && typeof console.log === 'function') {
                    console.log('Clould not load '+ linkHref, error);
                }
            });
        },

        destroy: function () {
            // Place logic that completely removes
            // the plugin's functionality
            var $link = $('link').attr({
                'href': this.$element.data('scoped-link-href'),
                'rel': 'stylesheet',
                'type': 'text/css'
            });
            $link.insertBefore(this.$element);
            $.removeData(this.element, pluginName);
            $.removeData(this.element, 'scoped-link-href');
            $.removeData(this.element, 'scope-css-selector');
        }
    };

    $.fn[pluginName] = function (options) {
        var result,
            restArgs = Array.prototype.slice.call(arguments, 1);

        var CSS_LINK_SELECTOR = 'link[type="text/css"]'; // [rel="stylesheet" ]

        var $filteredElements = this.filter(CSS_LINK_SELECTOR);

        var $links = $filteredElements.length ?
            $filteredElements :
            this.find(CSS_LINK_SELECTOR);

        $links.each(function () {
            var instance = $.data(this, "plugin_" + pluginName);
            if (!instance) {
                instance = new Plugin(this, options);
                $.data(this, "plugin_" + pluginName, instance);

                // When the first argument matches the name of a method
            } else if (typeof options === "string" && // method name
                options[0] !== "_" && // protect private methods
                typeof instance[options] === "function") {

                // invoke the method with the rest arguments
                result = instance[options].apply(instance, restArgs);
                if (result !== undefined) {
                    return false; // break the $.fn.each() iteration
                }
            }
        });

        // if there is no return value,
        // then return `this` to enable chaining
        return result !== undefined ? result : this;
    };

    $.fn[pluginName].scopeCss = scopeCss;

})(jQuery, window, document);
