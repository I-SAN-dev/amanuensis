app.controller('AcceptanceCreationCtrl', [
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    function (RefnumberService, ItemContainerService, $stateParams, $state) {
        var self = this;
        var project = $stateParams.project;
        var projectId = project.id;
        this.projectName = project.name;

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