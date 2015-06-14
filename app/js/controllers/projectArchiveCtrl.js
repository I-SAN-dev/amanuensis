/**
 * @class ama.controllers.ProjectArchiveCtrl
 * Controller for the project archive page
 */
app.controller('ProjectArchiveCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'DeleteService',
    'StateManager',
    '$scope',
    '$state',
    '$stateParams',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, StateManager, $scope, $state, $stateParams){
        var self = this;
        MasterDetailService.setMaster(this);
        var apiObject = {
            name: 'project',
            params: {
                archive: 1
            }
        };
        var lsIdentifier = 'projectArchive';


        /**
         * Process the list of clients coming from the api after GET or DELETE request
         * @param data - the apiData object
         */
        var setProjectList = function (data) {
            for(var i= 0; i<data.length; i++){
                // process contact name if companyname is not set
                if(!data[i].companyname){
                    data[i].companyname =
                        (data[i].contact_firstname || '')
                        +' '
                        +(data[i].contact_lastname || '');
                }
            }
            self.projects = data;
            LocalStorage.setData(lsIdentifier, self.projects);
        };



        setProjectList(LocalStorage.getData(lsIdentifier)|| []);
        ApiAbstractionLayer('GET',apiObject).then(function (data) {
            setProjectList(data.list);
            if (!$stateParams.id && self.projects.length > 0) {
                MasterDetailService.notifyController('setDetail', self.projects[0]);
                $stateParams.id = self.projects[0].id;
            }
        });

        // (re)set a flag indicating if the Controller was fully loaded
        // needed for setting transition classes
        $scope.$on('$stateChangeStart', function (event, toState) {
            self.loaded = false;
        });
        setTimeout(function () {
            self.loaded = true;
            $scope.$apply();
        }, 1000);

        /**
         * Uses {@link ama.services.StateManager the stateManager} to resend the given archived project back to the list of current projects
         * @param id The id of the project to be unarchived
         */
        this.unarchiveProject = function (id) {
            StateManager.setState('project',id,0).then(function (data) {
                $state.go('app.projectDetail',{id:data.id});
            });
        }
}]);