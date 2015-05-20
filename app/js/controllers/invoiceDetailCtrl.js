app.controller('InvoiceDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, $stateParams) {
        var self = this;
        var id = $stateParams.id;
        this.invoice = LocalStorage.getData('invoice/'+id);
        ApiAbstractionLayer('GET', {name: 'invoice', params: {id:id}}).then(function (data) {
            self.invoice = data;
            LocalStorage.setData('invoice/'+id, data);
        });
    }
]);