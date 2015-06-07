/**
 * @class ama.filters.amaDate
 *
 * # The amaDate filter
 * Converts a given datetime string to a desired format.
 * Internally uses the standard AngularJS date filter but also supports the MySQL date format.
 * ## Usage
 * HTML:
 *
 *     {{dateString|amaDate:'dd.MM.yyyy HH:mm'}}
 *
 * JavaScript:
 *
 *     $filter('amaDate')(dateString, 'dd.MM.yyyy HH:mm')
 *
 * 'dd.MM.yyyy' from the example above can be replaced by any desired datetime format
 *
 *
 */
app.filter('amaDate', ['$filter', function ($filter) {
    return function (input, dateTimeFormat) {
        if(input){
            input = input.replace(/\s/g, "T");
            return $filter('date')(input, dateTimeFormat);
        }
    };
}]);