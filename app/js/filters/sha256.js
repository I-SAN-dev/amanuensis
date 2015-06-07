/**
 * @class ama.filters.sha256
 * # The sha256 filter
 *
 * Filter using the jsSHA library to hash the input with sha-256
 * ## Usage
 *
 * HTML:
 *
 *     {{someString|sha256}}
 *
 * JavaScript:
 *
 *     $filter('sha256')(someString)
 *
 * @param {string} input - the string to be hashed
 */
angular.module('ama')
    .filter('sha256', function(){
        return function (input) {
            var shaObj = new jsSHA(input, "TEXT");
            return shaObj.getHash("SHA-256", "HEX")
        };
    });