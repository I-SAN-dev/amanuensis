/**
 * Filter using the jsSHA library to hash the input with sha-256
 * @param {string} input - the string to be hashed
 */
angular.module('ama')
    .filter('sha256', function(){
        return function (input) {
            var shaObj = new jsSHA(input, "TEXT");
            return shaObj.getHash("SHA-256", "HEX")
        };
    });