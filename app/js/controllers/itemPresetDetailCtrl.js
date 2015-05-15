app.controller('ItemPresetDetailCtrl', [
    'MasterDetailService',
    '$scope',
    function (MasterDetailService, $scope) {
        MasterDetailService.setDetail(this);
        var self = this;
        this.detailChanged = function (preset, keyboard) {
            self.preset = preset;
            if(keyboard) {
                $scope.$apply();
            }
        };
        this.deletePreset = function () {
            MasterDetailService.notifyMaster('deletePreset', self.preset.id);
        }
    }
]);