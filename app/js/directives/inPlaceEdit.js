app.directive('inPlaceEdit',
    ['ApiAbstractionLayer',
        'LocalStorage',
        function (ApiAbstractionLayer, LocalStorage) {
            return {
                restrict: 'A',
                scope: {
                    key: '=ipeKey',
                    val: '=ipeValue',
                    type: '=ipeType',
                    options: '=ipeOptions',
                    apiName: '=',
                    apiParams: '=',
                    apiId: '='
                },
                templateUrl: 'templates/directives/inPlaceEdit.html',
                controller: function($scope){

                    var self = this;

                    this.editMode = false;
                    var backup = null;

                    this.enterEditMode = function () {
                        self.type = $scope.type;
                        self.val = $scope.val;
                        self.editMode = true;
                        backup = angular.copy($scope.val);
                    };

                    this.save = function() {
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

                    this.cancel = function () {
                        self.editMode = false;
                        self.val = angular.copy(backup);
                        backup = null;
                    };
                },
                controllerAs: 'ipe'
            }
        }
    ]
);