/**
 * @class ama.controllers.ModuleCtrl
 * Controller for the {@link ama.directives.amaModule amaModule directive}.
 * Shows a module with content specified in 'js/scriptsbytemplate/modules.jst'
 *
 * @author Christian Baur
 */
app.controller('ModuleCtrl', [
    'AuthService',
    '$scope',
    'modules',
    '$state',
    '$rootScope',
    function (AuthService, $scope, modules, $state, $rootScope) {
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

/**
 * @class ama.directives.amaModule
 * Shows a module with custom content
 *
 * ## Usage
 *     <div ama-module="moduleName"></div>
 */
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