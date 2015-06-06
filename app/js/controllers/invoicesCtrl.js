/**
 * @class ama.controllers.InvoicesCtrl
 * *DEPRECATED:* The corresponding view doesn't exist anymore
 * Controller for the invoices overview page
 * // TODO: Remove this file
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