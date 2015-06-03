app.controller('ProjectDetailCtrl',
    [
        'ApiAbstractionLayer',
        'LocalStorage',
        'DeleteService',
        'PanelService',
        '$scope',
        '$state',
        '$stateParams',
        'MasterDetailService',
        function (ApiAbstractionLayer, LocalStorage, DeleteService, PanelService, $scope, $state, $stateParams, MasterDetailService) {
            var self = this;
            MasterDetailService.setDetail(this);
            this.contracts = [];

            /**
             * Gets a project from the API
             * @param {int} id - the client id to query for
             */
            var getProject = function(id) {
                self.project = LocalStorage.getData('project'+'/'+id);
                self.contracts = LocalStorage.getData('project/'+id+'/contracts');
                ApiAbstractionLayer('GET', {name:'project', params: {id:id}}).then(function (data) {
                    LocalStorage.setData('project'+'/'+id, data);
                    self.project = data;
                    var contracts = [];
                    for (var i = 0; i < data.contracts.length; i++) {
                        var contract = data.contracts[i];
                        contract.type = 'contract';
                        contracts.push(contract);
                    }
                    for (var j=0; j < data.fileContracts.length; j++) {
                        contract = data.fileContracts[j];
                        contract.type = 'fileContract';
                        if(contract.path)
                            contract.refnumber = contract.path.replace(/\\/g,'/').replace( /.*\//, '' ); /* Use basename as refnumber */
                        contracts.push(contract);
                    }
                    self.contracts = contracts;
                    LocalStorage.setData('project/'+id+'/contracts', self.contracts);
                });
            };

            // call getProject when the detail view is requested
            this.detailChanged=function(data){
                self.project = data;
                self.contracts = [];
                getProject(data.id);
            };

            // if the project state is entered with a certain id, we want to set the project detail for this id
            if($stateParams.id){
                if($scope.$parent.setDetail)
                    $scope.$parent.setDetail({id:$stateParams.id});
                else
                    getProject($stateParams.id);
            }

            this.deleteProject = function(){
                var client = self.project.client.id;
                DeleteService('project',self.project.id).then(function (data) {
                    PanelService.setPanel('clients',2);
                    $state.go('app.clients.detail',{id:client})
                });
            };


        }
    ]
);