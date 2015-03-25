app.controller('RootCtrl', ['AuthService','$state', function (AuthService, $state) {
    console.log('Hello world');
    AuthService.currentUser(true).then(function(data){
        $state.go('app.dashboard');
    }, function () {
        $state.go('login');
    });
}]);