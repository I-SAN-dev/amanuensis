app.controller('OfferDetailCtrl', [
        'ApiAbstractionLayer',
        'LocalStorage',
        '$stateParams',
        'PdfService',
        function (ApiAbstractionLayer, LocalStorage, $stateParams, PdfService) {
            var id = $stateParams.id;
            var self = this;

            // TODO: load dateFormat from Config
            this.dateFormat = 'dd.MM.yyyy';

            this.offer = LocalStorage.getData('offer/'+id);
            ApiAbstractionLayer('GET',{name: 'offer', params: {id: id}}).then(function (data) {
                self.offer = data;
                LocalStorage.setData('offer/'+id, data);
            });


            this.generatePDF = function (preview) {
                PdfService(preview, 'offer', id).then(function (data) {
                    if(preview){

                    } else {
                        self.offer.path = data.path;
                        LocalStorage.setData('offer/'+id, self.offer);
                    }
                });
            };
        }
    ]
);