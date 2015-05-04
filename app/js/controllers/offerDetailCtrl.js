app.controller('OfferDetailCtrl', [
        'ApiAbstractionLayer',
        'LocalStorage',
        '$stateParams',
        function (ApiAbstractionLayer, LocalStorage, $stateParams) {
            var id = $stateParams.id;
            var self = this;

            // TODO: load dateFormat from Config
            this.dateFormat = 'dd.MM.yyyy';

            this.offer = LocalStorage.getData('offer/'+id);
            ApiAbstractionLayer('GET',{name: 'offer', params: {id: id}}).then(function (data) {
                self.offer = data;
                LocalStorage.setData('offer/'+id, data);
            });
        }
    ]
);