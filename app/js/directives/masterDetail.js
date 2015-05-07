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
            '$document',
            'MasterDetailService',
            '$filter',
            function ($scope, $state, $stateParams, $document, MasterDetailService, $filter) {
                this.detail = $scope.detail;
                this.masterTpl = $scope.masterTpl;
                this.detailTpl = $scope.detailTpl;
                this.filterText = $stateParams.filter || '';

                var self = this;



                /**
                 * Sets a new detail item and notifies other controllers that the detail has changed
                 * @param detail - the new detail object
                 */
                $scope.setDetail = function(detail){
                    if(MasterDetailService.editMode) {
                        MasterDetailService.notifyEditor('cancel');
                        MasterDetailService.editMode = false;
                    }
                    $stateParams.id = detail.id;
                    self.detail = detail;
                    MasterDetailService.notifyDetail('detailChanged', detail);


                    //$state.go($state.$current.name, {id: detail.id});
                };
                $scope.$on('$stateChangeSuccess', function () {
                    console.log('success;');
                });

                /**
                 * Looks for the next or previous item in the master list
                 * @param offset - specifies how many items to go back or forward in the list
                 * @returns {*} - the reuested neighbor object
                 */
                var getNeighbor = function (offset) {
                    var orderById = {};
                    var list = $filter('filter')($scope.masterList, self.filterText);
                    console.log(list);
                    for(var i= 0; i<list.length;i++) {
                        orderById[list[i].id] = i;
                    }

                    var oldPos;
                    if(self.detail)
                        oldPos = orderById[self.detail.id];
                    else
                        oldPos = -offset;

                    return list[oldPos+offset];
                };




                // navigate to the next or previous item when up or down key is pressed
                $document.unbind('keydown');
                $document.on('keydown', function (event) {
                    var key = event.keyCode;

                    var animation = {
                        duration:500,
                        queue:false
                    };
                    var documentOffset = 40;
                    var newActiveOffset;
                    var scrollArea = $('.scrollArea');

                    var viewportHeight = scrollArea.height();
                    var scrollTop = scrollArea.scrollTop();

                    if (key == 38){
                        event.stopPropagation();
                        event.preventDefault();
                        var prevDetail = getNeighbor(-1);

                        if(prevDetail) {
                            $scope.setDetail(prevDetail);
                            newActiveOffset = $('.list-group-item.active').prev('.list-group-item').position().top;
                            if(newActiveOffset < scrollTop)
                                scrollArea.animate({scrollTop:newActiveOffset-documentOffset}, animation);
                        }
                    }
                    if (key == 40){
                        event.stopPropagation();
                        event.preventDefault();


                        var nextDetail = getNeighbor(1);
                        if (nextDetail) {
                            $scope.setDetail(nextDetail);
                            var newActiveItem = $('.list-group-item.active').next('.list-group-item');
                            console.log(newActiveItem);
                            newActiveOffset = newActiveItem.height() + newActiveItem.position().top;

                            if(newActiveOffset > viewportHeight) {
                                scrollArea.animate({scrollTop: scrollTop + newActiveItem.height()+documentOffset}, animation);
                            }
                        }
                    }
                });

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