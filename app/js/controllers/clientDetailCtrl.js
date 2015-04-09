/**
 * Controller for the client detail view.
 */
app.controller('ClientDetailCtrl', ['ApiAbstractionLayer', 'LocalStorage', '$scope', function (ApiAbstractionLayer, LocalStorage, $scope) {

    var self = this;
    this.editMode = false;
    var getClient = function(id) {
        self.client = LocalStorage.getData('client'+'/'+id);
        ApiAbstractionLayer('GET', {name:'client', params: {id:id}}).then(function (data) {
            LocalStorage.setData('client'+'/'+id, data);
            self.client = data;
        });
    };
    $scope.$on('detailChanged', function(event, data){
        editMode = false;
        self.client = data;
        getClient(data.id);
    });

    var clientBackup = null;
    this.enterEditMode = function () {
        self.editMode = true;
        clientBackup = angular.copy(self.client);
    };

    /**
     * Creates or updates a client
     */
    this.createOrUpdateClient = function() {
        ApiAbstractionLayer('POST', {name:'client', data:self.client}).then(function () {
            self.editMode = false;
            clientBackup = null;
        });
    };

    this.cancelClientEdit = function () {
        self.editMode = false;
        console.log(clientBackup);
        self.client = clientBackup;
        clientBackup = null;
    };

}]);