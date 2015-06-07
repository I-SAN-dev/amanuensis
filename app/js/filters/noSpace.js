/**
 * @class ama.filters.nospace
 *
 * # The nospace filter
 * Removes white space from text. useful for html values that cannot have spaces
 * ## Usage
 * HTML:
 *
 *     {{some_text | nospace}}
 *
 * JavaScript:
 *
 *     $filter('nospace')(some_text)
 *
 * Source: [gist.github.com](https://gist.github.com/builtbylane/7237798)
 */
app.filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});