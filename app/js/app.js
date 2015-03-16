/**
 * Main application. Handles dependencies and routing.
 */
var app = angular.module('ama', ['ui.router', 'btford.modal']);
app.run(function ($rootScope, $state, AuthService) {

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

    $rootScope.getUser = function(){
        return AuthService.currentUser();
    };

});
app.constant('sites', [
    {
        name: 'index',
        stateObject: {
            url: '',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/start.html'
                },
                'mainNav':{
                    templateUrl: 'templates/modules/mainNav.html'
                }
            },
            data: {
                requireLogin: false
            },
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        }
    },
    {
        name:'something',
        stateObject: {
            url: '/something',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/something.html'
                }
            }
        }
    },
    {
        name:'login',
        stateObject: {
            url: '/login',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/login.html'
                }
            },
            data: {
                id: 'login',
                name: 'Login'
            }
        }
    },
    {
        name: 'app',
        stateObject: {
            abstract: true,
            url: '/app',
            data: {
                requireLogin: true
            },
            templateUrl: 'index.php'
        }
    },
    {
        name: 'app.dashboard',
        stateObject: {
            url: '/dashboard',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        },
        menus: {
            mainNav: {
                name: 'Dashboard',
                title: 'App Dashboard'
            }
        }
    },
    {
        name: 'app.clients',
        stateObject: {
            url: '/clients',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        },
        menus: {
            mainNav: {
                name: 'Clients',
                title: 'Clients'
            }
        }
    },
    {
        name: 'app.offers',
        stateObject: {
            url: '/offers',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        },
        menus: {
            mainNav: {
                name: 'Offers',
                title: 'Offers'
            }
        }
    },
    {
        name: 'app.projects',
        stateObject: {
            url: '/projects',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        }
    },
    {
        name: 'app.acceptances',
        stateObject: {
            url: '/acceptances',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        }
    },
    {
        name:'app.invoices',
        stateObject: {
            url: '/invoices',
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/dashboard.html'
                }
            }
        }
    }

]);
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, sites) {
    var states = sites;
    for(var i= 0; i<states.length; i++){
        $stateProvider.state(states[i].name, states[i].stateObject);
    }



    $urlRouterProvider.otherwise('');
});