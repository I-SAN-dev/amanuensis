app.controller('DashboardCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    function (ApiAbstractionLayer, LocalStorage) {
        var self = this;
        this.currentProjects = LocalStorage.getData('currentProjects');
        var apiObject = {
            name: 'project',
            params: {
                current: 1
            }
        };
        ApiAbstractionLayer('GET', apiObject).then(function (data) {
            self.currentProjects = data;
        });
    }
]);