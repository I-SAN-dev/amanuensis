app.controller('SettingsCtrl', [
    'constants',
    function (constants) {
        this.company = constants.COMPANY;
        this.language = constants.LANGUAGE;
    }
]);