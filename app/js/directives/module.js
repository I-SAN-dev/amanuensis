/**
 * The amaModule directive.
 * Shows a module with content specified in 'js/scriptsbytemplate/modules.jst'
 *
 * @author Christian Baur
 */
app.controller('ModuleCtrl', [
    '$scope',
    'modules',
    '$state',
    '$rootScope',
    function ($scope, modules, $state, $rootScope) {
        $scope.template = 'templates/modules/'+$scope.name+'.html';

        var self = this;

        /**
         * gets the module's content for the specified state
         * @param state - name of the ui-router state
         */
        var getContent = function (state) {
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



    }
]);
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