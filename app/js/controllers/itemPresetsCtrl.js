app.controller('ItemPresetsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    '$scope',
    function (ApiAbstractionLayer, LocalStorage, $scope) {
        var self = this;
        this.currency = '€'; // TODO: get this from config
        this.presets = LocalStorage.getData('itemPresets');

        ApiAbstractionLayer('GET', 'item_preset').then(function (data) {
            self.presets = data;
            LocalStorage.setData('itemPresets', data);
        })
    }
]);