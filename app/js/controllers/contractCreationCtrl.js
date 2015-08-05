/**
 * @class ama.controllers.ContractCreationCtrl
 * Controller for the contract creation view.
 */
app.controller('ContractCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'RefnumberService',
    'ItemContainerService',
    'fileUploadService',
    '$stateParams',
    '$state',
    'constants',
    'translateFilter',
    'ErrorDialog',
    'GoBackService',
    function (ApiAbstractionLayer,LocalStorage,RefnumberService, ItemContainerService, fileUploadService, $stateParams, $state, constants, translateFilter, ErrorDialog, GoBackService) {
        var self = this;
        if(!$stateParams.project){
            ErrorDialog({code:'1337',languagestring:'errors.noProjectSpecified'}).activate();
            $state.go('app.dashboard')
        }
        var project = $stateParams.project;
        var projectId = project.id;
        /**
         * Name of the current project (derived from stateParams)
         * @type {string}
         */
        this.projectName = project.name;

        /**
         * The new contract to be created
         * @type {{refnumber: string, project: int}}
         */
        this.newContract = {
            refnumber: '',
            project: project.id
        };

        RefnumberService('contracts', projectId).then(function (data) {
            if(self.newContract.refnumber === ''){
                self.newContract.refnumber = data.refnumber;
            }
        });

        /**
         * Checks if a string ends with a given string
         * @param str
         * @param suffix
         * @returns {boolean}
         */
        var endsWith = function(str, suffix)
        {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        /**
         * Watches filename changes
         */
        var fileinput = $('.hidden-fileinput');
        fileinput.change(function(){
            var filename = fileinput.val();
            if(endsWith(filename,'.pdf') || endsWith(filename, '.PDF'))
            {
                self.filename = filename;
                self.validfile = true;
            }
            else
            {
                self.filename = translateFilter('contract.onlyPdf');
                self.validfile = false;
            }
        });

        /**
         * Creates a new contract
         */
        this.createContract = function () {
            if(self.fileContract){
                if(self.validfile)
                {
                    ItemContainerService.createItemContainer('fileContract',projectId, self.newContract).then(function (data) {
                        var file = self.fileContract;
                        console.log(file);
                        var uploadUrl = constants.URL+'/api/?action=fileContract&uploadfor='+data.id;
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
                }

            } else {
                ItemContainerService.createItemContainer('contract', projectId, self.newContract).then(function (data) {
                    // go to where we came from
                    GoBackService();
                });
            }
        };

        this.cancel = GoBackService;
    }
]);