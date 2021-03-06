/**
 * @class ama.services.ApiAbstractionLayer
 *
 * # API Abstraction Service
 * Provides a simple function that will perform the right API call depending on its parameters
 * @param {string} method 'GET'|'POST'|'DELETE' (other methods are currently not supported by the API)
 * @param {string|object} identifier An identifier for the API action. The object contains the name of the API action and additional params or data. If no additional data/params are required, the service also accepts the action as a string
 * @param {bool} noErrorModal *Optional.* If true, no message will be shown in case of an error.
 * @return {promise} A promise containing the desired data from the API or an error object.
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
        'GoBackService',
        function ($http, constants, $q, $state, ErrorDialog, $stateParams, $rootScope, GoBackService) {
            //var specialParams = {};
            var apiUrl = 'api/';
            if(constants.SECUREURL)
            {
                apiUrl = constants.SECUREURL+'/api/';
            }


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
                $rootScope.loaded = false;
                // perform the HTTP request
                $http(config)
                    .success(function (data) {
                        $rootScope.loaded = true;
                        defer.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        if (!noErrorModal) {
                            // Open modal with error information
                            ErrorDialog(data.error).activate();
                            if (status == 404) {
                                GoBackService();
                            }
                        }
                        // handle 401 (Authentication required) errors in place
                        if (status == 401) {
                            $rootScope.loggedIn = false;
                            if($state.current.name != 'login'){
                                console.log($state.current, $stateParams);
                                $state.go('login', {referrer: $state.current.name, referrerParams: angular.copy($stateParams)});
                            }
                        }


                        $rootScope.loaded = true;
                        defer.reject(data);
                    });
                return defer.promise;

            };
        }]);