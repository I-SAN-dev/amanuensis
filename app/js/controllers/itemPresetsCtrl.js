app.controller('ItemPresetsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'DeleteService',
    function (ApiAbstractionLayer, LocalStorage, DeleteService) {
        var self = this;
        this.currency = '€'; // TODO: get this from config
        this.presets = LocalStorage.getData('itemPresets');

        ApiAbstractionLayer('GET', 'item_preset').then(function (data) {
            self.presets = data;
            LocalStorage.setData('itemPresets', data);
        });

        this.deletePreset = function (id) {
            DeleteService('item_preset', id).then(function (data) {
                self.presets = data;
                LocalStorage.setData('itemPresets', data);
            })
        };
    }
]);