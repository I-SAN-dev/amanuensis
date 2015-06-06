/**
 * @class ama.controllers.InvoiceCreationCtrl
 * Controller for the invoice creation view.
 */
app.controller('InvoiceCreationCtrl', [
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    function (RefnumberService, ItemContainerService, $stateParams, $state) {
        var self = this;
        var project = $stateParams.project;
        var projectId = project.id;
        /**
         * The name of the current project (derived from stateParams)
         * @type string
         */
        this.projectName = project.name;

        /**
         * The invoice to be created
         * @type {{refnumber: string, project: int}}
         */
        this.newInvoice = {
            refnumber: '',
            project: projectId
        };

        RefnumberService('invoices', projectId).then(function (data) {
            if(self.newInvoice.refnumber === ''){
                self.newInvoice.refnumber = data.refnumber;
            }
        });

        /**
         * Creates a new invoice in the current project
         */
        this.createInvoice = function () {
            ItemContainerService.createItemContainer('invoice', projectId, self.newInvoice).then(function (data) {
                // go to where we came from
                var to = $stateParams.referrer;
                var toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
            });
        };
    }
]);