app.controller('ProjectDetailCtrl',
    [
        'ApiAbstractionLayer',
        'LocalStorage',
        '$scope',
        '$stateParams',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams) {
            var self = this;

            /**
             * Gets a project from the API
             * @param {int} id - the client id to query for
             */
            var getProject = function(id) {
                self.project = LocalStorage.getData('project'+'/'+id);
                ApiAbstractionLayer('GET', {name:'project', params: {id:id}}).then(function (data) {
                    LocalStorage.setData('project'+'/'+id, data);
                    self.project = data;
                });
            };

            // call getProject when the detail view is requested
            $scope.$on('detailChanged', function(event, data){
                self.project = data;
                getProject(data.id);
            });

            // if the project state is entered with a certain id, we want to set the project detail for this id
            if($stateParams.id){
                $scope.$parent.setDetail({id:$stateParams.id});
            }
        }
    ]
);