app.controller('ClientsCtrl', ['ApiAbstractionLayer', function (ApiAbstractionLayer) {
    this.clientList = [];
    this.filterText = '';
    var self = this;
    ApiAbstractionLayer('GET','client').then(function (data) {
        console.log(data);
        self.clientList = data;
    });
    var initialNewClient = {
        companyname: null,
        contact_firstname: null,
        contact_lastname: null,
        street_no: null,
        additional: null,
        zip: null,
        city: null,
        country: null,
        comment: null,
        contact_gender: null,
        refnumber: '123456'
    };
    this.newClient = initialNewClient;
    this.addClient = function () {
        ApiAbstractionLayer('POST', {name: 'client', data: self.newClient}).then(function(data){
            self.clientList.push(data);
            self.newClient = initialNewClient;
        });
    };
}]);