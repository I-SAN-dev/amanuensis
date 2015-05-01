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
            function ($scope, $state, $stateParams, $document, MasterDetailService) {
                this.detail = $scope.detail;
                this.masterTpl = $scope.masterTpl;
                this.detailTpl = $scope.detailTpl;
                this.filterText = $stateParams.filter || '';

                var self = this;

                MasterDetailService.setMasterDetail(this);
                console.log(this);

                /**
                 * Sets a new detail item and notifies other controllers that the detail has changed
                 * @param detail - the new detail object
                 */
                $scope.setDetail = function(detail){
                    $stateParams.id = detail.id;
                    self.detail = detail;
                    $scope.$broadcast('detailChanged', detail);
                    $state.transitionTo($state.$current.name, {id: detail.id},{ location: true, inherit: true, relative: $state.$current, notify: false });
                };

                /**
                 * Looks for the next or previous item in the master list
                 * @param offset - specifies how many items to go back or forward in the list
                 * @returns {*} - the reuested neighbor object
                 */
                var getNeighbor = function (offset) {
                    var orderById = {};
                    for(var i= 0; i<$scope.masterList.length;i++) {
                        orderById[$scope.masterList[i].id] = i;
                    }

                    var oldPos = orderById[self.detail.id];

                    return $scope.masterList[oldPos+offset];
                };

                // navigate to the next or previous item when up or down key is pressed
                $document.unbind('keydown');
                $document.on('keydown', function (event) {
                    var key = event.keyCode;

                    var animation = {
                        duration:500,
                        queue:false
                    };
                    var documentOffset = 110;
                    var newActiveOffset;

                    var viewportHeight = window.innerHeight;
                    var scrollTop = $document.scrollTop();
                    var viewPortBottom = viewportHeight + scrollTop;

                    if (key == 38){
                        event.stopPropagation();
                        event.preventDefault();
                        var prevDetail = getNeighbor(-1);

                        if(prevDetail) {
                            $scope.setDetail(getNeighbor(-1));

                            newActiveOffset = $('.list-group-item.active').prev('.list-group-item').offset().top;
                            if(newActiveOffset < scrollTop)
                                $('html, body').animate({scrollTop:newActiveOffset-documentOffset}, animation);
                        }
                    }
                    if (key == 40){
                        event.stopPropagation();
                        event.preventDefault();
                        var nextDetail = getNeighbor(1);
                        if (nextDetail) {
                            $scope.setDetail(getNeighbor(1));


                            var newActiveItem = $('.list-group-item.active').next('.list-group-item');
                            newActiveOffset = newActiveItem.height() + newActiveItem.offset().top;

                            if(newActiveOffset > viewPortBottom) {
                                $('html, body').animate({scrollTop: newActiveOffset-viewportHeight+documentOffset}, animation);
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