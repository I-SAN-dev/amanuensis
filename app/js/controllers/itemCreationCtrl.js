app.controller('ItemCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'ItemService',
    '$state',
    '$stateParams',
    '$filter',
    function (ApiAbstractionLayer,LocalStorage, ItemService, $state, $stateParams, $filter) {



        var self = this;

        this.presets = LocalStorage.getData('itemPresets')|| [];
        ApiAbstractionLayer('GET', 'item_preset').then(function (data) {
            self.presets = data;
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