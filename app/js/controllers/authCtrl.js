angular.module('ama')
.controller('AuthCtrl', ['AuthService', function (AuthService) {
        this.loggedIn = AuthService.isLoggedIn().then(function (result) {
            return result;
        }) || false;

        var currentUser = AuthService.currentUser();

        this.email = currentUser.email;

        this.submit = function (email, password) {

            if(password){
                AuthService.login(email, password).then(function (result) {
                    console.log(result);
                });
            } else {
                AuthService.logout();
            }
        }()
    }]);