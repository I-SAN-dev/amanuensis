/**
 * Controller for the invoices overview page
 */
app.controller('InvoicesCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    function(ApiAbstractionLayer, LocalStorage){
        var self = this;
        this.invoices = LocalStorage.getData('invoices');
        ApiAbstractionLayer('GET','invoice').then(function (data) {
            LocalStorage.setData('invoices', data);
            self.invoices = data;
        });
}]);