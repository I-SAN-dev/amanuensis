app.controller('MainNavCtrl',['AuthService','$state','sites',function (AuthService, $state, sites) {
    var menuItems = [];
    var name='mainNav';

    console.log(sites);
    for(var i = 0; i<sites.length; i++) {
        console.log(menuItems);
        if(sites[i].menus && sites[i].menus[name]){
            menuItems.push(sites[i]);
        }
    };
    var self = this;
    AuthService.currentUser().then(function(data){
        self.navItems = menuItems;


    });
    this.goTo = function(id){
        $state.go(id)
    };
}]);