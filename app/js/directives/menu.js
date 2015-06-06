/**
 * @class ama.controllers.NavCtrl
 *
 * Controller for menus ({@link ama.directives.amaMenu amaMenu directive}) and navigation items
 * builds a navigation list from the {@link ama.constants.sites sites} and {@link ama.constants.modules modules} constants
 * and handles clicks on menu items
 *
 * @author Christian Baur
 */
app.controller('NavCtrl',[
        'AuthService',
        '$state',
        'sites',
        '$scope',
        'modules',
        '$rootScope',
        function (AuthService, $state, sites, $scope, modules, $rootScope) {
            var self = this;
            var name=$scope.name;

            var menuItems =  [];

            var services = {
                'AuthService': AuthService
            };

            // get the menu items from the sites constant
            for(var i = 0; i<sites.length; i++) {
                if(sites[i].menus && sites[i].menus[name]){
                    menuItems.push(sites[i]);
                }
            }

            // only show the menu when user is logged in
            $rootScope.$watch('loggedIn', function (newValue, oldValue) {
                if(newValue === true){
                    self.navItems = menuItems;
                } else {
                    self.navItems = [];
                }
            });

            var setActiveClass = function (stateName) {
                angular.forEach(menuItems, function(value, key){
                    value.active = value.name == stateName;
                });
            };

            /**
             * Handles clicks on menu items
             * @param {Object} item The item that was clicked
             */
            this.goTo = function(item){
                // value.active will set an active class on the menu item
                setActiveClass(item.name);

                var menuItem = item.menus[name];
                if(menuItem.click){
                    services[menuItem.service][menuItem.click]();
                }


                // change state
                $state.go(item.name).then(function(data){
                    console.log(data);
                }, function (data) {
                    console.log(data);
                    //$state.go(item.name);
                });
            };

            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                angular.forEach(menuItems, function (value, key) {
                    value.active = value.name == toState.name;
                })
            });

            /**
             * additional classes for the menu list from the modules constant
             * @type {string}
             */
            this.additionalClasses = modules[name].additionalClasses || '';

            setActiveClass($state.current.name);

        }
    ]
);

/**
 * @class ama.directives.amaMenu
 *
 * Directive for menus
 * Takes a menuname which will be used to identify the menu in the controller
 *
 * ## Usage
 *
 *     <div ama-menu menuname="referenceOfThisMenuInSitesConstant"></div>
 */
app.directive('amaMenu', [function(){
    return {
        restrict: 'A',
        scope: {
            name: '=menuname'
        },
        templateUrl: 'templates/modules/navItems.html',
        controller: 'NavCtrl',
        controllerAs: 'nav'
    }
}]);