/**
 * Controller for menus (amaMenu directive) and navigation items
 * builds a navigation list from the sites and modules constants
 * and handles clicks on menu items
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
            AuthService.isLoggedIn().then(function(data) {
                if(data.loggedin)
                    self.navItems = menuItems;
            });

            $rootScope.$watch('loggedIn', function (newValue, oldValue) {
                if(newValue === true){
                    self.navItems = menuItems;
                } else {
                    self.navItems = [];
                }
            });

            // Handle clicks on menu items
            // value.active will set an active class on the menu item
            this.goTo = function(item){
                angular.forEach(menuItems, function(value, key){
                    value.active = value.name == item.name;
                });
                console.log(item);

                var menuItem = item.menus[name];
                if(menuItem.click){
                    services[menuItem.service][menuItem.click]();
                }

                // change state
                $state.go(item.name);
            };

            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                angular.forEach(menuItems, function (value, key) {
                    value.active = value.name == toState.name;
                })
            });

            // read additional classes for the menu list from the modules constant
            this.additionalClasses = modules[name].additionalClasses || '';


        }
    ]
);

/**
 * Directive for menus
 * Takes a menuname which will be used to identify the menu in the controller
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