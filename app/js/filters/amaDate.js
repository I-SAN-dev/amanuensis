app.filter('amaDate', ['$filter', function ($filter) {
    return function (input, dateTimeFormat) {
        if(input){
            input = input.replace(/\s/g, "T");
            return $filter('date')(input, dateTimeFormat);
        }
    };
}]);