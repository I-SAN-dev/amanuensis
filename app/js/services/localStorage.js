/**
 * @class ama.services.LocalStorage
 * # LocalStorage
 * The local storage service allows us to persistently save/retrieve data to/from HTML5 local storage
 * @author Christian Baur, Sebastian Antosch
 */
app.factory('LocalStorage', ['$window', '$rootScope', function($window, $rootScope){
    var encryptionKey;

    angular.element($window).on('storage', function(event){
        $rootScope.$apply();
    });

    /**
     * Trys to parse a string as JSON, returns object if true, otherwise returns the String
     * @param {string} jsonString - the string that might be json
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
     */
    var cleanUpCache = function()
    {
        var toClear = [];
        for ( var i = 0, len = sessionStorage.length; i < len; ++i ) {

            var key = sessionStorage.key(i);
            if (key.indexOf('http') == 0)
            {
                toClear.push(key);
            }
        }
        /* this separation is needed due to index-changes when entrys are removed */
        for(i in toClear)
        {
            sessionStorage.removeItem(toClear[i]);
        }
        toClear = [];
        console.log('LocalStorage cleaned!');
    };

    var encrypt = function (actual) {
        if(actual && encryptionKey) {
            var result = "";
            for (var i = 0; i < actual.length; i++) {
                result += String.fromCharCode(actual.charCodeAt(i) + encryptionKey.charCodeAt(i % encryptionKey.length));
            }
            return result;
        }
    };

    var decrypt = function (encrypted) {
        if(encrypted && encryptionKey) {
            var result = "";
            for (var i = 0; i < encrypted.length; i++) {
                result += String.fromCharCode(encrypted.charCodeAt(i) - encryptionKey.charCodeAt(i % encryptionKey.length));
            }
            return result;
        }
    };




    /* Public service functions */
    return {
        /**
         * Creates or updates an entry (key-value pair) in the local storage
         * @param {string} key The storage entry's key
         * @param {string|object} val Value to save in the local storage
         * @param {boolean} [encrypted] Indicates if the value to save should be encrypted. Defaults to true.
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
                processedValue = encrypt(processedValue);
            }

            /* Store the Data */
            if($window.sessionStorage)
            {
                try
                {
                    $window.sessionStorage.setItem(cleanKey(key), processedValue);
                }
                catch(e)
                {
                    cleanUpCache();
                    $window.sessionStorage.setItem(cleanKey(key), processedValue);
                }
            }
            else
            {
                alert("Your device does not support localStorage. This is really not good, we can't do anything for you in this case.");
            }
        },

        /**
         * Gets data from the local storage.
         * @param {string} key The key of the storage's entry to be retrieved
         * @param {boolean} [encrypted] Indicates if the value to be retrieved is stored encrypted. Defaults to true.
         * @return: {string|object} - the corresponding localStorage entry
         */
        getData: function(key, encrypted){
            var jsonString = $window.sessionStorage.getItem(cleanKey(key));
            if(encrypted != false){
                jsonString = decrypt(jsonString);
            }
            return tryParseJSON(jsonString);
        },

        /**
         * Removes a specific item from the localStorage
         * @param {string} key - The key of the storage's entry to be removed
         */
        removeItem: function (key) {
            $window.sessionStorage.removeItem(key);
        },

        /**
         * Removes the entire data from the local storage
         */
        removeCache: function () {
            $window.sessionStorage.clear();
        },

        /**
         * Sets the key for encryption
         * @param {string} key - a key coming from the API which will be used to encrypt the cache
         */
        setKey: function(key){
            encryptionKey = key;
        }
    }
}]);