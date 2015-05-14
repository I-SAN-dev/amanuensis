app.directive('clientBox', [
    function () {
        return {
            restrict: 'A',
            scope: {
                client: '=clientBox'
            },
            templateUrl: 'templates/directives/clientBox.html',
            controller: ['$scope', function ($scope) {
                this.client = $scope.client;
            }],
            controllerAs: 'box'
        }
    }
]);