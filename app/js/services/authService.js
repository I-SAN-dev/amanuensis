angular.module('ama')
.factory('AuthService', ['$q','$http', 'sha256Filter',function($q, $http, sha256Filter){
        var currentUser;
        return {
            currentUser: function(){
                return currentUser;
            },
            login: function(email, password) {
                var deferred = $q.defer();
                console.log('Login called');
                $http.get("http://cb.ama.i-san.de/api/?action=login&email="+email)
                    .success(function (result) {
                        console.log(result);
                        if (result.error) {
                            deferred.reject(result.error);
                        }
                        var token = result.token;
                        var salt = result.salt;

                        var hashedPass = sha256Filter(password);
                        var passSalt = sha256Filter(hashedPass + salt);
                        var passToSend = sha256Filter(passSalt + token);

                        $http.post("http://cb.ama.i-san.de/api/", {
                            action: 'login',
                            email: email,
                            password: passToSend
                        }).success(function (data) {
                            if (data.error) {
                                deferred.reject(data.error)
                            } else {
                                deferred.resolve(data);
                            }
                        }).error(function (data, status, headers, config) {
                            console.log(data, status, headers, config);
                            deferred.reject(data);
                        });
                    }).error(function (errorData, statur, headers, config) {
                        console.log(header);
                        deferred.reject(errorData);
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