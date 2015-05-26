app.controller('ItemPresetDetailCtrl', [
    'ApiAbstractionLayer',
    'MasterDetailService',
    '$stateParams',
    function (ApiAbstractionLayer, MasterDetailService, $stateParams) {
        MasterDetailService.setDetail(this);
        var self = this;

        /**
         * Sets the preset detail. This function gets called by the masterDetail directive when the detail changes
         * @param preset - the new preset
         * @param keyboard - indicates if the detail was changed by keyboard input
         */
        this.detailChanged = function (preset, keyboard) {
            // the preset from the list is equivalent to what we would get from the API, so we don't need a request here
            self.preset = preset;
        };

        /**
         * Deletes the current preset by calling the delete action in the master controller
         */
        this.deletePreset = function () {
            MasterDetailService.notifyMaster('deletePreset', self.preset.id);
        };

        // if the itemPreset state is entered with a certain id, we want to set the preset detail for this id
        if($stateParams.id){
            // this time, a request is needed to get the item preset
            ApiAbstractionLayer('GET',{name:'item_preset',params:{id:$stateParams.id}}).then(function (data) {
                MasterDetailService.notifyController('setDetail',data);
            });
        }

    }
]);