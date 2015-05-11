app.controller('ItemPresetDetailCtrl', [
    'MasterDetailService',
    function (MasterDetailService) {
        MasterDetailService.setDetail(this);
        var self = this;
        this.detailChanged = function (preset) {
            self.preset = preset;
        };
        this.deletePreset = function () {
            MasterDetailService.notifyMaster('deletePreset', self.preset.id);
        }
    }
]);