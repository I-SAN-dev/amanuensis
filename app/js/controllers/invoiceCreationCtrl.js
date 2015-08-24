/**
 * @class ama.controllers.InvoiceCreationCtrl
 * Controller for the invoice creation view.
 */
app.controller('InvoiceCreationCtrl', [
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    'ErrorDialog',
    'GoBackService',
    function (RefnumberService, ItemContainerService, $stateParams, $state, ErrorDialog, GoBackService) {
        var self = this;
        if(!$stateParams.project){
            ErrorDialog({code:'1337',languagestring:'errors.noProjectSpecified'}).activate();
            $state.go('app.dashboard')
        }
        var project = $stateParams.project;
        var projectId = project.id;
        /**
         * The name of the current project (derived from stateParams)
         * @type string
         */
        this.projectName = project.name;

        /**
         * The invoice to be created
         * @type {{refnumber: string, project: integer}}
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
            ItemContainerService.createItemContainer('invoice', projectId, self.newInvoice);
        };

        this.cancel = GoBackService;
    }
]);