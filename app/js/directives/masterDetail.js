app.directive('masterDetail', [function(){
    return {
        restrict: 'A',
        scope: {
            master: '=',
            masterTpl: '=',
            detail: '=',
            detailTpl: '='
        },
        templateUrl: 'templates/directives/masterDetail.html',
        controller: function ($scope) {
            this.master = $scope.master;
            this.detail = $scope.detail;
            var self = this;
            this.setDetail = function(detail){
                self.detail = detail;
            }
        },
        controllerAs: 'md'
    }
}]);