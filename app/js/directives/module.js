app.controller('ModuleCtrl', [
    '$scope',
    'modules',
    '$state',
    '$rootScope',
    function ($scope, modules, $state, $rootScope) {
        $scope.template = 'templates/modules/'+$scope.name+'.html';

        var self = this;


        console.log($rootScope.loaded);
        setTimeout(function () {
            console.log($rootScope.loaded);
        }, 5000);

        var getContent = function (state) {
            console.log(state);
            var module = modules[$scope.name];
            var specificModule = module[state];
            self.content = module.content;
            if(specificModule){
                self.content = angular.extend({}, module.content, specificModule);
            }
        };

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