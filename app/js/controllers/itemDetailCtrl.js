app.controller('ItemDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService) {
        MasterDetailService.setDetail(this);
        var self = this;
        this.detailChanged = function (item) {
            self.item = item;
        };
        this.deleteItem = function () {
            MasterDetailService.notifyMaster('deleteItem', self.item.id);
        };
    }
]);