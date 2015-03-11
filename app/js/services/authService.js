angular.module('ama')
.factory('AuthService', ['$q','$http',function($q, $http){
        var currentUser;
        return {
            currentUser: function(){
                return currentUser;
            },
            login: function(email, password) {
                var deferred = $q.defer();
                $http.get("http://cb.ama.i-san.de/api/?action=login&email="+email)
                    .then(function (result) {
                        if(result.error){
                            deferred.reject(result.error);
                        }
                        var token = result.token;
                        var salt = result.salt;

                        var password = password.$filter('sha256');
                        var passSalt = (password + salt).$filter('sha256');
                        var passToSend = (passSalt + token).$filter('sha256');

                        $http.post("http://cb.ama.i-san.de/api/", {
                            action: "login",
                            email: email,
                            password: passToSend
                        }).then(function (result) {
                            if(result.error){
                                deferred.reject(result.error)
                            } else {
                                deferred.resolve(result);
                            }
                        }, function (error) {
                            deferred.reject(error);
                        });

                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            },
            logout: function(){

            },
            isLoggedIn: function(){
                var deferred = $q.defer();
                $http.get("http://cb.ama.i-san.de/api/?action=login")
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