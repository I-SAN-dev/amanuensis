app.directive('materialInput', [function () {
    return {
        restrict: 'A',
        templateUrl: 'templates/directives/materialInput.html',
        scope: {
            model:'=ngModel',
            id: '@inputId',
            label: '@inputLabel'
        },
        replace: true
    }
}]);