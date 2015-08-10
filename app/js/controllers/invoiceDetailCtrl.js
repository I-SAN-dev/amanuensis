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
    'StateManager',
    '$state',
    '$stateParams',
    '$scope',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, MailService, PdfService, DeleteService, ItemService, StateManager, $state, $stateParams, $scope) {

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
         * Uses the {@link ama.services.PdfService PdfService} to show either a PDF preview
         * or the generated PDF of the invoice.
         * @param {Event} event The event (commonly 'click') that triggered the function call
         * @param {bool} preview Indicates if a preview or the generated PDF should be shown
         * @param {String} [path] *optional* Path to the generated PDF
         */
        this.viewPdf = function (event, preview, path) {
            PdfService(event,preview,'invoice',id, path).then(function (data) {
                if(data){
                    self.invoice.path = data.path;
                    self.invoice.state = 1;
                    LocalStorage.setData('invoice/'+id, self.invoice);
                }
            });
        };

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
            MailService.send('invoice',self.invoice.id).then(function (data) {
                self.invoice.state = 2;
                LocalStorage.setData('invoice/'+id, self.invoice);
            });
        };

        /**
         * Deletes an item by given id.
         * @param {id} itemId The id of the item to be deleted
         */
        this.deleteItem = function (itemId) {
            DeleteService('item', {id:itemId, for: 'invoice', forid: self.invoice.id}).then(function (data) {
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


        /**
         * Changes the state of the invoice.
         * @param {integer|String} state The state to be set.
         */
        this.changeState = function (state) {
            StateManager.setState('invoice',id,state).then(function(data){
                self.invoice = data;
            });
        };

        /**
         * Removes a given item from the document
         * @param {Object} item The item to be removed
         */
        this.removeItemFromDocument = function(item)
        {
            ItemService.removeItemFromDocument(item, 'invoice');
            getInvoice();
        };

        /**
         * Deletes the current invoice via {@link ama.services.DeleteService DeleteService}
         */
        this.deleteInvoice = function () {
            DeleteService('invoice', id).then(function () {
                $state.go('app.projectDetail', {id: self.invoice.project.id});
            });
        };

        this.itemListChanged = function (items) {
            if(items)
                self.invoice.items = items;
            else
                getInvoice();
        }
    }
]);