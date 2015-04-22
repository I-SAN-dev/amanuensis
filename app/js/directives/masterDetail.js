app.directive('masterDetail', [function(){
    return {
        restrict: 'A',
        scope: {
            masterTpl: '=',
            detail: '=',
            detailTpl: '='
        },
        templateUrl: 'templates/directives/masterDetail.html',
        controller: function ($scope, $state, $stateParams ) {
            console.log($scope.detail);
            this.detail = $scope.detail;
            this.masterTpl = $scope.masterTpl;
            this.detailTpl = $scope.detailTpl;
            var self = this;
            $scope.setDetail = function(detail){
                //var defer = $q.defer();
                self.detail = detail;
                $scope.$broadcast('detailChanged', detail);
                $state.transitionTo($state.$current.name, {id: detail.id},{ location: true, inherit: true, relative: $state.$current, notify: false });
            };
            $scope.setDetailTpl = function(templateUrl) {
                self.detailTpl = templateUrl;
                $scope.$broadcast('detailTemplateChanged', self.detail);
            };
        },
        controllerAs: 'MasterDetailCtrl'
    }
}]);