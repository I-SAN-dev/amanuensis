/**
 * Controller for the client list view.
 * Gets the client list and holds functions to add and delete clients in the database.
 */
app.controller('ClientsCtrl', ['ApiAbstractionLayer', 'LocalStorage', function (ApiAbstractionLayer, LocalStorage) {
    this.clientList = LocalStorage.getData('clients');

    this.filterText = '';
    var self = this;

    // Get the client list
    ApiAbstractionLayer('GET','client').then(function (data) {
        for(var i= 0; i<data.length; i++){
            // process contact name if companyname is not set
            if(!data[i].companyname){
                data[i].companyname =
                    (data[i].contact_firstname || '')
                    +' '
                    +(data[i].contact_lastname || '');
            }
        }
        self.clientList = data;
        LocalStorage.setData('clients', data);
    });


    // Get all client categories
    // TODO: test this, the API doesn't support it yet
    //this.allCategories = LocalStorage.getData('clientCategories');
    ApiAbstractionLayer('GET', 'client_category').then(function(data){
        self.allCategories = data;
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
        // TODO: set refnumber to highest refnumber in client list + 1
        refnumber: '123456'
    };
    this.newClient = initialNewClient;

    /**
     * Creates a new client
     */
    this.addClient = function () {
        ApiAbstractionLayer('POST', {name: 'client', data: self.newClient}).then(function(data){
            self.clientList.push(data);
            self.newClient = initialNewClient;
        });
    };

    /**
     * Deletes a client by given ID
     * TODO: Use real data when API supports this
     *
     * @param id {string} - Database ID of the client to be deleted
     */
    this.deleteClient = function(id){
        ApiAbstractionLayer('DELETE', 'helloWorld');
    };
}]);