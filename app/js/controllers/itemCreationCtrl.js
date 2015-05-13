app.controller('ItemCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'ItemService',
    '$state',
    '$stateParams',
    '$filter',
    function (ApiAbstractionLayer,LocalStorage, ItemService, $state, $stateParams, $filter) {



        var self = this;

        var presets = LocalStorage.getData('itemPresets')|| [];
        this.presetList = [];
        var setPresetList = function () {
            for(var i = 0; i < presets.length; i++){
                self.presetList.push({
                    name: presets[i].name,
                    value: presets[i]
                });
            }
        };
        setPresetList();


        ApiAbstractionLayer('GET', 'item_preset').then(function (data) {
            presets = data;
            setPresetList();
            LocalStorage.setData('itemPresets', data);
        });

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

        this.createItem = function () {
            var forType = $stateParams.for;
            var forId = $stateParams.forId;
            self.newItem.id = null;
            self.newItem[forType] = forId;
            var apiObject = {
                name: 'item',
                data: self.newItem,
                params: {
                    for: forType,
                    forid: forId
                }
            };
            ApiAbstractionLayer('POST', apiObject).then(function (data) {
                LocalStorage.setData('item/'+data.id, data);


                var itemList = LocalStorage.getData(forType+'/'+forId);
                itemList.items.push(data);


                LocalStorage.setData(forType+'/'+forId, itemList);

                self.newItem = null;

                // go to where we came from
                var to = $stateParams.referrer;
                var toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
            });
        }
    }
]);