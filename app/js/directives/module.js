app.controller('ModuleCtrl', ['$scope', 'modules', '$state', '$rootScope', function ($scope, modules, $state, $rootScope) {
    $scope.template = 'templates/modules/'+$scope.name+'.html';

    var self = this;
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        var module = modules[$scope.name];
        var specificModule = module[toState.name];
        self.content = module.content;
        if(specificModule){
            self.content = angular.extend(module.content, specificModule);
        }
        console.log(toState.name);
    });


}]);
app.directive('amaModule', [function(){
    return {
        restrict: 'A',
        replace: true,
        scope: {
            name: '=amaModule'
        },
        templateUrl: 'templates/modules/amaModule.html',
        controller: 'ModuleCtrl',
        controllerAs: 'module'
    }
}]);