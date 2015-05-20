app.directive('materialInput', [
    '$http',
    '$templateCache',
    '$compile',
    '$timeout',
    function ($http, $templateCache, $compile, $timeout) {
        var inputTypes = {
            text: true,
            textarea: true,
            wysiwyg: true,
            select: true,
            selectMultiple: true,
            price: true,
            date: true
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
            controller: function ($scope, $log) {
                $scope.currencySymbol = '€';


                $scope.processWysiwyg = function(type) {

                    if (type=='save')
                        $scope.buttons[type][type]($scope.model);
                    else
                        $scope.buttons[type][type]();
                };

                if($scope.inputType == 'select'){
                    $scope.toggleSingleSelected = function(option){
                        $scope.model = option[$scope.optionValue];
                        $scope.selected = option[$scope.optionName];
                        $scope.showDropdown = false;
                    };
                }

                if($scope.inputType == 'selectMultiple') {

                    $scope.chosen = [];
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
                    $scope.toggleMultiSelected = function (option) {
                        if (option.selected) {
                            var index = $scope.model.indexOf(option[$scope.optionValue]);
                            $scope.model.splice(index, 1);
                            $scope.chosen.splice(index, 1);
                            option.selected = false;
                        } else {
                            option.selected = true;
                            $scope.model.push(option[$scope.optionValue]);
                            $scope.chosen.push(option);
                        }


                    };

                }


                if($scope.inputType == 'price'){

                    if($scope.model)
                        $scope.priceModel = $scope.model.split('.');
                    else
                        $scope.priceModel = new Array(2);
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

                /*
                 * Chooses the action to be taken on blur.
                 * If one of the buttons is clicked, the button action replaces the default blur action.
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


                if($scope.inputType == 'date'){
                    var initialDate = angular.copy($scope.model);
                    $scope.processDate = function () {
                        if(initialDate != $scope.model) {
                            $scope.selectDate = false;
                            initialDate = angular.copy($scope.model);
                        }
                    }
                }





            },
            link: function (scope, elem, attr) {
                // we use the link function to get our template, so the directive still works when the type is not set on page load
                var type = attr.inputType;
                if(!inputTypes[type]) {
                    type = 'text';
                }
                $http.get('templates/directives/materialInput/'+type+'.html', {cache: $templateCache}).success(function(tplContent){
                    var element = $compile(tplContent)(scope);
                    elem.replaceWith(element);

                    if(attr.inputAutofocus){
                        var input = element.find('.form-control').first();
                        console.log(element);
                        input.focus();
                    }

                    if(type=='wysiwyg') {
                        scope.editors = element;
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
                });

                scope.showDropdown = false;
                scope.hideDropdown = function () {
                    scope.showDropdown = false;
                };
                scope.openDropdown = function () {
                    $(elem).focus();
                    scope.showDropdown = true;
                };



            },
            replace: true
        }
    }
]);