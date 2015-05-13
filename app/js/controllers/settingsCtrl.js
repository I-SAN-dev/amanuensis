app.controller('SettingsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'constants',
    '$scope',
    function (ApiAbstractionLayer, LocalStorage, constants, $scope) {
        var self = this;
        this.settings = LocalStorage.getData('settings');
        ApiAbstractionLayer('GET', 'settings').then(function (data) {
            self.settings = data;
        });
        this.company = constants.COMPANY;
        this.language = constants.LANGUAGE;




    }
]);