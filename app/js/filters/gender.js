app.filter('gender', function ($filter) {
    var genders = {
        m: "clients.contactGender.male",
        f: "clients.contactGender.female"
    };
    return function (input) {
        console.log('gender');
        return $filter('translate')(genders[input]);
    }
});