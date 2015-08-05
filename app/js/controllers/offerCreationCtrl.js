/**
 * @class ama.controllers.OfferCreationCtrl
 *
 * Controller for the offer creation view.
 */
app.controller('OfferCreationCtrl', [
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    'ErrorDialog',
    'GoBackService',
    function (RefnumberService, ItemContainerService, $stateParams, $state, ErrorDialog, GoBackService) {
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
         * The offer to be created.
         * @type {{refnumber: string, project: *}}
         */
        this.newOffer = {
            refnumber: '',
            project: projectId
        };


        RefnumberService('offers', projectId).then(function (data) {
            if(self.newOffer.refnumber === ''){
                self.newOffer.refnumber = data.refnumber;
            }
        });

        /**
         * Creates a new offer in the current project.
         */
        this.createOffer = function () {
            ItemContainerService.createItemContainer('offer', projectId, self.newOffer).then(function (data) {
                // go to where we came from
                GoBackService();
            });
        };

        this.cancel = GoBackService;
    }
]);