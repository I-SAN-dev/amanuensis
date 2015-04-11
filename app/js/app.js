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
    var getLoginState = function(){
        console.log('loggedIn',$rootScope.loggedIn);
        var defer = $q.defer();
        AuthService.isLoggedIn().then(function (data) {
            $rootScope.loggedIn = data.loggedin;
            defer.resolve();

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
        console.log(toState);
        // if loggedIn is not set yet, wait for getLoginState
        if($rootScope.loggedIn === undefined)
        {
            console.log('loggedin is undefined');
            getLoginState().then(function () {
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
            url: '/clients/:id',
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
        name: 'app.clientCategories',
        stateObject: {
            url:'clients/categories',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/clientCategories.html'
                }
            }
        }
    },
    {
        name: 'app.clientCreation',
        stateObject: {
            url:'/new-client',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/clientCreation.html'
                }
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
        },
        menus: {
            mainNav: {
                name: 'Projects',
                title: 'Projects'
        }
    }
    },
    {
        name: 'app.acceptances',
        stateObject: {
            url: '/acceptances',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/acceptances.html'
                }
            }
        },
        menus: {
            mainNav: {
                name: 'Acceptances',
                title: 'Acceptances'
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
        },
        menus: {
            mainNav: {
                name: 'Invoices',
                title: 'Invoices'
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