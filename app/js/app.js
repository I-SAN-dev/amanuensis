/**
 * Main application. Handles dependencies and routing.
 */
var app = angular.module('ama', ['ui.router', 'btford.modal','pascalprecht.translate']);
app.run(function ($rootScope, $state, AuthService, $q) {


    $rootScope.getLoginState = function(){
        var defer = $q.defer();
        AuthService.isLoggedIn().then(function (data) {
            $rootScope.loggedIn = data.loggedin;
            defer.resolve();
            console.log('loggedIn',$rootScope.loggedIn);
        });
        return defer.promise;
    };

    var loginLogic = function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        if (requireLogin && !$rootScope.loggedIn) {
            event.preventDefault();
            $state.go('login', {referrer:toState.name, referrerParams:toParams});
        }
    };
    /**
     * Login logic, see: http://brewhouse.io/blog/2014/12/09/authentication-made-simple-in-single-page-angularjs-applications.html
     */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

        if($rootScope.loggedIn === undefined)
        {
            $rootScope.getLoginState().then(function () {
                loginLogic(event, toState, toParams);
            });
        } else {
            loginLogic(event, toState, toParams);
        }

    });

});
app.constant('sites', [
    {
        name: 'index',
        stateObject: {
            url: '/index',
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
        }
    },
    {
        name:'login',
        stateObject: {
            url: '/login',
            params: {
                referrer: null,
                referrerParams: null
            },
            views: {
                'mainContent': {
                    templateUrl: 'templates/pages/login.html'
                }
            },
            data: {
                id: 'login',
                name: 'Login'
            }
        },
        menus: {
            mainNav: {
                name: 'Login',
                title: 'Login'
            }
        }
    },
    {
        name: 'app',
        stateObject: {
            abstract: true,
            url: '',
            data: {
                requireLogin: true
            },
            views: {
                'mainContent': {
                    template: '<div data-ui-view="appContent"></div>'
                }
            },
            resolve: {
                authenticate: ['AuthService', function (AuthService) {
                    AuthService.currentUser(true).then(function () {
                        console.log('logged in');
                    }, function () {
                        console.log('not logged in');
                    });
                }]
            }
        }
    },
    {
        name: 'app.dashboard',
        stateObject: {
            url: '/dashboard',
            views: {
                'appContent': {
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
                'appContent': {
                    templateUrl: 'templates/pages/clients.html'
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
                'appContent': {
                    templateUrl: 'templates/pages/offers.html'
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
                'appContent': {
                    templateUrl: 'templates/pages/projects.html'
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
                    templateUrl: 'templates/pages/acceptances.html'
                }
            }
        }
    },
    {
        name:'app.invoices',
        stateObject: {
            url: '/invoices',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/invoices.html'
                }
            }
        }
    }

]);
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, sites, $translateProvider, constants) {
    /*
     * Configure the i18n service
     */
    $translateProvider.useStaticFilesLoader({
        prefix: 'lang/' + constants.LANGUAGE_PREFIX,
        suffix: constants.LANGUAGE_SUFFIX
    });
    /*
     * Set default language
     */
    $translateProvider.preferredLanguage(constants.LANGUAGE);

    var states = sites;
    for(var i= 0; i<states.length; i++){
        $stateProvider.state(states[i].name, states[i].stateObject);
    }



    $urlRouterProvider.otherwise('/dashboard');
});