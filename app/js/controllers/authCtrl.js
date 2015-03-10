angular.module('ama')
.controller('AuthCtrl', ['AuthService', function (AuthService) {
        this.loggedIn = AuthService.isLoggedIn || false;

        var currentUser = AuthService.currentUser();

        this.email = currentUser.email;

        this.submit = function (email, password) {

            if(password){
                AuthService.login(email, password);
            } else {
                AuthService.logout();
            }
        }()
    }]);