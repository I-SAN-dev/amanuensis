app.directive('inPlaceEdit',
    ['ApiAbstractionLayer',
        'LocalStorage',
        function (ApiAbstractionLayer, LocalStorage) {
            return {
                restrict: 'A',
                scope: {
                    key: '=ipeKey',
                    value: '=ipeValue',
                    type: '=ipeType',
                    options: '=ipeOptions',
                    apiName: '=',
                    apiParams: '='
                },
                templateUrl: 'templates/directives/inPlaceEdit.html',
                controller: function($scope){
                    var self = this;
                    $scope.editMode = false;
                    var backup = null;

                    $scope.enterEditMode = function () {
                        self.editMode = true;
                        backup = angular.copy($scope.value);
                    };

                    $scope.save = function() {
                        var apiObject = {
                            name: $scope.apiName,
                            params: $scope.params || {},
                            data: {}
                        };
                        apiObject.data[$scope.key] = $scope.value;
                        ApiAbstractionLayer('POST', apiObject).then(function () {
                            self.editMode = false;
                            backup = null;
                        });
                    };

                    $scope.cancel = function () {
                        self.editMode = false;
                        $scope.value = angular.copy(backup);
                        backup = null;
                    }
                }
            }
        }
    ]
);