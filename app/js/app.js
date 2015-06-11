/**
 * @class ama
 * Main application. Handles dependencies and routing.
 */
var app = angular.module('ama', ['ui.router', 'btford.modal','pascalprecht.translate', 'ngAnimate', 'ngSanitize','pickadate','ui.sortable']);


app.config( [
    '$compileProvider',
    '$httpProvider',
    function( $compileProvider, $httpProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|chrome|chrome-extension):/);

        $httpProvider.defaults.withCredentials = true;
    }
]);

/**
 * @method run
 *
 */
app.run(function ($rootScope, $state, AuthService, LocalStorage, $q, constants) {


    /*
     * Checks if the current user is logged in and sets the 'loggedin' variable
     * which will be used to get the login state at any other point
     * @return {Object}
     */
    var getLoginState = function(){
        console.log('loggedIn',$rootScope.loggedIn);
        var defer = $q.defer();
        AuthService.currentUser().then(function (data) {
            LocalStorage.setKey(data.fe_key);
            $rootScope.loggedIn = true;
            $rootScope.currentUserName = data.username;
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

    $rootScope.linkurl = constants.URL;



    /**
     * Processes the login logic at every stateChange
     */
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        console.log(toState);
        // if loggedIn is not set yet, wait for getLoginState
        if($rootScope.loggedIn === undefined)
        {
            getLoginState().then(function () {
                loginLogic(event, toState, toParams);
            });
        } else {
            loginLogic(event, toState, toParams);
        }

    });


    // trigger a refresh whenever user clicks history buttons
    window.onpopstate = function (e) {
        $state.reload();

    };

    angular.element(document).on("click", function(e) {
        $rootScope.$broadcast("documentClicked", angular.element(e.target));
    });

});
/**
 * @class ama.constants.sites
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
                    template: '<div data-ui-view="appContent" class="fullheight next-fullheight"></div>'
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
            url: '/clients',
            abstract: true,
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/clients.html'
                }
            },
            params: {
                hasDetails: true
            }
        }
    },
    {
        name: 'app.clients.detail',
        stateObject: {
            url: '/:id'
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
            url: '/offers',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/offers.html'
                }
            }
        }
    },
    {
        name: 'app.offerDetail',
        stateObject: {
            url: '/offers/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/offerDetail.html'
                }
            }
        }
    },
    {
        name: 'app.offerCreation',
        stateObject: {
            url: '/new-offer',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/offerCreation.html'
                }
            },
            params: {
                project: null,
                referrer: null,
                referrerParams: null
            }
        }
    },
    {
        name: 'app.contractCreation',
        stateObject: {
            url: '/new-contract',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/contractCreation.html'
                }
            },
            params: {
                project: null,
                referrer: null,
                referrerParams: null
            }
        }
    },
    {
        name: 'app.acceptanceCreation',
        stateObject: {
            url: '/new-acceptance',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/acceptanceCreation.html'
                }
            },
            params: {
                project: null,
                referrer: null,
                referrerParams: null
            }
        }
    },
    {
        name: 'app.invoiceCreation',
        stateObject: {
            url: '/new-invoice',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/invoiceCreation.html'
                }
            },
            params: {
                project: null,
                referrer: null,
                referrerParams: null
            }
        }
    },
    {
        name: 'app.projectCreation',
        stateObject: {
            url: '/new-project',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/projectCreation.html'
                }
            }
        }
    },
    {
        name: 'app.projectDetail',
        stateObject: {
            url: '/project/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/projectDetail.html'
                }
            }
        }
    },
    {
        name: 'app.projectArchive',
        stateObject: {
            url: '/project-archive',
            abstract: true,
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/projects.html'
                }
            },
            params: {
                hasDetails: true
            }
        }
    },
    {
        name: 'app.projectArchive.detail',
        stateObject:{
            url: '/:id'
        }
    },
    {
        name: 'app.contractDetail',
        stateObject: {
            url: '/contracts/:type/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/contractDetail.html'
                }
            }
        }
    },
    {
        name:'app.todoDetail',
        stateObject: {
            url: '/todos/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/todoDetail.html'
                }
            }
        }
    },
    {
        name:'app.todoCreation',
        stateObject: {
            url: '/new-todo',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/todoCreation.html'
                }
            },
            params: {
                project: null,
                referrer: null,
                referrerParams: null
            }
        }
    },
    {
        name: 'app.acceptanceDetail',
        stateObject: {
            url: '/acceptances/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/acceptanceDetail.html'
                }
            }
        }
    },
    {
        name:'app.invoiceDetail',
        stateObject: {
            url: '/invoices/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/invoiceDetail.html'
                }
            }
        }
    },
    {
        name:'app.reminderDetail',
        stateObject: {
            url: '/reminder/:id',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/reminderDetail.html'
                }
            }
        }
    },
    {
        name:'app.itemPresets',
        stateObject: {
            abstract: true,
            url: '/item-presets',
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/itemPresets.html'
                }
            },
            params: {
                hasDetails: true
            }
        }
    },
    {
        name: 'app.itemPresets.detail',
        stateObject: {
            url: '/:id'
        }
    },
    {
        name:'app.itemPresetCreation',
        stateObject: {
            url: '/new-item-preset',
            params: {
                referrer: null,
                referrerParams: null
            },
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/itemPresetCreation.html'
                }
            }
        }
    },
    {
        name:'app.itemCreation',
        stateObject: {
            url: '/new-item/:for/:forId',
            params: {
                referrer: null,
                referrerParams: null
            },
            views: {
                'appContent': {
                    templateUrl: 'templates/pages/itemCreation.html'
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
 * @method config
 * App Config
 * Configures i18n and app states
 */
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider, sites, $translateProvider, constants, $locationProvider,pickadateI18nProvider) {
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

    pickadateI18nProvider.translations = {
            prev: '<i class="md md-chevron-left"></i>',
            next: '<i class="md md-chevron-right"></i>'
    }
});