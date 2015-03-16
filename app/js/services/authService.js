angular.module('ama')
.factory('AuthService', ['$q','$http', 'sha256Filter', 'ApiAbstractionLayer',function($q, $http, sha256Filter, ApiAbstractionLayer){

        return {
            currentUser: function(){
                return ApiAbstractionLayer('GET','user_get');
            },
            login: function(email, password) {
                var deferred = $q.defer();
                ApiAbstractionLayer('GET', {name: 'login', params: {action: 'login', email: email}})
                    .then(function (result) {
                        var token = result.token;
                        var salt = result.salt;
                        if (password) {
                            var hashedPass = sha256Filter(password);
                            var passSalt = sha256Filter(hashedPass + salt);
                            var passToSend = sha256Filter(passSalt + token);
                        } else {
                            deferred.reject();
                        }
                        ApiAbstractionLayer('POST', {name: 'login', data: {action: 'login',email: email,password: passToSend}})
                            .then(function (data) {
                                deferred.resolve(data);
                            })
                    });

                return deferred.promise;

            },
            logout: function(){
                var defer = $q.defer();
                ApiAbstractionLayer('GET', 'logout').then(function (result) {
                    defer.resolve(result);
                });
                return defer.promise;
            },
            isLoggedIn: function(){
                var deferred = $q.defer();
                $http.get("api/?action=login")
                    .then(function(result){
                        deferred.resolve(result.loggedIn);
                    }, function (error) {
                        // TODO: Real error handling
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }
    }]);