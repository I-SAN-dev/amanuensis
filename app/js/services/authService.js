angular.module('ama')
.factory('AuthService', ['$q','$http', 'sha256Filter', 'ApiAbstractionLayer',function($q, $http, sha256Filter, ApiAbstractionLayer){
        return {
            currentUser: function(){
                /*$http.get("api/?action=user_get").then(function (result) {
                    console.log(result);
                });*/
                return ApiAbstractionLayer('GET','user_get');
                //return currentUser;
            },
            login: function(email, password) {
                var deferred = $q.defer();
                console.log('Login called');
                /*$http.get("api/?action=login&email="+email)
                    .success(function (result) {
                        console.log(result);
                        var token = result.token;
                        var salt = result.salt;

                        var hashedPass = sha256Filter(password);
                        var passSalt = sha256Filter(hashedPass + salt);
                        var passToSend = sha256Filter(passSalt + token);

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
                    });*/
                ApiAbstractionLayer('GET', {name: 'login', params: {action: 'login', email: email}})
                    .then(function (result) {
                        var token = result.token;
                        var salt = result.salt;

                        var hashedPass = sha256Filter(password);
                        var passSalt = sha256Filter(hashedPass + salt);
                        var passToSend = sha256Filter(passSalt + token);

                        ApiAbstractionLayer('POST', {name: 'login', data: {action: 'login',email: email,password: passToSend}})
                            .then(function (data) {
                                deferred.resolve(data);
                                console.log('Success');
                            })
                    });

                return deferred.promise;

            },
            logout: function(){
                ApiAbstractionLayer('GET', 'logout').then(function (result) {
                    console.log(result);
                });

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