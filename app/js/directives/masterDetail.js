app.directive('masterDetail', [function(){
    return {
        restrict: 'A',
        scope: {
            masterList: '=',
            masterTpl: '=',
            detail: '=',
            detailTpl: '='
        },
        transclude: true,
        templateUrl: 'templates/directives/masterDetail.html',
        controller: [
            '$scope',
            '$state',
            '$stateParams',
            '$document',
            function ($scope, $state, $stateParams, $document) {
                this.detail = $scope.detail;
                this.masterTpl = $scope.masterTpl;
                this.detailTpl = $scope.detailTpl;
                var self = this;

                $scope.setDetail = function(detail){
                    $stateParams.id = detail.id;
                    self.detail = detail;
                    console.log(self.detail);
                    $scope.$broadcast('detailChanged', detail);
                    $state.transitionTo($state.$current.name, {id: detail.id},{ location: true, inherit: true, relative: $state.$current, notify: false });
                };

                var getNeighbor = function (offset) {
                    var orderById = {};
                    for(var i= 0; i<$scope.masterList.length;i++) {
                        orderById[$scope.masterList[i].id] = i;
                    }

                    var oldPos = orderById[self.detail.id];

                    return $scope.masterList[oldPos+offset];
                };

                $document.unbind('keydown');
                $document.on('keydown', function (event) {
                    var key = event.keyCode;



                    var animation = {
                        duration:500,
                        queue:false
                    };
                    var documentOffset = 70;

                    var viewportHeight = window.innerHeight;
                    var scrollTop = $document.scrollTop();
                    var viewPortBottom = viewportHeight + scrollTop;

                    if (key == 38){
                        event.stopPropagation();
                        event.preventDefault();
                        var prevDetail = getNeighbor(-1);

                        if(prevDetail) {
                            $scope.setDetail(getNeighbor(-1));

                            var newActiveOffset = $('.list-group-item.active').prev('.list-group-item').offset().top;
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
                            var newActiveOffset = newActiveItem.height() + newActiveItem.offset().top;

                            if(newActiveOffset > viewPortBottom) {
                                $('html, body').animate({scrollTop: newActiveOffset-viewportHeight+documentOffset}, animation);
                            }
                        }
                    }
                });

                $scope.setDetailTpl = function(templateUrl) {
                    self.detailTpl = templateUrl;
                    $scope.$broadcast('detailTemplateChanged', self.detail);
                };


            }],
        controllerAs: 'MasterDetailCtrl'
    }
}]);