angular.module('ama')
.controller('AuthCtrl', ['AuthService', function (AuthService) {
        var self = this;

        this.getUser = function () {
            AuthService.currentUser().then(function(result){
                return result;
            });
        };

        //this.email = currentUser.email;

        this.submit = function (email, password) {
            console.log('submit');
            AuthService.login(email, password).then(function (result) {
                    console.log(result);
                });
            };
        this.logout = function () {
            AuthService.logout().then(function(result){
                console.log(result);
            });
        };

    }]);