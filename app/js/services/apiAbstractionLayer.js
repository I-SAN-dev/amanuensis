angular.module('ama')
    .factory('ApiAbstractionLayer', ['$http', 'constants', '$q', '$state', function ($http, constants, $q, $state) {
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
                    if(status == 401) {
                        $state.go('login');
                    }
                    console.log(data, status, headers, config);
                    defer.reject(data);

                });
            return defer.promise;

        };
    }]);