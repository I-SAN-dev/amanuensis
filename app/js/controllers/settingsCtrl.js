app.controller('SettingsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'constants',
    function (ApiAbstractionLayer, LocalStorage, constants) {
        var self = this;
        this.settings = LocalStorage.getData('settings');
        ApiAbstractionLayer('GET', 'settings').then(function (data) {
            self.settings = data;
        });
        this.company = constants.COMPANY;
        this.language = constants.LANGUAGE;
    }
]);