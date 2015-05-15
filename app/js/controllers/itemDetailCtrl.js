app.controller('ItemDetailCtrl', [
    'MasterDetailService',
    '$scope',
    function (MasterDetailService, $scope) {
        MasterDetailService.setDetail(this);
        var self = this;
        this.detailChanged = function (item, keyboard) {
            self.item = item;
            if(keyboard) {
                $scope.$apply();
            }
        };
        this.deleteItem = function () {
            MasterDetailService.notifyMaster('deleteItem', self.item.id);
        };
    }
]);