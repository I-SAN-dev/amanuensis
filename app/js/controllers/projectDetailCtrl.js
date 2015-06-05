app.controller('ProjectDetailCtrl',
    [
        'ApiAbstractionLayer',
        'LocalStorage',
        'DeleteService',
        'PanelService',
        'StateManager',
        '$scope',
        '$state',
        '$stateParams',
        'MasterDetailService',
        function (ApiAbstractionLayer, LocalStorage, DeleteService, PanelService, StateManager, $scope, $state, $stateParams, MasterDetailService) {
            var self = this;
            MasterDetailService.setDetail(this);
            this.contracts = [];

            // set a flag to indicate if the project can be deleted
            this.emptyProject = false;



            /**
             * Gets a project from the API
             * @param {int} id - the client id to query for
             */
            var getProject = function(id) {
                self.project = LocalStorage.getData('project'+'/'+id);
                self.contracts = LocalStorage.getData('project/'+id+'/contracts');
                self.emptyProject = isProjectEmpty();
                ApiAbstractionLayer('GET', {name:'project', params: {id:id}}).then(function (data) {
                    LocalStorage.setData('project'+'/'+id, data);
                    self.project = data;
                    self.emptyProject = isProjectEmpty();
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

            /**
             * Checks if the current project contains any documents
             * @return {bool} false if the project contains documents, true if the project is empty
             */
            var isProjectEmpty = function () {
                if(self.project){
                    var p = self.project;
                    var documents = [p.offers, p.contracts, p.fileContracts, p.todos, p.invoices];
                    for(var i = 0; i < documents.length; i++){
                        if (documents[i].length) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    // the project must have been loaded from localStorage as undefined,
                    // so we cannot know if it contains documents. Thus, we return false here.
                    return false;
                }
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

            /**
             * Deletes the current project
             */
            this.deleteProject = function(){
                var client = self.project.client.id;
                DeleteService('project',self.project.id).then(function (data) {
                    PanelService.setPanel('clients',2);
                    $state.go('app.clients.detail',{id:client})
                });
            };

            /**
             * Changes the project state
             * @param {int} state - the code of the desired new state
             * @param {function} then - a function to call after the state was changed successfully
             */
            this.changeState = function (state, then) {
                StateManager.setState('project', self.project.id, state).then(function (data) {
                    self.project = data;
                    if(then){
                        then(data);
                    }
                });
            };

            /**
             * Reacts on a state change of the current project by going to the project archive
             * @param {Object} project - the archived project
             */
            this.wasArchived = function (project) {
                $state.go('app.projectArchive.detail', {id:project.id});
            };


        }
    ]
);