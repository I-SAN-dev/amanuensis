/**
 * Controller for the projects overview page
 */
app.controller('ProjectsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'DeleteService',
    '$scope',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, $scope){
        var self = this;
        MasterDetailService.setMaster(this);

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
            LocalStorage.setData('projects', self.projects);
        };


        setProjectList(LocalStorage.getData('projects'));
        ApiAbstractionLayer('GET','project').then(function (data) {
            setProjectList(data)
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

        this.deleteProject = function (id) {
            DeleteService('project',id).then(function (data) {
                self.projects = data;
            });

        };
}]);