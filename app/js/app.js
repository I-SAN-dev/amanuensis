/**
 * Main application. Handles dependencies and routing.
 */
var app = angular.module('ama', ['ui.router', 'btford.modal','pascalprecht.translate', 'ngAnimate']);
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

    // redirects to login state if authentication is required for the next state and the user is not logged in
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


    var wasLoaded = null;
    // trigger a refresh whenever user clicks history buttons
    window.onpopstate = function (e) {
        console.log(wasLoaded);
        // Safari hack
        if(wasLoaded === null) {
            wasLoaded = true;
        } else {
            location.reload();
            wasLoaded = null;
        }
    };
    window.onload = function () {


        if(wasLoaded === null) {
            setTimeout(function () {
                wasLoaded = true;
                console.log(wasLoaded);
            },0);
        }

    };

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
            topRightNav: {
                name: 'Logout',
                title: 'Logout',
                icon: 'md md-lg md-exit-to-app',
                iconOnly: true,
                service: 'AuthService',
                click: 'logout'
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
                name: 'dashboard.menuName',
                title: 'dashboard.menuTitle',
                icon: 'md md-home'
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
                name: 'clients.menuName',
                title: 'clients.menuTitle',
                icon: 'md md-people'
            }
        }
    },
    {
        name: 'app.clientCategories',
        stateObject: {
            url:'/client-categories',
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
            params: {
                referrer: null,
                referrerParams: null
            },
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
            url: '/offers/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/offers.html'
                }
            }
        }
    },
    {
        name: 'app.projects',
        stateObject: {
            url: '/projects/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/projects.html'
                }
            }
        },
        menus: {
            mainNav: {
                name: 'projects.menuName',
                title: 'projects.menuTitle',
                icon: 'md md-folder'
        }
    }
    },
    {
        name: 'app.acceptances',
        stateObject: {
            url: '/acceptances/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/acceptances.html'
                }
            }
        }
    },
    {
        name:'app.invoices',
        stateObject: {
            url: '/invoices/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/invoices.html'
                }
            }
        }
    },
    {
        name:'app.settings',
        stateObject: {
            url: '/settings',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/settings.html'
                }
            }
        },
        menus: {
            topRightNav: {
                name: 'Settings',
                title: 'Settings',
                icon: 'md md-lg md-settings',
                iconOnly: true
            }
        }
    }

]);

/**
 * App Config
 * Configures i18n and app states
 */
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, sites, $translateProvider, constants, $locationProvider) {
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


    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/dashboard');
});