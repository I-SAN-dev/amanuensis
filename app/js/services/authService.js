angular.module('ama')
.factory('AuthService', ['$q','$http', 'sha256Service',function($q, $http, sha256Service){
        var currentUser;
        return {
            currentUser: function(){
                return currentUser;
            },
            login: function(email, password) {
                var deferred = $q.defer();
                console.log('Login called');
                $http.get("api/?action=login&email="+email)
                    .success(function (result) {
                        console.log(result);
                        var token = result.token;
                        var salt = result.salt;

                        var hashedPass = sha256Service(password);
                        var passSalt = sha256Service(hashedPass + salt);
                        var passToSend = sha256Service(passSalt + token);

                        $http.post("api/", {
                            action: 'login',
                            email: email,
                            password: passToSend
                        }).success(function (data) {
                            deferred.resolve(data);
                        }).error(function (data, status, headers, config) {
                            console.log(data, status, headers, config);
                            deferred.reject(data);
                        });
                    }).error(function (errorData, status, headers, config) {
                        console.log(errorData);
                        deferred.reject(errorData);
                    });

                return deferred.promise;

            },
            logout: function(){

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