app.directive('inPlaceEdit',
    ['ApiAbstractionLayer',
        'LocalStorage',
        'DeleteService',
        function (ApiAbstractionLayer, LocalStorage, DeleteService) {
            return {
                restrict: 'A',
                scope: {
                    key: '=ipeKey',
                    val: '=ipeValue',
                    type: '=ipeType',
                    options: '=ipeOptions',
                    apiName: '=',
                    apiParams: '=',
                    apiId: '=',
                    deletable: '=',
                    deletableItem: '='
                },
                templateUrl: 'templates/directives/inPlaceEdit.html',
                controller: function($scope){

                    var self = this;

                    this.editMode = false;
                    var backup = null;

                    this.enterEditMode = function () {
                        self.deletable = $scope.deletable || true;
                        self.deletableItem = $scope.deletableItem;
                        self.type = $scope.type;
                        self.val = $scope.val;
                        self.editMode = true;
                        backup = angular.copy($scope.val);
                    };

                    var post = function() {
                        var apiObject = {
                            name: $scope.apiName,
                            params: $scope.apiParams || {},
                            data: {id:$scope.apiId}
                        };

                        apiObject.data[$scope.key] = self.val;

                        ApiAbstractionLayer('POST', apiObject).then(function (data) {
                            self.editMode = false;
                            backup = null;
                            LocalStorage.setData($scope.apiName+'/'+$scope.apiId, data);
                        });
                    };

                    this.save = function () {
                        post();
                    };

                    this.cancel = function () {
                        self.editMode = false;
                        self.val = angular.copy(backup);
                        backup = null;
                    };

                    this.deleteItem = function () {
                        if(self.deletable) {
                            if(self.deletableItem){
                                DeleteService($scope.apiName, $scope.apiId);
                            } else{
                                self.val = '';
                                post();
                            }
                        }

                    }
                },
                controllerAs: 'ipe'
            };
        }
    ]
);