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
        'MasterDetailService',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams, DeleteService, MasterDetailService) {
            this.clientList = LocalStorage.getData('clients');
            MasterDetailService.setMaster(this);


            var self = this;

            /**
             * Process the list of clients coming from the api after GET or DELETE request
             * @param data - the apiData object
             */
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

            // get the client list
            ApiAbstractionLayer('GET','client').then(function (data) {
                setClientList(data);
            });

            // (re)set a flag indicating if the Controller was fully loaded
            // needed for setting transition classes
            $scope.$on('$stateChangeStart', function (event, toState) {
                console.log(toState);
                self.loaded = false;
            });
            setTimeout(function () {
                self.loaded = true;
                $scope.$apply();
            }, 0);


            /**
             * Delete the link between client and client category
             * TODO: test if this still works...
             * @param client - the client's id
             * @param category - the category
             */
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