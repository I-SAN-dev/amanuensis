/**
 * @class ama.controllers.InvoiceDetailCtrl
 * Controller for the invoice detail view
 */
app.controller('InvoiceDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'MailService',
    'PdfService',
    'DeleteService',
    'ItemService',
    '$stateParams',
    '$scope',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, MailService, PdfService, DeleteService, ItemService, $stateParams, $scope) {

        MasterDetailService.setMaster(this);
        var self = this;

        // (re)set a flag indicating if the Controller was fully loaded
        // needed for setting transition classes
        $scope.$on('$stateChangeStart', function (event, toState) {
            self.loaded = false;
        });
        setTimeout(function () {
            self.loaded = true;
            $scope.$apply();
        }, 1000);

        var id = $stateParams.id;

        /**
         * The invoice.
         * @type Object
         */
        this.invoice = LocalStorage.getData('invoice/'+id);
        var getInvoice = function () {
            ApiAbstractionLayer('GET', {name: 'invoice', params: {id:id}}).then(function (data) {
                self.invoice = data;
                LocalStorage.setData('invoice/'+id, data);
            });
        };
        getInvoice();


        /**
         * Uses the {@link ama.services.MailService MailService} to show a mail preview for the current invoice.
         * @param {Event} event The event (click) that led to the function call
         */
        this.openMailPreview = function (event) {
            event.preventDefault();
            MailService.showPreview('invoice',self.invoice.id);
        };

        /**
         * Uses the {@link ama.services.MailService MailService} to send a mail with the current invoice.
         */
        this.send = function () {
            MailService.send('invoice',self.offer.id);
        };

        /**
         * Deletes an item by given id.
         * @param {id} itemId The id of the item to be deleted
         */
        this.deleteItem = function (itemId) {
            DeleteService('item', itemId).then(function (data) {
                self.invoice.items = data;
                LocalStorage.setData('invoice/'+id, self.invoice);
            });
        };

        /**
         * Gets called when the price of an item inside the invoice changes.
         * Reloads the invoice.
         * @param {Object} item The item that was changed.
         */
        this.priceChanged = function (item) {
            self.loaded = false;
            getInvoice();
        };

        /**
         * Generates a stateParams object from the current stateParams for a certain state
         * @param {string} forState The state for which the stateParams should be generated
         * @returns {{referrer: string, referrerParams: {id: ($stateParams.id|*)}, for: string, forId: ($stateParams.id|*)}} The stateParams for the state to be transitioned to, generated from the current stateParams.
         */
        this.getStateParams = function(forState){
            if(forState == 'itemCreation'){
                return {
                    referrer: 'app.invoiceDetail',
                    referrerParams: {
                        id: id
                    },
                    for: 'invoice',
                    forId: id
                };
            }
        };

        /**
         * Gets called when the ordering of the items in the invoice was changed.
         * Uses {@link ama.services.ItemService#changeOrdering the changeOrdering() function in the ItemService} to apply the new ordering on the server
         * This changes the global_order property of the items.
         */
        this.orderChanged = function () {
            ItemService.changeOrdering(self.invoice.items);
        };

        /**
         * Moves the specified item to another invoice by calling {@link ama.services.ItemService#moveItem the moveItem() function in ItemService}
         * @param {Object} item The item to be moved.
         */
        this.moveItem = function (item) {
            ItemService.moveItem(item, 'invoice', self.invoice.id, self.invoice.project.invoices);
        };
    }
]);