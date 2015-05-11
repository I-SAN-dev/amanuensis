app.controller('ItemPresetCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    '$filter',
    '$state',
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, $filter, $state, $stateParams) {
        var self = this;
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
                LocalStorage.setData('itemPreset/'+data.id, data);

                var presetList = LocalStorage.getData('itemPresets') || [];
                presetList.push(data);


                LocalStorage.setData('itemPresets', presetList);

                self.newPreset = null;

                // go to where we came from or to the itemPresets list (and new preset detail) if no referrer is specified
                var to = $stateParams.referrer || 'app.itemPresets';
                var toParams;
                if(to=='app.itemPresets')
                    toParams = {id:data.id};
                else
                    toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
            })
        };
    }
]);