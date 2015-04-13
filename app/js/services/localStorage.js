/**
 * The local storage service allows us to persistently save/retrieve data to/from HTML5 local storage
 * @namespace js/services/localStorage
 * @author Christian Baur, Sebastian Antosch
 */
app.factory('LocalStorage', ['$window', '$rootScope', function($window, $rootScope){
    angular.element($window).on('storage', function(event){
        $rootScope.$apply();
    });

    /**
     * Trys to parse a string as JSON, returns object if true, otherwise returns the String
     * @param {string} jsonString - the string that might be json
     * @memberof js/services/localStorage
     */
    var tryParseJSON = function(jsonString){
        try {
            var o = JSON.parse(jsonString);

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns 'null', and typeof null === "object",
            // so we must check for that, too.
            if (o && typeof o === "object" && o !== null) {
                return o;
            }
        }
        catch (e) { }

        return jsonString;
    };

    /**
     * Cleans up a key by removing unnecessary url parameters, preventing duplicate entries
     * @param {string} key - the key (mostly url) to be checked
     * @memberof js/services/localStorage
     */
    var cleanKey = function(key)
    {
        var index = key.indexOf('&$filter');
        if (index == -1)
        {
            return key;
        }
        else
        {
            return key.substring(0, index);
        }
    };

    /**
     * Cleans up the local Storage and removes all entrys starting with http (= all cached requests)
     * should be called when a local storage quote exceeded exception is thrown
     * @memberof js/services/localStorage
     */
    var cleanUpCache = function()
    {
        var toClear = [];
        for ( var i = 0, len = localStorage.length; i < len; ++i ) {

            var key = localStorage.key(i);
            if (key.indexOf('http') == 0)
            {
                toClear.push(key);
            }
        }
        /* this separation is needed due to index-changes when entrys are removed */
        for(i in toClear)
        {
            localStorage.removeItem(toClear[i]);
        }
        toClear = [];
        console.log('LocalStorage cleaned!');
    };

    var encrypt = function (actual, key) {
        var result = "";
        for (var i = 0; i < actual.length; i++) {
            result += String.fromCharCode(actual.charCodeAt(i) + key.charCodeAt(i % key.length));
        }
        return result;
    };

    var decrypt = function (encrypted, key) {
        if(encrypted) {
            var result = "";
            for (var i = 0; i < encrypted.length; i++) {
                result += String.fromCharCode(encrypted.charCodeAt(i) - key.charCodeAt(i % key.length));
            }
            return result;
        }
    };




    /* Public service functions */
    return {
        /**
         * Creates or updates an entry (key-value pair) in the local storage
         * @param: {string} key -  the storage entry's key
         * @param: {string|object} val - value to save in the local storage
         * @memberof js/services/localStorage
         */
        setData: function(key, val, encrypted){

            /* If the value is an object, serialize it with Json */
            var processedValue;
            if(val !== null && typeof val === 'object')
            {
                processedValue = JSON.stringify(val);
            }
            else
            {
                processedValue = val;
            }

            if(encrypted != false) {
                processedValue = encrypt(processedValue, $window.localStorage.getItem('salt'));
            }

            /* Store the Data */
            if($window.localStorage)
            {
                try
                {
                    $window.localStorage.setItem(cleanKey(key), processedValue);
                }
                catch(e)
                {
                    cleanUpCache();
                    $window.localStorage.setItem(cleanKey(key), processedValue);
                }
            }
            else
            {
                alert("Your device does not support localStorage. This is really not good, we can't do anything for you in this case.");
            }
        },

        /**
         * Gets data from the local storage.
         * @param: {string} key - The key of the storage's entry to be retrieved
         * @return: {string|object} - the corresponding localStorage entry
         * @memberof js/services/localStorage
         */
        getData: function(key, encrypted){
            var jsonString = $window.localStorage.getItem(cleanKey(key));
            if(encrypted != false){
                jsonString = decrypt(jsonString, $window.localStorage.getItem('salt'));
            }
            return tryParseJSON(jsonString);
        },

        /**
         * Removes a specific item from the localStorage
         * @param {string} key - The key of the storage's entry to be removed
         */
        removeItem: function (key) {
            $window.localStorage.removeItem(key);
        },

        /**
         * Removes the entire data from the local storage
         */
        removeCache: function () {
            $window.localStorage.clear();
        }
    }
}]);