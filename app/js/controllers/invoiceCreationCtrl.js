app.controller('InvoiceCreationCtrl', [
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    function (RefnumberService, ItemContainerService, $stateParams, $state) {
        var self = this;
        var project = $stateParams.project;
        var projectId = project.id;
        this.projectName = project.name;
        this.newInvoice = {
            refnumber: '',
            project: projectId
        };


        RefnumberService('invoices', projectId).then(function (data) {
            if(self.newInvoice.refnumber === ''){
                self.newInvoice.refnumber = data.refnumber;
            }
        });
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