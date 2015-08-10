/**
 * @class ama.controllers.ItemPresetsCtrl
 * Controller for the item presets (master) list.
 *
 * Remember: the term 'item' refers to a single piece of a offer/contract/list of todos/acceptance/invoice
 */
app.controller('ItemPresetsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'DeleteService',
    '$filter',
    '$stateParams',
    'MasterDetailService',
    function (ApiAbstractionLayer, LocalStorage, DeleteService, $filter, $stateParams, MasterDetailService) {
        MasterDetailService.setMaster(this);
        var self = this;

        /**
         * The currency to be used. *DEPRECATED.*
         * TODO: get this from config
         * @type {string}
         */
        this.currency = '€';

        /**
         * List of all item presets
         * @type {Array}
         */
        this.presets = LocalStorage.getData('itemPresets');

        /**
         * get the list of item presets and cache it
         */
        var getPresets = function()
        {
            ApiAbstractionLayer('GET', 'item_preset').then(function (data) {
                self.presets = data;
                LocalStorage.setData('itemPresets', data);

                // set the first list entry as detail of none is supplied
                if(!$stateParams.id && data.length > 0){
                    MasterDetailService.notifyController('setDetail',data[0]);
                    $stateParams.id = data[0].id;
                }
            });
        };
        getPresets();


        /**
         * Deletes a preset by given id.
         * @param {int} id - the preset's id
         */
        this.deletePreset = function (id) {
            DeleteService('item_preset', id).then(function (data) {
                self.presets = data;
                LocalStorage.setData('itemPresets', data);
            })
        };

        /**
         * is called when the price has changed
         */
        this.priceChanged = function()
        {
            getPresets();
        };


        this.updateList = function () {
            getPresets();
        };

    }
]);