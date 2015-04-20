/**
 * Controller for the offers overview page
 */
app.controller('OffersCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    function(ApiAbstractionLayer, LocalStorage){
        var self = this;
        this.offers = LocalStorage.getData('offers');
        ApiAbstractionLayer('GET','offer').then(function (data) {
            LocalStorage.setData('offer', data);
            self.offers = data;
        });
}]);