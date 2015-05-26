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
        this.currency = '€'; // TODO: get this from config
        this.presets = LocalStorage.getData('itemPresets');

        // get the list of item presets and cache it
        ApiAbstractionLayer('GET', 'item_preset').then(function (data) {
            self.presets = data;
            LocalStorage.setData('itemPresets', data);

            // set the first list entry as detail of none is supplied
            if(!$stateParams.id && data.length > 0){
                MasterDetailService.notifyController('setDetail',data[0]);
                $stateParams.id = data[0].id;
            }
        });

        /**
         * Deletes a preset by given id.
         * @param id - the preset's id
         */
        this.deletePreset = function (id) {
            DeleteService('item_preset', id).then(function (data) {
                self.presets = data;
                LocalStorage.setData('itemPresets', data);
            })
        };


    }
]);