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
        '$document',
        '$q',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams, DeleteService, $document, $q) {
            this.clientList = LocalStorage.getData('clients');

            this.filterText = '';
            var self = this;

            var orderById = {};

            var setClientList = function (data) {
                for(var i= 0; i<data.length; i++){
                    // process contact name if companyname is not set
                    if(!data[i].companyname){
                        data[i].companyname =
                            (data[i].contact_firstname || '')
                            +' '
                            +(data[i].contact_lastname || '');
                    }
                    // save the list order for easy selection of next/prev item (keyboard navigation)
                    orderById[data[i].id] = i;
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

            /**
             * Selects a client from the list and passes the data over to the masterDetailCtrl
             * @param {object} client - the client selected
             */
            this.setDetail = function (client) {
                //var defer = $q.defer();
                $stateParams.id = client.id;
                $scope.$parent.setDetail(client);/*.then(function (result) {
                    defer.resolve();
                });
                return defer.promise;*/
            };

            /**
             * Keyboard navigation fr the client list
             */
            $document.on('keydown', function (event) {
                var key = event.keyCode;
                var oldId = angular.copy($stateParams.id);
                var oldPos = orderById[oldId];

                var viewportHeight = window.innerHeight;
                var scrollTop = $document.scrollTop();
                var viewPortBottom = viewportHeight + scrollTop;


                if(key == 38 || key == 40){
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    var animation = {
                        duration:500,
                        queue:false
                    };
                    var documentOffset = 70;
                    if (key == 38){
                        if(self.clientList[oldPos - 1]) {
                            var newActiveOffset = $('.list-group-item.active').prev('.list-group-item').offset().top;
                            self.setDetail(self.clientList[oldPos - 1]);

                            if(newActiveOffset < scrollTop)
                                $('html, body').animate({scrollTop:newActiveOffset-documentOffset}, animation);
                        }
                    } else {
                        if (self.clientList[oldPos + 1]) {
                            var newActiveItem = $('.list-group-item.active').next('.list-group-item');
                            var newActiveOffset = newActiveItem.height() + newActiveItem.offset().top;

                            self.setDetail(self.clientList[oldPos + 1]);
                            if(newActiveOffset > viewPortBottom) {
                                $('html, body').animate({scrollTop: newActiveOffset-viewportHeight+documentOffset}, animation);
                            }
                        }
                    }
                }
            });

        }
    ]
);