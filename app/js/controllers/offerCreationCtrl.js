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
    function (RefnumberService, ItemContainerService, $stateParams, $state) {
        var self = this;
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
                var to = $stateParams.referrer;
                var toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
            });
        };
    }
]);