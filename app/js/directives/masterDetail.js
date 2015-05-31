/**
 * The masterDetail directive
 * Shows a master detail view. A template for master and detail must be specified.
 * Furthermore a controller for detail can be supplied.
 * Integrates with the masterDetailService
 *
 * @author Christian Baur
 */
app.directive('masterDetail', [function(){
    return {
        restrict: 'A',
        scope: {
            masterTpl: '=',
            detail: '=?',
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



                /**
                 * Gets the stateParams from master
                 * @param forState
                 * @returns {*}
                 */
                this.getStateParams = function(forState){
                    return MasterDetailService.notifyMaster('getStateParams', forState);
                };


                /**
                 * Sets a new detail item and notifies other controllers that the detail has changed
                 * @param detail - the new detail object
                 * @param keyboard - indicates if the detail was changed by keyboard input
                 */
                $scope.setDetail = function(detail, keyboard){
                    self.detail = MasterDetailService.setDetailView(detail,keyboard);
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

                MasterDetailService.setController($scope);

                this.notifyMaster = MasterDetailService.notifyMaster;
            }],
        controllerAs: 'MasterDetailCtrl'
    }
}]);