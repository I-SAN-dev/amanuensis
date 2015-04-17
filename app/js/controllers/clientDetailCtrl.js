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
            var getClient = function(id) {
                self.client = LocalStorage.getData('client'+'/'+id);
                ApiAbstractionLayer('GET', {name:'client', params: {id:id}}).then(function (data) {
                    LocalStorage.setData('client'+'/'+id, data);
                    self.client = data;
                });
            };
            $scope.$on('detailChanged', function(event, data){
                self.client = data;
                getClient(data.id);
            });

            if($stateParams.id){
                $scope.$parent.setDetail({id:$stateParams.id});
            }

            this.newConnectionFlag = {
                phone: false,
                mail: false
            };

            this.setNewConnectionFlag = function(type) {
                self.newConnectionFlag[type] = !self.newConnectionFlag[type];
            };

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

            this.addConnection = function(type) {
                var name = self.newConnection[type].name;
                var value = self.newConnection[type].value;
                var data = {
                    clientid: self.client.id,
                    datatype: type,
                    name: name,
                    value: value
                };
                ApiAbstractionLayer('POST', {name: 'client_data', data: data}).then(function () {
                    self.setNewConnectionFlag(type);
                    var conns = self.client.data[type];
                    if(conns) {
                        conns.push({name: name, value: value});
                    } else {
                        self.client.data[type] = [{name: name, value: value}];
                    }
                    LocalStorage.setData('client/'+self.client.id, self.client);
                });
            };

        }
    ]
);