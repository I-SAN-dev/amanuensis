/**
 * @class ama.controllers.ItemCreationCtrl
 * Controller for the item creation view.
 *
 * Remember: the term 'item' refers to a single piece of a offer/contract/list of todos/acceptance/invoice
 */
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

        /**
         * Array containing all available item presets
         * @type {Array}
         */
        this.presetList = [];
        /**
         * Array containing all items available from the current project.
         * @type {Array}
         */
        this.projectItems = [];
        var setItemList = function (input, output) {
            self[output] = [];
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

        /**
         * Options for the useRate selection list (fixed/hourly/dailyRate)
         * @type {{name: *, value: number}[]}
         */
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

        var updateCachedList = function (newItem) {
            var itemList = LocalStorage.getData(forType+'/'+forId);
            itemList.items.push(newItem);
            LocalStorage.setData(forType+'/'+forId, itemList);
        };

        var goBack = function () {
            // go to where we came from
            var to = $stateParams.referrer || 'app.'+forType+'Detail';
            var toParams = $stateParams.referrerParams || {id:forId};
            $state.go(to,toParams);
        };

        /**
         * Creates a new item
         */
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


                    updateCachedList(data);

                    self.newItem = null;

                    goBack();
                });

            }

        };

        /**
         * Imports a selected item from the current project
         */
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

                    updateCachedList(data);

                    goBack();
                });
            }
        };

        this.cancel = goBack;
    }
]);