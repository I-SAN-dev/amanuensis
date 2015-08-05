/**
 * @class ama.controllers.ItemPresetCreationCtrl
 * Controller for the item preset creation view.
 *
 * Remember: the term 'item' refers to a single piece of a offer/contract/list of todos/acceptance/invoice
 */
app.controller('ItemPresetCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    '$filter',
    '$state',
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, $filter, $state, $stateParams) {
        var self = this;

        /**
         * List of options for the useRate selection field.
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

        var goBack = function () {
            var to = $stateParams.referrer || 'app.itemPresets.detail';
            var toParams;
            if(to=='app.itemPresets.detail')
                toParams = {id:data.id};
            else
                toParams = $stateParams.referrerParams;
            $state.go(to,toParams);
        };

        /**
         * Creates an item preset
         */
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
                goBack();
            })
        };

        this.cancel = goBack;
    }
]);