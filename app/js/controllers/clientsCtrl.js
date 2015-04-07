/**
 * Controller for the client list view.
 * Gets the client list and holds functions to add and delete clients in the database.
 */
app.controller('ClientsCtrl', ['ApiAbstractionLayer', 'LocalStorage', function (ApiAbstractionLayer, LocalStorage) {
    this.clientList = LocalStorage.getData('clients');

    this.filterText = '';
    var self = this;

    var setClientList = function (data) {
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
        LocalStorage.setData('clients', self.clientList);
    };

    // Get the client list
    ApiAbstractionLayer('GET','client').then(function (data) {
        setClientList(data);
    });


    // Get all client categories
    this.allCategories = LocalStorage.getData('clientCategories');
    ApiAbstractionLayer('GET', 'client_categories').then(function(data){
        self.allCategories = data;
        LocalStorage.setData('clientCategories', data)
    });

    var refNumber = '';
    ApiAbstractionLayer('GET','client_refnumber').then(function (data) {
        self.newClient.refnumber = data.refnumber;
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
        refnumber: refNumber
    };
    this.newClient = initialNewClient;

    this.newClientCategories = [];
    /**
     * Creates a new client
     */
    this.addClient = function () {
        ApiAbstractionLayer('POST', {name: 'client', data: self.newClient}).then(function(data){
            self.clientList.push(data);
            self.addCategoryLinks(data.id, self.newClientCategories);
            self.newClient = initialNewClient;
        });
    };

    /**
     * Adds one or more categori(es) to a client
     * TODO: test it when the API supports it
     * @param {int} client - the client id
     * @param {object} categories - an array containing all category ids that shall be added to the client
     */
    this.addCategoryLinks = function(client, categories) {
        if(categories){
            for (var i in categories) {
                ApiAbstractionLayer('POST', {name: 'client_categories', data: {id: categories[i], clientid: client}});
            }
        }
    };

    this.deleteCategoryLink = function (client, category) {
        ApiAbstractionLayer('DELETE', {name:'client_categories', data: {id:self.allCategories[category].id, clientid: client}});
    };

    /**
     * Deletes a client by given ID
     *
     * @param id {string} - Database ID of the client to be deleted
     */
    this.deleteClient = function(id){
        ApiAbstractionLayer('DELETE', {name:'client',data:{id:id}}).then(function (data) {
            setClientList(data);
        });
    };



    /**
     * Creates a new client category
     */
    this.addCategory = function () {
        ApiAbstractionLayer('POST', {name: 'client_categories', data: self.newCategory}).then(function (data) {
            self.allCategories.push(data);
            LocalStorage.setData('clientCategories', self.allCategories);
        });
    };

    /**
     * Deletes a client category by given ID
     */
    this.deleteCategory = function (id) {
        ApiAbstractionLayer('DELETE', {name: 'client_categories', data: {id: id}}).then(function (data) {
            self.allCategories = data;
            LocalStorage.setData('clientCategories', self.allCategories);
        });
    }
}]);