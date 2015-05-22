app.filter('amaDate', ['$filter', function ($filter) {
    return function (input, dateTimeFormat) {
        if(input)
            return $filter('date')(new Date(input).toISOString(), dateTimeFormat);
    };
}]);