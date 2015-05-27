/**
 * The materialInput directive
 * Shows a form field and handles inputs for certain input types
 *
 * @author Christian Baur
 */
app.directive('materialInput', [
    '$http',
    '$templateCache',
    '$compile',
    function ($http, $templateCache, $compile) {
        // these input types are available
        var inputTypes = {
            text: true,
            textarea: true,
            wysiwyg: true,
            select: true,
            selectMultiple: true,
            price: true,
            date: true,
            bool: true
        };
        return {
            restrict: 'A',
            scope: {
                model:'=ngModel',
                id: '@inputId',
                label: '@inputLabel',
                required: '@inputRequired',
                inputType: '@',
                options: '=inputSelectOptions',
                optionValue: '@inputSelectOptionValue',
                optionName: '@inputSelectOptionName',
                buttons: '=inputButtons',
                searchable: '@inputSelectSearchable',
                inputBlur:'=ngBlur'
            },
            controller: function ($scope) {
                $scope.currencySymbol = '€';


                /**
                 * Reacts on button clicks when inputType = wysiwyg
                 * @param type - the type of the button that was clicked (can be one of 'save', 'cancel' or 'delete')
                 */
                $scope.processWysiwyg = function(type) {
                    if (type=='save')
                        $scope.buttons[type][type]($scope.model);
                    else
                        $scope.buttons[type][type]();
                };

                // Select fields
                if($scope.inputType == 'select'){
                    /**
                     * Selects a specified option and closes the dropdown list
                     * @param option
                     */
                    $scope.toggleSingleSelected = function(option){
                        $scope.model = option[$scope.optionValue];
                        $scope.selected = option[$scope.optionName];

                        if($scope.buttons){
                            // if there are buttons, we want to save the selection and blur the field
                            $scope.hideDropdown(true, true);
                        } else
                            $scope.hideDropdown();
                    };
                }

                // Multiselect fields
                if($scope.inputType == 'selectMultiple') {
                    // setup an array for chosen elements
                    $scope.chosen = [];
                    if(!$scope.options){
                        $scope.options = [];
                    }
                    if (angular.isArray($scope.model)) {
                        for(var i = 0; i<$scope.options.length; i++) {
                            for(var j = 0; j<$scope.model.length; j++){
                                if($scope.options[i][$scope.optionValue] == $scope.model[j])
                                    $scope.chosen.push($scope.options[i]);
                            }
                        }
                    } else {
                        $scope.model = [];
                    }
                    /**
                     * Toogles the selection of a specified option
                     * @param option - the (de-)selected option
                     * @param event - the event that led to the (de-)selection
                     */
                    $scope.toggleMultiSelected = function (option, event) {
                        // deselect
                        if (option.selected) {
                            var index = $scope.model.indexOf(option[$scope.optionValue]);
                            $scope.model.splice(index, 1);
                            $scope.chosen.splice(index, 1);
                            option.selected = false;
                            if(event){
                                event.stopPropagation();
                            }

                        }
                        // select
                        else {
                            option.selected = true;
                            $scope.model.push(option[$scope.optionValue]);
                            $scope.chosen.push(option);
                        }


                    };

                }

                // price fields
                if($scope.inputType == 'price'){
                    // build an array (length=2) as model for our price inputs
                    // array[0] will be the 'euros' value of the price
                    // array[1] will be the 'cents' value of the price
                    if($scope.model)
                        $scope.priceModel = $scope.model.split('.');
                    else
                        $scope.priceModel = new Array(2);
                    /**
                     * Parses the actual price (as String) from the priceModel array
                     */
                    $scope.processPrice = function () {
                        var value = $scope.priceModel;
                        if(!value[1]){
                            value[1] = '00';
                        }
                        if(!value[0]){
                            value[0] = null;
                            return;
                        }
                        $scope.model = value[0]+'.'+value[1];
                    }
                }

                /**
                 * Chooses the action to be taken on blur.
                 * If one of the buttons is clicked, the button action replaces the default blur action.
                 * TODO: this code should not be not used anymore. check if we can remove it entirely
                 * @param event
                 * @param fieldId
                 */
                $scope.blurField = function (event, fieldId) {
                    var field = fieldId || $(event.currentTarget).attr('id');

                    var flag = true;
                    event.preventDefault();
                    event.stopPropagation();

                    var button = $(event.relatedTarget).attr('id');
                    if('save-'+field == button)
                    {

                        $scope.buttons.save.save($scope.model);
                        flag = false;

                    }

                    if('delete-'+field == button) {
                        $scope.buttons.delete.delete();
                        flag = false;
                    }

                    if('cancel-'+field == button) {
                        $scope.buttons.cancel.cancel();
                        flag = false;
                    }

                    //console.log(event);
                    if(flag && $scope.inputBlur)
                        $scope.inputBlur();
                };

                // date fields
                if($scope.inputType == 'date'){
                    // backup the initial date value
                    var initialDate = angular.copy($scope.model);

                    /**
                     * updates the backup
                     */
                    $scope.processDate = function () {
                        if(initialDate != $scope.model) {
                            $scope.selectDate = false;
                            initialDate = angular.copy($scope.model);
                        }
                    }
                }

                // bool fields
                if($scope.inputType == 'bool'){
                    /**
                     * toggles true/false for the bool model
                     * if buttons are present, calls the save action
                     */
                    $scope.toggleBool = function () {
                        $scope.model = !$scope.model;
                        if($scope.buttons){
                            $scope.buttons.save.save();
                        }
                    }
                }
            },
            link: function (scope, elem, attr) {
                // we use the link function to get our template, so the directive still works when the type is not set on page load
                var type = attr.inputType;
                if(!inputTypes[type]) {
                    // if the type is not specified, show a text input
                    type = 'text';
                }
                $http.get('templates/directives/materialInput/'+type+'.html', {cache: $templateCache}).success(function(tplContent){
                    var element = $compile(tplContent)(scope);
                    elem.replaceWith(element);

                    // autofocus the created input field if autofocus attribute is present
                    if(attr.inputAutofocus){
                        var input = element.find('.form-control').first();
                        input.focus();
                    }

                    // wysiwyg fields
                    if(type=='wysiwyg') {
                        scope.editors = element;
                        // build the summernote editor on our element
                        $(element[0]).summernote({
                            height: 300,
                            toolbar: [
                                ['style', ['bold', 'italic', 'underline', 'clear']],
                                ['layout', ['ul', 'ol']],
                                ['view', ['fullscreen','codeview']],
                                ['do', ['undo', 'redo']]
                            ],
                            onInit: function () {
                                element.code(scope.model);
                            },
                            onBlur: function(e) {
                                scope.model = element.code();
                            }
                        });
                        scope.editors.code(scope.model);
                    }



                    // select and multiselect fields
                    scope.showDropdown = false;

                    /**
                     * hides the dropdown list
                     * @param blur - indicates if the field should be blurred
                     * @param save - indicates if the save action should be triggered
                     */
                    scope.hideDropdown = function (blur, save) {
                        if(save && scope.buttons)
                            scope.buttons.save.save(scope.model);

                        if(blur) {
                            $(element[0]).blur();
                        }
                        else
                            scope.showDropdown = false;
                    };

                    /**
                     * Opens the dropdown list
                     */
                    scope.openDropdown = function () {
                        $(element[0]).focus();
                        scope.showDropdown = true;
                    };

                    // instantly open ipe select fields
                    if(attr.ipe && type == 'select'){
                        scope.openDropdown();
                    }

                    // multiselect fields
                    if(type=="selectMultiple"){

                        var toggle = $(element).find('.multiselect-container');

                        // close the dropdown when the document is clicked
                        scope.$on("documentClicked", function(event,target) {
                            if (!$(target[0]).is(toggle) && !$(target[0]).parents(toggle.selector).length > 0) {
                                scope.$apply(function () {
                                    scope.showDropdown = false;
                                });
                            }
                        });
                    }
                });
            },
            replace: true
        }
    }
]);