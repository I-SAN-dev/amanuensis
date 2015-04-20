/**
 * Controller for the client detail view.
 */
app.controller('ClientDetailCtrl',
    ['ApiAbstractionLayer',
        'LocalStorage',
        '$scope',
        '$stateParams',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams) {

            var self = this;

            /**
             * Gets a client from the API
             * @param {int} id - the client id to query for
             */
            var getClient = function(id) {
                self.client = LocalStorage.getData('client'+'/'+id);
                ApiAbstractionLayer('GET', {name:'client', params: {id:id}}).then(function (data) {
                    LocalStorage.setData('client'+'/'+id, data);
                    self.client = data;
                });
            };

            // call getClient when the detail view is requested
            $scope.$on('detailChanged', function(event, data){
                self.client = data;
                getClient(data.id);
            });

            // if the client state is entered with a certain id, we want to set the client detail for this id
            if($stateParams.id){
                $scope.$parent.setDetail({id:$stateParams.id});
            }

            // the next few lines contain code to create a new client - client_data connection

            // set flags for all types of client data.
            // the flag indicate if we currently want to add a new client data of its type
            // TODO: do this dynamically
            this.newConnectionFlag = {
                phone: false,
                mail: false
            };

            /**
             * Toggles the flag for the newConnection creation mode
             * @param {string} type - identifier of the type of client data
             */
            this.setNewConnectionFlag = function(type) {
                self.newConnectionFlag[type] = !self.newConnectionFlag[type];
            };

            // just a simple object containing any possible new client data
            // with (initially) empty names and values.
            // bound to input fields in the view
            // TODO: create this dynamically
            this.newConnection = {
                phone: {
                    name: '',
                    value: ''
                },
                mail: {
                    name: '',
                    value: ''
                }
            };

            /**
             * Performs a database request to add a new client - client_data connection of a certain type
             * @param {string} type - identifier of the type of client_data to be created
             */
            this.addConnection = function(type) {
                var name = self.newConnection[type].name;
                var value = self.newConnection[type].value;
                var data = {
                    clientid: self.client.id,
                    datatype: type,
                    name: name,
                    value: value
                };
                // Post to the API
                ApiAbstractionLayer('POST', {name: 'client_data', data: data}).then(function (data) {
                    self.setNewConnectionFlag(type);
                    var conns = self.client.data[type];
                    if(conns) {
                        conns.push({id: data.id, name: name, value: value});
                    } else {
                        self.client.data[type] = [{id: data.id, name: name, value: value}];
                    }
                    LocalStorage.setData('client/'+self.client.id, self.client);
                });
            };


        }
    ]
);