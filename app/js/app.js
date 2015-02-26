var app = angular.module('ama', []);
app.run(function () {

});
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '',
            views: {

            }
        }
    );

    $urlRouterProvider.otherwise('/')
});