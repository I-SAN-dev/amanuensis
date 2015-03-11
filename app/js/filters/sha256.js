angular.module('ama')
.filter('sha256', function(){
        return function (input) {
            var shaObj = new jsSHA(input, "TEXT");
            return shaObj.getHash("SHA-256", "HEX")
        };
    });