/**
 * Controller for the projects overview page
 */
app.controller('ProjectsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService){
        var self = this;
        MasterDetailService.setMaster(this);
        this.projects = LocalStorage.getData('projects');
        ApiAbstractionLayer('GET','project').then(function (data) {
            LocalStorage.setData('projects', data);
            self.projects = data;
        });
}]);