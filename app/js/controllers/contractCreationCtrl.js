app.controller('ContractCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    function (ApiAbstractionLayer, LocalStorage, RefnumberService, ItemContainerService, $stateParams, $state) {
        var self = this;
        var project = $stateParams.project;
        var projectId = project.id;
        this.projectName = project.name;
        this.newContract = {
            refnumber: '',
            project: project.id
        };

        RefnumberService('contracts', projectId).then(function (data) {
            if(self.newContract.refnumber === ''){
                self.newContract.refnumber = data.refnumber;
            }
        });
        this.createContract = function () {
            ItemContainerService.createItemContainer('contract', projectId, self.newContract).then(function (data) {
                // go to where we came from
                var to = $stateParams.referrer;
                var toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
            });
        };
    }
]);