/**
 * API Abstraction Service
 * Provides a simple function that will perform the right API call depending on its parameters
 * @param method {string} - 'GET'|'POST' (other methods might be supported later)
 * @param identifier {string|object} - an identifier for the api action
 * @return {promise}
 */
angular.module('ama')
    .factory('ApiAbstractionLayer', ['$http', 'constants', '$q', '$state', 'ErrorDialog', function ($http, constants, $q, $state, ErrorDialog) {
        var specialParams = {};
        var apiUrl = /*(constants.SECUREURL || constants.BASEURL)+*/'api/';


        return function(method,identifier) {
            var id = identifier;
            if(typeof(identifier) == "object") {
                id = identifier.name;
            }
            var config = {
                url: apiUrl,
                method: method,
                params: identifier.params,
                data: identifier.data
            };
            if(typeof(identifier)== "string") {
                config.params = {action: identifier};
            }
            $.extend(config, specialParams[id]);



            var defer = $q.defer();
            $http(config)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    // Open modal with error information
                    ErrorDialog(data.error).activate();
                    if(status == 401) {
                        $state.go('login');
                    }
                    defer.reject(data);
                });
            return defer.promise;

        };
    }]);