app.controller('InvoiceDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'MailService',
    'PdfService',
    'DeleteService',
    '$stateParams',
    '$scope',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, MailService, PdfService, DeleteService, $stateParams, $scope) {

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
        this.invoice = LocalStorage.getData('invoice/'+id);
        var getInvoice = function () {
            ApiAbstractionLayer('GET', {name: 'invoice', params: {id:id}}).then(function (data) {
                self.invoice = data;
                LocalStorage.setData('invoice/'+id, data);
            });
        };
        getInvoice();


        this.generatePDF = function (preview) {
            PdfService(preview, 'invoice', id).then(function (data) {
                if(preview){

                } else {
                    self.offer.path = data.path;
                    LocalStorage.setData('invoice/'+id, self.invoice);
                }
            });
        };

        this.openPdfPreview = function (event) {
            event.preventDefault();
            window.open(
                constants.BASEURL+'/api?action=pdfgen&for=invoice&forid='+self.invoice.id,
                '',
                'height=500,width=900'
            );
        };

        this.openPdf = function (event) {
            event.preventDefault();
            window.open(
                constants.BASEURL+'/api?action=protectedpdf&path='+self.invoice.path,
                '',
                'height=500,width=900'
            );
        };

        this.openMailPreview = function (event) {
            event.preventDefault();
            MailService.showPreview('invoice',self.invoice.id);
        };

        this.send = function () {
            MailService.send('invoice',self.offer.id);
        };

        this.deleteItem = function (itemId) {
            DeleteService('item', itemId).then(function (data) {
                self.invoice.items = data;
                LocalStorage.setData('invoice/'+id, self.invoice);
            });
        };

        this.priceChanged = function (item) {
            self.loaded = false;
            getInvoice();
        };

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
    }
]);