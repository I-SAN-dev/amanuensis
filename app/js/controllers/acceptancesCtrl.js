/**
 * Controller for the acceptances overview page
 */
app.controller('AcceptancesCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    function(ApiAbstractionLayer, LocalStorage){
        var self = this;
        this.acceptances = LocalStorage.getData('acceptances');
        ApiAbstractionLayer('GET','acceptance').then(function (data) {
            LocalStorage.setData('acceptances', data);
            self.acceptances = data;
        });

}]);