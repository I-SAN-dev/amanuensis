var app = angular.module('ama', ['ui.router']);
app.run(function ($rootScope, $state) {

    /**
     * Login logic, see: http://brewhouse.io/blog/2014/12/09/authentication-made-simple-in-single-page-angularjs-applications.html
     */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
            event.preventDefault();
            $state.go('login')
        }
    });
});
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    //$httpProvider.defaults.headers.post = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' };

    $stateProvider
        .state('index', {
            url: '',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/start.html'
                }
            },
            data: {
                requireLogin: false
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
        .state('login',{
            url: '/login',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/login.html'
                }
            },
            data: {
                requireLogin: false
            }
        })
        .state('app',{
            abstract: true,
            url: '/app',
            data: {
                requireLogin: true
            },
            templateUrl: 'index.php'
        })
        .state('app.dashboard',{
            url: '/dashboard',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        })
        .state('app.clients',{
            url: '/clients',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        })
        .state('app.offers',{
            url: '/offers',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        })
        .state('app.projects',{
            url: '/projects',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        })
        .state('app.acceptances',{
            url: '/acceptances',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        })
        .state('app.invoices',{
            url: '/invoices',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        })

    ;
    $urlRouterProvider.otherwise('')
});

app.controller('SomeCtrl', function() {
    this.sth="Something";
});