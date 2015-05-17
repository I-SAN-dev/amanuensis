app.controller('ItemDetailCtrl', [
    'ApiAbstractionLayer',
    'MasterDetailService',
    '$scope',
    function (ApiAbstractionLayer, MasterDetailService, $scope) {
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
        this.changeUseRate = function () {
            var apiObject = {
                name: 'item',
                data: {
                    id: self.item.id,
                    userate: self.item.userate
                }
            };
            ApiAbstractionLayer('POST', apiObject).then(function (data) {
                MasterDetailService.notifyMaster('priceChanged', data);
            });
        };
    }
]);