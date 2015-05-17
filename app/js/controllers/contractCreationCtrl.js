app.controller('ContractCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'RefnumberService',
    'ItemContainerService',
    'fileUploadService',
    '$stateParams',
    '$state',
    'constants',
    function (ApiAbstractionLayer,LocalStorage,RefnumberService, ItemContainerService, fileUploadService, $stateParams, $state, constants) {
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
            if(self.fileContract){
                ItemContainerService.createItemContainer('fileContract',projectId, self.newContract).then(function (data) {
                    var file = self.fileContract;
                    console.log(file);
                    var uploadUrl = constants.BASEURL+'/api/?action=fileContract&uploadfor='+data.id;
                    fileUploadService.uploadFile(file,uploadUrl).then(function(path){
                        ApiAbstractionLayer('POST', {name:'fileContract', data: {id: data.id, path: path}}).then(function (data) {
                            ItemContainerService.updateLocalStorage('fileContract', projectId, data);
                            // go to where we came from
                            var to = $stateParams.referrer;
                            var toParams = $stateParams.referrerParams;
                            $state.go(to,toParams);
                        });
                    });

                });

            } else {
                ItemContainerService.createItemContainer('contract', projectId, self.newContract).then(function (data) {
                    // go to where we came from
                    var to = $stateParams.referrer;
                    var toParams = $stateParams.referrerParams;
                    $state.go(to,toParams);
                });
            }
        };
    }
]);