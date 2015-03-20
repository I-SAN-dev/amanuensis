app.controller('NavCtrl',['AuthService','$state','sites', '$scope',function (AuthService, $state, sites, $scope) {
    var menuItems = [];
    var name=$scope.name;

    for(var i = 0; i<sites.length; i++) {
        if(sites[i].menus && sites[i].menus[name]){
            menuItems.push(sites[i]);
        }
    }
    var self = this;
    /*AuthService.currentUser().then(function(data){
        self.navItems = menuItems;
    });*/
    this.goTo = function(item){
        $state.go(item.name);
    };
}]);
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