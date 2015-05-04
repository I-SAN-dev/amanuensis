/**
 * Controller for the projects overview page
 */
app.controller('ProjectsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    '$scope',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, $scope){
        var self = this;
        MasterDetailService.setMaster(this);
        this.projects = LocalStorage.getData('projects');
        ApiAbstractionLayer('GET','project').then(function (data) {
            LocalStorage.setData('projects', data);
            self.projects = data;
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
}]);