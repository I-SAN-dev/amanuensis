/**
 * @class ama.controllers.ClientsCtrl
 * Controller for the client (master) list view.
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
        '$filter',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams, DeleteService, MasterDetailService, $filter) {
            /**
             * An array containing all clients.
             * @type {Array}
             */
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
                self.clientList = $filter('orderBy')(data,'companyname');
                LocalStorage.setData('clients', self.clientList);
            };

            // get the client list
            if(!$stateParams.noReload) {
                ApiAbstractionLayer('GET', 'client').then(function (data) {
                    setClientList(data);
                    if (!$stateParams.id && self.clientList.length > 0) {
                        MasterDetailService.notifyController('setDetail', self.clientList[0]);
                        $stateParams.id = self.clientList[0].id;
                    }
                });
            }

            // (re)set a flag indicating if the Controller was fully loaded
            // needed for setting transition classes
            $scope.$on('$stateChangeStart', function (event, toState) {
                console.log(toState);
                self.loaded = false;
            });
            setTimeout(function () {
                self.loaded = true;
                $scope.$apply();
            }, 1000);


            /**
             * Delete the link between client and client category
             * *DEPRECATED:* We manage this in {@link ama.controllers.ClientCategoriesDialog the ClientCategoriesDialog controller}.
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