angular.module('ama')
.factory('AuthService', [function(){
        var currentUser;
        return {
            currentUser: function(){
                return currentUser;
            },
            login: function(email, password) {

            },
            logout: function(){

            },
            isLoggedIn: function(){

            }
        }
    }]);