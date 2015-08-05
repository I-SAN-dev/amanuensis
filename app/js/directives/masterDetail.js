/**
 * @class ama.directives.masterDetail
 *
 * The masterDetail directive
 * Shows a master detail view. A template for master and detail must be specified.
 * Furthermore a controller for detail can be supplied.
 * Integrates with the masterDetailService
 *
 * ## Usage
 *     <div master-detail
 *          master-tpl="path/to/template/for/master.html"
 *          detail-tpl="path/to/template/for/detail.html"
 *          master-list="theMasterList"
 *          masterLoaded="booleanValue"
 *          detail="theCurrentDetail (optional)"></div>
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
            'DeleteService',
            function ($scope, $state, $stateParams, $q, MasterDetailService, DeleteService) {
                /**
                 * The detail object
                 * @type {Object}
                 */
                this.detail = $scope.detail;

                /**
                 * Path to the master view's template file
                 * @type {string}
                 */
                this.masterTpl = $scope.masterTpl;

                /**
                 * Path to the detail view's template file
                 * @type {string}
                 */
                this.detailTpl = $scope.detailTpl;

                /**
                 * String to filter the master list with
                 * @type {*|string}
                 */
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
                 * @param [keyboard] - indicates if the detail was changed by keyboard input
                 */
                $scope.setDetail = function(detail, keyboard){
                    self.detail = MasterDetailService.setDetailView(detail, keyboard);
                };



                /**
                 * Set a new template for the detail view
                 * TODO: check if this still works...
                 * @deprecated not used
                 * @param templateUrl
                 */
                $scope.setDetailTpl = function(templateUrl) {
                    console.log('tralaala');
                    self.detailTpl = templateUrl;
                    $scope.$broadcast('detailTemplateChanged', self.detail);
                };

                MasterDetailService.setController($scope);

                /**
                 * @method notifyMaster
                 * Calls the {@link ama.services.MasterDetailService#notifyMaster notifyMaster function in MasterDetailService}
                 * @param {*} any Any param the function to be called should receive
                 */
                this.notifyMaster = MasterDetailService.notifyMaster;

                /**
                 * Config object for the drag and drop sort directive
                 * @type {{itemMoved: Function, orderChanged: Function, containerPositioning: string}}
                 */
                this.sort = {
                    accept: function () {
                        return self.filterText == '';
                    },
                    itemMoved: function (event) {
                        console.log('itemMoved');
                    },
                    orderChanged: function(event) {
                        self.notifyMaster('orderChanged');
                    },
                    containerPositioning: 'relative'
                };

                $scope.setFirstAsDetail=function(){
                    var unwatch = $scope.$watch('masterList', function () {
                        if($scope.masterList) {
                            if ($scope.masterList.length > 0) {
                                $scope.setDetail($scope.masterList[0]);
                            }
                        }
                        // make sure this is only executed once
                        unwatch();
                    });
                };

                this.removeItem = function (type, id) {
                    DeleteService(type, id).then(function (data) {
                        $scope.setFirstAsDetail();
                        self.notifyMaster('updateList', data);
                    });
                };


            }],
        controllerAs: 'MasterDetailCtrl'
    }
}]);