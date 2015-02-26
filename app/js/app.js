var app = angular.module('ama', ['ui.router']);
app.run(function () {

});
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('index', {
            url: '',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/start.html'
                }
            },
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('something', {
            url: '/something',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/something.html'
                }
            }
        })

    ;
    $urlRouterProvider.otherwise('')
});

app.controller('SomeCtrl', function() {
    this.sth="Something";
});