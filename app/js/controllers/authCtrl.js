angular.module('ama')
.controller('AuthCtrl', ['AuthService', function (AuthService) {
        var self = this;
        this.loggedIn = false;

        this.getUser = function () {
            AuthService.currentUser();
        };

        //this.email = currentUser.email;

        this.submit = function (email, password) {
            console.log('submit');
            if(! self.loggedIn){
                AuthService.login(email, password).then(function (result) {
                    console.log(result);
                });
            } else {
                console.log(self.loggedIn);
                AuthService.logout();
            }
        };
    }]);