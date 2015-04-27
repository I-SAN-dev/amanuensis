app.controller('ModuleCtrl', ['$scope', 'modules', '$state', '$rootScope', function ($scope, modules, $state, $rootScope) {
    $scope.template = 'templates/modules/'+$scope.name+'.html';

    var self = this;

    var getContent = function (state) {
        console.log(state);
        var module = modules[$scope.name];
        var specificModule = module[state];
        self.content = module.content;
        if(specificModule){
            self.content = angular.extend({}, module.content, specificModule);
        }
    };

    /*$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        getContent(toState.name);
    });*/

    $rootScope.$on('$viewContentLoaded', function (event) {
        getContent($state.current.name);
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