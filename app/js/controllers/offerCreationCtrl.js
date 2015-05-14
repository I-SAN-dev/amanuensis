app.controller('OfferCreationCtrl', [
    'RefnumberService',
    'ItemContainerService',
    '$stateParams',
    '$state',
    function (RefnumberService, ItemContainerService, $stateParams, $state) {
        var self = this;
        var project = $stateParams.project;
        var projectId = project.id;
        this.projectName = project.name;
        this.newOffer = {
            refnumber: '',
            project: projectId
        };


        RefnumberService('offers', projectId).then(function (data) {
            if(self.newOffer.refnumber === ''){
                self.newOffer.refnumber = data.refnumber;
            }
        });
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