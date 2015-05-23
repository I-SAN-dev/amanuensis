app.controller('ItemCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'ItemService',
    '$state',
    '$stateParams',
    '$filter',
    function (ApiAbstractionLayer,LocalStorage, ItemService, $state, $stateParams, $filter) {


        var forType = $stateParams.for;
        var forId = $stateParams.forId;
        var self = this;

        var presets = LocalStorage.getData('itemPresets')|| [];
        this.presetList = [];
        this.projectItems = [];
        var setItemList = function (input, output) {
            for(var i = 0; i < input.length; i++){
                self[output].push({
                    name: input[i].name,
                    value: input[i]
                });
            }
        };
        setItemList(presets, 'presetList');


        ApiAbstractionLayer('GET', 'item_preset').then(function (data) {
            presets = data;
            setItemList(presets, 'presetList');
            LocalStorage.setData('itemPresets', data);
        });


        var availableItems = LocalStorage.getData(forType+'/'+forId+'/availableItems') || [];
        setItemList(availableItems,'projectItems');
        ApiAbstractionLayer('GET', {name:'item_connection', params:{for: forType, forid: forId}}).then(function (data) {
            availableItems = data;
            setItemList(availableItems,'projectItems');
            LocalStorage.setData(forType+'/'+forId+'/availableItems', data);
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

        var updateCachedList = function () {
            var itemList = LocalStorage.getData(forType+'/'+forId);
            itemList.items.push(data);
            LocalStorage.setData(forType+'/'+forId, itemList);
        };

        var goBack = function () {
            // go to where we came from
            var to = $stateParams.referrer || 'app.'+forType+'Detail';
            var toParams = $stateParams.referrerParams || {id:forId};
            $state.go(to,toParams);
        };

        this.createItem = function () {
            if(self.newItem){

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


                    updateCachedList();

                    self.newItem = null;

                    goBack();
                });

            }

        };

        this.importItem = function () {
            if(self.itemFromProject){
                self.itemFromProject[forType] = forId;
                var apiObject = {
                    name: 'item',
                    data: self.itemFromProject
                };
                ApiAbstractionLayer('POST', apiObject).then(function (data) {
                    LocalStorage.setData('item/'+data.id, data);
                    self.itemFromProject = null;

                    updateCachedList();

                    goBack();
                });
            }
        };
    }
]);