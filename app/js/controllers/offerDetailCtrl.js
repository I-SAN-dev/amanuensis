app.controller('OfferDetailCtrl', [
        'ApiAbstractionLayer',
        'LocalStorage',
        'MasterDetailService',
        'DeleteService',
        'PdfService',
        'MailService',
        'StateManager',
        '$stateParams',
        '$scope',
        'constants',
        function (ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, PdfService, MailService, StateManager, $stateParams, $scope, constants) {
            var id = $stateParams.id;
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


            // TODO: load dateFormat from Config
            this.dateFormat = 'dd.MM.yyyy';

            this.offer = LocalStorage.getData('offer/'+id);
            var getOffer = function () {
                ApiAbstractionLayer('GET',{name: 'offer', params: {id: id}}).then(function (data) {
                    self.offer = data;
                    LocalStorage.setData('offer/'+id, data);

                    self.loaded = true;
                });
            };

            getOffer();


            this.generatePDF = function (preview) {
                PdfService(preview, 'offer', id).then(function (data) {
                    if(preview){

                    } else {
                        self.offer.path = data.path;
                        LocalStorage.setData('offer/'+id, self.offer);
                    }
                });
            };

            this.openPdfPreview = function (event) {
                event.preventDefault();
                window.open(
                    constants.BASEURL+'/api?action=pdfgen&for=offer&forid='+self.offer.id,
                    '',
                    'height=500,width=900'
                );
            };

            this.openPdf = function (event) {
                event.preventDefault();
                window.open(
                    constants.BASEURL+'/api?action=protectedpdf&path='+self.offer.path,
                    '',
                    'height=500,width=900'
                );
            };

            this.openMailPreview = function (event) {
                event.preventDefault();
                MailService.showPreview('offer',self.offer.id);
            };

            this.send = function () {
                MailService.send('offer',self.offer.id);
            };

            this.deleteItem = function (itemId) {
                DeleteService('item', itemId).then(function (data) {
                    self.offer.items = data;
                    LocalStorage.setData('offer/'+id, self.offer);
                });
            };

            this.priceChanged = function (item) {
                self.loaded = false;
                getOffer();
            };

            this.getStateParams = function(forState){
                if(forState == 'itemCreation'){
                    return {
                        referrer: 'app.offerDetail',
                        referrerParams: {
                            id: id
                        },
                        for: 'offer',
                        forId: id
                    };
                }
            };

            var changeState=function(toState){
                StateManager.setState('offer', id,toState).then(function (data) {
                    self.offer = data;
                });
            };
            this.decline = function(){
                changeState(-1);
            };

            this.accept = function () {
                changeState(3);
                // TODO: ask for what's next
            };
        }
    ]
);