/**
 * @class ama.controllers.OffersCtrl
 * Controller for the offers overview page
 * *DEPRECATED:* The corresponding view doesn't exist anymore.
 * TODO: Delete this file.
 */
app.controller('OffersCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService){
        var self = this;
        /**
         * List off all existing offers
         * @type {Array}
         */
        this.offers = LocalStorage.getData('offers');
        ApiAbstractionLayer('GET','offer').then(function (data) {
            LocalStorage.setData('offer', data);
            self.offers = data;
        });
}]);