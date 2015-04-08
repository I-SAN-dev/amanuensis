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
            console.log($scope.detail);
            this.detail = $scope.detail;
            this.masterTpl = $scope.masterTpl;
            this.detailTpl = $scope.detailTpl;
            var self = this;
            $scope.setDetail = function(detail){
                self.detail = detail;
                $scope.$broadcast('detailChanged', detail);
            };
            $scope.setDetailTpl = function(templateUrl) {
                self.detailTpl = templateUrl;
                $scope.$broadcast('detailTemplateChanged', self.detail);
            };
        },
        controllerAs: 'MasterDetailCtrl'
    }
}]);