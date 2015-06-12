/**
 * @class ama.controllers.AcceptanceCreationCtrl
 *
 * Controller for the acceptance creation view.
 */
app.controller('AcceptanceCreationCtrl', [
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    'ErrorDialog',
    function (RefnumberService, ItemContainerService, $stateParams, $state, ErrorDialog) {
        var self = this;
        if(!$stateParams.project){
            ErrorDialog({code:'1337',languagestring:'errors.noProjectSpecified'}).activate();
            $state.go('app.dashboard')
        }
        var project = $stateParams.project;
        var projectId = project.id;

        /**
         * @type {String}
         * The name of the current project, derived from stateParams
         */
        this.projectName = project.name;

        /**
         * An initially empty object which will be filled by user input and send to the API as new acceptance
         * @type {{refnumber: string, project: Object}}
         */
        this.newAcceptance = {
            refnumber: '',
            project: projectId
        };

        // get the next refnumber for a new acceptance
        RefnumberService('acceptances', projectId).then(function (data) {
            if(self.newAcceptance.refnumber === ''){
                self.newAcceptance.refnumber = data.refnumber;
            }
        });

        /**
         * Creates a new acceptance
         */
        this.createAcceptance = function () {
            ItemContainerService.createItemContainer('acceptance', projectId, self.newAcceptance).then(function (data) {
                // go to where we came from
                var to = $stateParams.referrer;
                var toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
            });
        };
    }
]);