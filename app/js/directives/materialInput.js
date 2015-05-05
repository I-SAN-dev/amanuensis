app.directive('materialInput', [function () {
    return {
        restrict: 'A',
        templateUrl: function(elem, attr){
            var type = attr.inputType;
            if(type=='textarea')
                return 'templates/directives/materialInput/textarea.html';
            if(type=="select")
                return 'templates/directives/materialInput/select.html';
            return 'templates/directives/materialInput/text.html';
        },
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
        replace: true
    }
}]);