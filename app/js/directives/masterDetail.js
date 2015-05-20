app.directive('masterDetail', [function(){
    return {
        restrict: 'A',
        scope: {
            masterTpl: '=',
            detail: '=',
            detailTpl: '=',
            masterList: '=',
            masterLoaded: '='
        },
        transclude: true,
        templateUrl: 'templates/directives/masterDetail.html',
        controller: [
            '$scope',
            '$state',
            '$stateParams',
            '$q',
            'MasterDetailService',
            function ($scope, $state, $stateParams, $q, MasterDetailService) {
                this.detail = $scope.detail;
                this.masterTpl = $scope.masterTpl;
                this.detailTpl = $scope.detailTpl;
                this.filterText = $stateParams.filter || '';

                var self = this;

                this.getStateParams = function(forState){
                    console.log('getStateParams');
                    return MasterDetailService.notifyMaster('getStateParams', forState);
                };


                /**
                 * Sets a new detail item and notifies other controllers that the detail has changed
                 * @param detail - the new detail object
                 */
                $scope.setDetail = function(detail, keyboard){
                    console.log(detail);
                    if(MasterDetailService.editMode) {
                        MasterDetailService.notifyEditor('cancel');
                        MasterDetailService.editMode = false;
                    }
                    $stateParams.id = detail.id;
                    self.detail = detail;
                    MasterDetailService.notifyDetail('detailChanged', detail, keyboard);
                };





                /**
                 * Set a new template for the detail view
                 * TODO: check if this still works...
                 * @param templateUrl
                 */
                $scope.setDetailTpl = function(templateUrl) {
                    console.log('tralaala');
                    self.detailTpl = templateUrl;
                    $scope.$broadcast('detailTemplateChanged', self.detail);
                };


            }],
        controllerAs: 'MasterDetailCtrl'
    }
}]);