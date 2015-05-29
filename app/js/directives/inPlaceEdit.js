/**
 * The inPlaceEdit directive
 * Shows the value of a specified property or a placeholder if the property is not defined.
 * When clicked on that element, it changes to a input field of a specified type and typically some buttons aside of them.
 * The directive also handles attempts to save/cancel the edit or delete the property
 *
 * @author Christian Baur
 */
app.directive('inPlaceEdit',
    [
        'ApiAbstractionLayer',
        'LocalStorage',
        'DeleteService',
        function (ApiAbstractionLayer, LocalStorage, DeleteService) {
            return {
                restrict: 'A',
                scope: {
                    key: '=ipeKey',
                    val: '=ipeValue',
                    type: '=ipeType',
                    options: '=ipeSelectOptions',
                    optionValue: '@ipeSelectOptionValue',
                    optionName: '@ipeSelectOptionName',
                    name: '=ipeName',
                    apiName: '=',
                    apiParams: '=',
                    apiId: '=',
                    deletable: '=ipeDeletable',
                    deletableItem: '=',
                    outputVal: '=outputValue'
                },
                templateUrl: 'templates/directives/inPlaceEdit.html',
                controller: ['$scope', 'MasterDetailService', function($scope, MasterDetailService){
                    var self = this;

                    // initially, the edit mode is turned off
                    this.editMode = false;

                    var backup = null;

                    /**
                     * Turns on the edit mode for the inPlaceEdit
                     */
                    this.enterEditMode = function () {
                        // in a master detail view, the MasterDetailService has to be notified
                        MasterDetailService.setEditor(self);

                        // set the needed properties
                        self.deletable = $scope.deletable;
                        self.deletableItem = $scope.deletableItem;
                        self.type = $scope.type;
                        self.val = $scope.val;
                        self.editMode = MasterDetailService.editMode(true);

                        // create a backup
                        backup = angular.copy($scope.val);
                    };

                    // inputs of type bool are always in editMode
                    if($scope.type=='bool'){
                        self.enterEditMode();
                    }

                    /**
                     * Posts the set properties to the API
                     */
                    var post = function() {
                        // set up the object to be posted
                        var apiObject = {
                            name: $scope.apiName,
                            params: $scope.apiParams || {},
                            data: {id:$scope.apiId}
                        };

                        // the settings API is different to the others
                        // therefore we have to modify our object a little bit
                        if($scope.apiName == 'settings'){
                            apiObject.data.key = $scope.key;
                            apiObject.data.value = self.val;
                        } else {
                            // for other APIs we can directly set the important value
                            apiObject.data[$scope.key] = self.val;
                        }


                        // perform a POST request
                        ApiAbstractionLayer('POST', apiObject).then(function (data) {
                            // on success we leave the editMode (it not type == 'bool')
                            self.editMode = $scope.type == 'bool';

                            // update $scope.val & reset backup
                            $scope.val = self.val;
                            backup = null;

                            // update the localStorage
                            if($scope.apiId)
                                LocalStorage.setData($scope.apiName+'/'+$scope.apiId, data);

                            // changing price inputs sometimes affects parent objects
                            if($scope.type == 'price'){
                                MasterDetailService.notifyMaster('priceChanged')
                            }

                        });
                    };

                    /**
                     * Saves the value
                     * @param newValue - in some cases the binding doesn't work directly, so the new value has to be set manually
                     */
                    this.save = function (newValue) {
                        // if a newValue is given, use that one
                        if(newValue !== undefined){
                            self.val = newValue;
                        }
                        // Post to the API
                        post();
                    };

                    /**
                     * Cancels the editing
                     */
                    this.cancel = function () {
                        self.editMode = false;
                        self.val = angular.copy(backup);
                        backup = null;
                    };

                    /**
                     * Deletes the property or sets it to an empty string (if deletion is not allowed)
                     */
                    this.deleteItem = function () {
                        if(self.deletable != false) {
                            if(self.deletableItem){
                                DeleteService($scope.apiName, $scope.apiId).then(function (data) {
                                    self.deletableItem(data);
                                });
                            } else{
                                self.val = '';
                                $scope.outputVal = '';
                                post();
                            }
                        }
                        self.editMode = false;
                    };

                    // define buttons to show aside of the input field
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