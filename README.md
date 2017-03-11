jQuery ScopeLinkTags plugin
===========================
This plugin provides a way to scope CSS `<link>` tags inside their container, similarly to the way that [scoped `<style>` tags work](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style#attr-scoped).
Initially inspired by [this stackoverflow response](http://stackoverflow.com/a/12578281/1206668) and [thingsinjars/jQuery-Scoped-CSS-plugin](https://github.com/thingsinjars/jQuery-Scoped-CSS-plugin).

# Installation

`npm install jquery-scopelinktags`

# Usage
Include this plugin's source and on `$(document).ready()` call:
```js
// scope all <link> tags inside of the <body>
$('body').scopeLinkTags();

// OR specifically define the scoped section/container
$('.scoped-section').scopeLinkTags();

// OR even target specific <link> tags with your own custom selector
$('link[data-scoped]').scopeLinkTags();
```

## Options
The `scopeLinkTags()` method optionally accepts an object with the following parameters:

### styleTagSelector
Type: [String](http://api.jquery.com/Types/#String) (Default: `'style'`)  
Can be used to change the selector used to find the `<style>` tags.

### cssLinkSelector
Type: [String](http://api.jquery.com/Types/#String) (Default: `'link[type="text/css"]'`)  
Can be used to change the selector used to find the `<link>` tags.

### cssRuleRegex
Type: [Regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)  
Can be used to change the Regex that is used to detect each separate CSS selector.

### useScopedStyle
Type: [Boolean](http://api.jquery.com/Types/#Boolean) (Default: `true`)  
Define whether scoped `<style>` tags may be used when supported.

### useParentElementID
Type: [Boolean](http://api.jquery.com/Types/#Boolean) (Default: `true`)  
Define whether the ID of the `<link>` parent element may be used when available. Otherwise a new unique `[class]` will be generated and used for each `<link>` tag.

### scopeCssSelector
Type: [String](http://api.jquery.com/Types/#String)  
Explicitly defines the parent CSS selector to be used for scoping.

## Methods

### destroy
You can revert the effects by using the `destroy` method:
```js
$('body').scopeLinkTags('destroy');
```

### scopeCss(css, scopeSelector[, cssRuleRegex])
The method that scopes the CSS rules is globally available:
```js
var myCss = "p { color: blue; }";
var scopedCss = $.fn.scopeLinkTags.scopeCss(myCss, '.myScopedBlueArea');
```

The jQuery plugin instance can be rertieved from the generated `<style>` tag with:
```js
var instance $('.scopedArea > style').data('scopeLinkTags');
```


# Notes

* In case that the browser natively supports `<style scoped>`, it will be used to scope the `<link>` tag CSS. Can be disabled using the `useScopedStyle` option.
* When `<style scoped>` is not supported, the plugin will use the `[id]` of the container element, or a newly created unique `[class]`, as a parent selector for the CSS rules detected (using a REGEX replace).

# Limitations

* Only `<link>` tags that have the `[type="text/css"]` attribute will be processed.
* Does not apply to externally loaded stylesheets (via @import).
* When wrapping the detected CSS with a parent CSS selector
  * Expect to work on valid CSS, even when minified.
  * Please open a ticket if you find a case that the used REGEX doesn't work
