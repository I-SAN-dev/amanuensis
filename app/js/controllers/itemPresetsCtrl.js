app.controller('ItemPresetsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'DeleteService',
    '$filter',
    function (ApiAbstractionLayer, LocalStorage, DeleteService, $filter) {
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

        this.addPresetFlag = false;
        this.useRateOptions = [
            {
                name: $filter('translate')('items.fixedRate'),
                value: 0
            },
            {
                name: $filter('translate')('items.hourlyRate'),
                value: 1
            },
            {
                name: $filter('translate')('items.dailyRate'),
                value: 2
            }
        ];

        this.addPreset = function () {
            var apiObject = {
                name: 'item_preset',
                data: self.newPreset
            };
            ApiAbstractionLayer('POST', apiObject).then(function (data) {
                self.addPresetFlag = false;
                LocalStorage.setData('itemPreset/'+data.id, data);

                self.presets.push(data);
                LocalStorage.setData('itemPresets', self.presets);

                self.newPreset = null;
            })
        }
    }
]);