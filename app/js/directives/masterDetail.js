app.directive('masterDetail', [function(){
    return {
        restrict: 'A',
        scope: {
            masterTpl: '=',
            detail: '=',
            detailTpl: '='
        },
        templateUrl: 'templates/directives/masterDetail.html',
        controller: function ($scope) {
            console.log($scope.masterTpl);
            this.detail = $scope.detail;
            this.masterTpl = $scope.masterTpl;
            this.detailTpl = $scope.detailTpl;
            var self = this;
            this.setDetail = function(detail){
                console.log(detail);
                self.detail = detail;
            }
        },
        controllerAs: 'MasterDetailCtrl'
    }
}]);