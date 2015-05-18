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
                    name: '=ipeName',
                    apiName: '=',
                    apiParams: '=',
                    apiId: '=',
                    deletable: '=ipeDeletable',
                    deletableItem: '='
                },
                templateUrl: 'templates/directives/inPlaceEdit.html',
                controller: ['$scope', 'MasterDetailService', function($scope, MasterDetailService){


                    var self = this;


                    this.editMode = false;
                    var backup = null;

                    this.enterEditMode = function () {
                        MasterDetailService.setEditor(this);
                        self.deletable = $scope.deletable;
                        self.deletableItem = $scope.deletableItem;
                        self.type = $scope.type;
                        self.val = $scope.val;
                        self.editMode = MasterDetailService.editMode = true;
                        backup = angular.copy($scope.val);
                    };

                    var post = function() {
                        console.log($scope.val);
                        var apiObject = {
                            name: $scope.apiName,
                            params: $scope.apiParams || {},
                            data: {id:$scope.apiId}
                        };

                        if($scope.apiName == 'settings'){
                            apiObject.data.key = $scope.key;
                            apiObject.data.value = self.val;
                        } else {
                            apiObject.data[$scope.key] = self.val;
                        }


                        ApiAbstractionLayer('POST', apiObject).then(function (data) {
                            self.editMode = false;
                            $scope.val = self.val;
                            backup = null;
                            if($scope.apiId)
                                LocalStorage.setData($scope.apiName+'/'+$scope.apiId, data);
                            if($scope.type == 'price'){
                                MasterDetailService.notifyMaster('priceChanged')
                            }

                        });
                    };

                    this.save = function (newValue) {
                        if(newValue){
                            $scope.val = newValue;
                        }
                        post();
                    };

                    this.cancel = function () {
                        self.editMode = false;
                        self.val = angular.copy(backup);
                        backup = null;
                    };

                    this.deleteItem = function () {
                        if(self.deletable != false) {
                            if(self.deletableItem){
                                DeleteService($scope.apiName, $scope.apiId);
                            } else{
                                self.val = '';
                                post();
                            }
                        }
                        self.editMode = false;

                    };
                    this.buttons = {
                        wrapper: true,
                        wrapperClass: 'bai-buttons',
                        iconOnly: true,
                        save: {
                            class: 'btn btn-link btn-success btn-icon-round',
                            iconClass: 'md md-check',
                            save: self.save
                        },
                        cancel: {
                            class: 'btn btn-link btn-warning btn-icon-round',
                            iconClass: 'md md-close',
                            cancel: self.cancel
                        },
                        delete: {
                            isSet: $scope.deletable,
                            class: 'btn btn-link btn-danger btn-icon-round',
                            iconClass: 'md md-delete',
                            delete: self.deleteItem
                        }
                    }

                }],
                controllerAs: 'ipe'
            };
        }
    ]
);