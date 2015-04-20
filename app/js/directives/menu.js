app.controller('NavCtrl',[
        'AuthService',
        '$state',
        'sites',
        '$scope',
        'modules',
        function (AuthService, $state, sites, $scope, modules) {
            var menuItems = [];
            var name=$scope.name;

            for(var i = 0; i<sites.length; i++) {
                if(sites[i].menus && sites[i].menus[name]){
                    menuItems.push(sites[i]);
                }
            }
            var self = this;
            AuthService.isLoggedIn().then(function(data) {
                if(data.loggedin)
                    self.navItems = menuItems;
            });
            this.goTo = function(item){
                angular.forEach(menuItems, function(value, key){
                    if(value.name == item.name)
                    {
                        value.active = true;
                    }
                    else
                    {
                        value.active = false;
                    }
                });
                $state.go(item.name);
            };

            this.additionalClasses = modules[name].additionalClasses || '';
        }
    ]
);
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