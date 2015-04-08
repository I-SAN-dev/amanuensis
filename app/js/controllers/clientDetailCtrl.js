/**
 * Controller for the client detail view.
 */
app.controller('ClientDetailCtrl', ['ApiAbstractionLayer', 'LocalStorage', '$scope', function (ApiAbstractionLayer, LocalStorage, $scope) {
    this.client = {};
    var self = this;
    var getClient = function(id) {
        ApiAbstractionLayer('GET', {name:'client', params: {id:id}}).then(function (data) {
            self.client = data;
        });
    };
    $scope.$on('detailChanged', function(event, data){
        self.client = data;
        getClient(data.id);
    })
}]);