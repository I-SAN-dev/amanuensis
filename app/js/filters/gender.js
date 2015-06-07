/**
 * @class ama.filters.gender
 * # The gender filter
 * Converts a gender code ('f' for female, 'm' for male) to a language string.
 *
 * ## Usage
 * HTML:
 *
 *     {{genderCode|gender}}
 *
 * JavaScript:
 *
 *     $filter('gender')(genderCode)
 *
 * genderCode can be one of: 'f', 'm'
 */
app.filter('gender', function ($filter) {
    var genders = {
        m: "clients.contactGender.male",
        f: "clients.contactGender.female"
    };
    return function (input) {
        return $filter('translate')(genders[input]);
    }
});