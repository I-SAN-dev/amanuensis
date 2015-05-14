app.controller('OfferDetailCtrl', [
        'ApiAbstractionLayer',
        'LocalStorage',
        'MasterDetailService',
        'DeleteService',
        'PdfService',
        '$stateParams',
        '$scope',
        function (ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, PdfService, $stateParams, $scope) {
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

            this.deleteItem = function (itemId) {
                DeleteService('item', itemId).then(function (data) {
                    self.offer.items = data;
                    LocalStorage.setData('offer/'+id, self.offer);
                });
            };
        }
    ]
);