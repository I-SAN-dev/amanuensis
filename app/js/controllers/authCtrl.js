/**
 * Controller for the login page
 */
angular.module('ama')
.controller('AuthCtrl', ['AuthService', '$state', function (AuthService, $state) {

        this.message = $state.current.data.message;

        var self = this;
        /**
         * Gets the current user
         */
        this.getUser = function () {
            AuthService.currentUser().then(function(result){
                return result;
            });
        };

        this.email = '';
        AuthService.currentUser(true).then(function(user){
            self.email = user.email;
        });


        /**
         * Tries to login the user with the submitted data
         * @param email - the user's mail address
         * @param password - the user's password
         */
        this.submit = function (email, password) {
            AuthService.login(email, password).then(function (result) {
                    console.log(result);
                });
            };
        /**
         * Logs the user out
         */
        this.logout = function () {
            AuthService.logout().then(function(result){
                console.log(result);
            });
        };

    }]);