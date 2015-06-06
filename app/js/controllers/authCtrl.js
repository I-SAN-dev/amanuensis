/**
 * @class ama.controllers.AuthCtrl
 * Controller for the login view
 */
angular.module('ama')
.controller('AuthCtrl', ['AuthService', '$state', '$stateParams','$rootScope', function (AuthService, $state, $stateParams, $rootScope) {

        /**
         * @type {String}
         * A message printed on the page in case of login failure
         * *Deprecated:* We use modals for this now
         */
        this.message = $state.current.data.message;

        var self = this;
        /**
         * Gets the current user from the {@link ama.services.AuthService AuthService}
         */
        this.getUser = function () {
            AuthService.currentUser().then(function(result){
                return result;
            });
        };

        /**
         *
         * @type {string}
         */
        this.email = '';
        /*AuthService.currentUser(true).then(function(user){
            self.email = user.email;
        });*/


        /**
         * Tries to login the user with the submitted data
         * @param email - the user's mail address
         * @param password - the user's password
         */
        this.submit = function (email, password) {
            AuthService.login(email, password).then(function (result) {
                var to = $stateParams.referrer || 'app.dashboard';
                var toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
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