/**
 * @class ama.controllers.RootCtrl
 * Just a first controller for the app. Doesn't do anything apart from logging "Hello world"
 *
 * *DEPRECATED:* Not used
 * TODO: Delete this file
 */
app.controller('RootCtrl', ['AuthService','$state', function (AuthService, $state) {
    console.log('Hello world');
    /*AuthService.currentUser(true).then(function(data){
        $state.go('app.dashboard');
    }, function () {
        $state.go('login');
    });*/
}]);