angular.module('ama')
    .factory('ApiAbstractionLayer', ['$http', 'constants', '$q', function ($http, constants, $q) {
        var specialParams = {};
        var apiUrl = /*(constants.SECUREURL || constants.BASEURL)+*/'api/';
        specialParams.login = {
            url: apiUrl
        };
        specialParams.logout = {
            url: apiUrl+'?action=logout'
        };
        specialParams.user_get = {
            url: apiUrl+'?action=user_get'
        };

        return function(method,identifier) {
            var id = identifier;
            if(typeof identifier == Object) {
                id = identifier.name;
            }
            var config = {
                method: method,
                params: identifier.params,
                data: identifier.data
            };
            $.extend(config, specialParams[id]);

            console.log(config);

            var defer = $q.defer();
            $http(config)
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function (data) {
                    defer.reject(data);
                });
            return defer.promise;

        };
    }]);