/**
 * Controller for the client list view.
 * Gets the client list and holds functions to add and delete clients in the database.
 */
app.controller('ClientsCtrl',
    ['ApiAbstractionLayer', 'LocalStorage', '$scope','$stateParams', function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams) {
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
         * Selects a client from the list and passes the data over to the masterDetailCtrl
         * @param {object} client - the client selected
         */
        this.setDetail = function (client) {
            // TODO: add an 'active' class to the client selected
            $stateParams.id = client.id;
            $scope.$parent.setDetail(client);
        };
    }]);