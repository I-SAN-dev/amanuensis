/**
 * @class ama.controllers.ProjectsCtrl
 * Controller for the projects overview page
 * *DEPRECATED:* The projects overview page doesn't exist anymore.
 * TODO: Delete this file.
 */
app.controller('ProjectsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'DeleteService',
    '$scope',
    '$state',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, $scope, $state){
        var self = this;
        MasterDetailService.setMaster(this);
        var apiObject = {
            name: 'project',
            params: {}
        };
        var lsIdentifier = 'projects';
        if($state.current.name == 'app.projects.detail'){
            apiObject.params.current = 1;
        }
        if($state.current.name == 'app.projectArchive.detail'){
            apiObject.params.archive = 1;
            lsIdentifier = 'projectArchive';
        }


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
         * Deletes a project by given ID
         * @param {int} id The ID of the project to be deleted
         */
        this.deleteProject = function (id) {
            DeleteService('project',id).then(function (data) {
                self.projects = data.list;
                //TODO actually this is wrong. This does not consider that we differentiate between archived and current projects
            });

        };
}]);