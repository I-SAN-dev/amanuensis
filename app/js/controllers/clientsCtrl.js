/**
 * Controller for the client list view.
 * Gets the client list and holds functions to add and delete clients in the database.
 */
app.controller('ClientsCtrl',
    [
        'ApiAbstractionLayer',
        'LocalStorage',
        '$scope',
        '$stateParams',
        'DeleteService',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams, DeleteService) {
            this.clientList = LocalStorage.getData('clients');


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


            this.deleteCategoryLink = function (client, category) {
                ApiAbstractionLayer('DELETE', {name:'client_categories', data: {id:self.allCategories[category].id, clientid: client}});
            };

            /**
             * Deletes a client by given ID
             *
             * @param id {string} - Database ID of the client to be deleted
             */
            this.deleteClient = function(id){
                DeleteService('client',id).then(function (data) {
                    setClientList(data);
                });
            };


        }
    ]
);