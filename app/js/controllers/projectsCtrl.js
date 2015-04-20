/**
 * Controller for the projects overview page
 */
app.controller('ProjectsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    function(ApiAbstractionLayer, LocalStorage){
        var self = this;
        this.projects = LocalStorage.getData('projects');
        ApiAbstractionLayer('GET','project').then(function (data) {
            LocalStorage.setData('projects', data);
            self.projects = data;
        });
}]);