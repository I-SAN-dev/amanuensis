/**
 * Main application. Handles dependencies and routing.
 */
var app = angular.module('ama', ['ui.router', 'btford.modal','pascalprecht.translate']);
app.run(function ($rootScope, $state, AuthService, $q) {

    /**
     * Checks if the current user is logged in and sets the 'loggedin' variable
     * which will be used to get the login state at any other point
     * @returns {d.promise|promise|.Deferred.promise|promise.promise|jQuery.promise|n.ready.promise|*}
     */
    $rootScope.getLoginState = function(){
        var defer = $q.defer();
        AuthService.isLoggedIn().then(function (data) {
            $rootScope.loggedIn = data.loggedin;
            defer.resolve();
            console.log('loggedIn',$rootScope.loggedIn);
        });
        return defer.promise;
    };

    // redirects to login state if if authentication is required for the next state and the user is not logged in
    var loginLogic = function (event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;
        if (requireLogin && !$rootScope.loggedIn) {
            event.preventDefault();
            $state.go('login', {referrer:toState.name, referrerParams:toParams});
        }
    };

    /**
     * Processes the login logic at every stateChange
     */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        // if loggedIn is not set yet, wait for getLoginState
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
/**
 * The 'sites' constant.
 * Contains information about all app states,
 * each including the actual state object and any additional information needed
 */
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
                // all child states will require login
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
/**
 * App Config
 * Configures i18n and app states
 */
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

    // create all app states based on the 'sites' constant
    var states = sites;
    for(var i= 0; i<states.length; i++){
        $stateProvider.state(states[i].name, states[i].stateObject);
    }



    $urlRouterProvider.otherwise('/dashboard');
});