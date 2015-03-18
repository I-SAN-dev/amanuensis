app.controller('ClientsCtrl', ['ApiAbstractionLayer', function (ApiAbstractionLayer) {
    this.clientList = [];
    var self = this;
    ApiAbstractionLayer('GET','client').then(function (data) {
        console.log(data);
        self.clientList = data;
    });
}]);