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

        }
    ]
);