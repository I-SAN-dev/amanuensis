app.directive('materialInput', [
    '$http',
    '$templateCache',
    '$compile',
    function ($http, $templateCache, $compile) {
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
                searchable: '@inputSelectSearchable'
            },
            controller: function ($scope, $log) {

                $scope.processWysiwyg = function(type) {

                    if(type=='save') {

                        $scope.model = $scope.editor.code();
                        $scope.buttons[type][type]($scope.model);


                    } else {
                        $scope.buttons[type][type]();
                    }
                    console.log($scope.model);


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


                    }
                }

            },
            link: function (scope, elem, attr) {
                // we use the link function to get our template, so the directive still works when the type is not set on page load
                var type = attr.inputType;
                if(type!='textarea' && type != 'select' && type != 'wysiwyg' && type != 'selectMultiple')
                    type = 'text';
                $http.get('templates/directives/materialInput/'+type+'.html', {cache: $templateCache}).success(function(tplContent){
                    elem.replaceWith($compile(tplContent)(scope));
                    if(type=='wysiwyg') {
                        scope.editor = $('.summernote');
                        scope.editor.summernote({
                            height: 300,
                            toolbar: [
                                ['style', ['bold', 'italic', 'underline', 'clear']],
                                ['layout', ['ul', 'ol']],
                                ['view', ['fullscreen','codeview']],
                                ['do', ['undo', 'redo']]
                            ]
                        });
                        scope.editor.code(scope.model);
                    }
                });
            },
            replace: true
        }
    }
]);