app.directive('amaModule', [function(){
    return {
        restrict: 'A',
        replace: true,
        scope: {
            name: '=amaModule'
        },
        templateUrl: 'templates/modules/amaModule.html',
        controller: function($scope){
            $scope.template = 'templates/modules/'+$scope.name+'.html';
        }
    }
}]);