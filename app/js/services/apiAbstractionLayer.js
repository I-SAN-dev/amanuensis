/**
 * API Abstraction Service
 * Provides a simple function that will perform the right API call depending on its parameters
 * @param method {string} - 'GET'|'POST' (other methods might be supported later)
 * @param identifier {string|object} - an identifier for the api action
 * @return {promise}
 */
app
    .factory('ApiAbstractionLayer', [
        '$http',
        'constants',
        '$q',
        '$state',
        'ErrorDialog',
        '$stateParams',
        '$rootScope',
        function ($http, constants, $q, $state, ErrorDialog, $stateParams, $rootScope) {
            //var specialParams = {};
            var apiUrl = /*(constants.SECUREURL || constants.BASEURL)+*/'api/';


            return function (method, identifier, noErrorModal) {
                // the API action is either equal to the identifier or identifier.name
                var action = identifier;
                if (typeof(identifier) == "object") {
                    action = identifier.name;
                }

                // build the request config object for the $http service
                var config = {
                    url: apiUrl,
                    method: method,
                    params: identifier.params || {},
                    data: identifier.data || {}
                };
                config.params.action = action;
                config.data.action = action;
                //$.extend(config, specialParams[id]);


                var defer = $q.defer();
                // perform the HTTP request
                $http(config)
                    .success(function (data) {
                        defer.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        if (!noErrorModal) {
                            // Open modal with error information
                            ErrorDialog(data.error).activate();
                        }
                        // handle 401 (Authentication required) errors in place
                        if (status == 401) {
                            $rootScope.loggedIn = false;
                            $state.go('login', {referrer: $state.current.name, referrerParams: $stateParams});
                        }
                        defer.reject(data);
                    });
                return defer.promise;

            };
        }]);