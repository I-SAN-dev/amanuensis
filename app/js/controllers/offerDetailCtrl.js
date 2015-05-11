app.controller('OfferDetailCtrl', [
        'ApiAbstractionLayer',
        'LocalStorage',
        '$stateParams',
        function (ApiAbstractionLayer, LocalStorage, $stateParams, ItemService) {
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
                var method = 'POST';
                var paramType = 'data';
                if(preview) {
                    method = 'GET';
                    paramType = 'params';
                }

                var apiObject = {
                    name: 'pdfgen'
                };
                apiObject[paramType] = {
                    for: 'offer',
                    forid: self.offer.id
                };

                ApiAbstractionLayer(method, apiObject).then(function (data) {
                    if(preview){

                    } else {
                        self.offer.path = data.path;
                        LocalStorage.setData('offer/'+id, self.offer);
                    }
                });
            }





        }
    ]
);