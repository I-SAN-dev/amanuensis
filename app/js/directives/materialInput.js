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
                optionName: '@inputSelectOptionName'
            },
            link: function (scope, elem, attr) {
                // we use the link function to get our template, so the directive still works when the type is not set on page load
                var type = attr.inputType;
                if(type!='textarea' && type != 'select' && type != 'wysiwyg')
                    type = 'text';
                $http.get('templates/directives/materialInput/'+type+'.html', {cache: $templateCache}).success(function(tplContent){
                    elem.replaceWith($compile(tplContent)(scope));
                    if(type=='wysiwyg') {
                        var editor = $('.summernote');
                        editor.summernote({
                            height: 300
                        });
                        editor.code(scope.model);
                    }
                });
            },
            replace: true
        }
    }
]);