app.controller('OfferCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    '$stateParams',
    '$state',
    '$filter',
    function (ApiAbstractionLayer, LocalStorage, $stateParams, $state, $filter) {
        var self = this;
        var project = $stateParams.project;
        this.projectId = project.id;
        this.projectName = project.name;
        this.newOffer = {
            refnumber: '',
            project: project.id
        };


        var getRefNumber = function () {
            var refNumber = '';
            ApiAbstractionLayer('GET',{name:'refnumber', params: {for:'offers'}}).then(function (data) {
                if(self.newOffer.refnumber === ''){
                    self.newOffer.refnumber = data.refnumber;
                }
            });
        };
        getRefNumber();
        this.createOffer = function () {
            var date = new Date;
            self.newOffer.date = $filter('date')(date,'yyyy-MM-dd HH:mm:ss');
            console.log(date, self.newOffer.date);
            var apiObject = {
                name: 'offer',
                data: self.newOffer
            };
            ApiAbstractionLayer('POST', apiObject).then(function (data) {
                LocalStorage.setData('offer/'+data.id, data);
                self.newOffer = null;

                var project = LocalStorage.getData('project/'+self.projectId);
                project.offers.push(data);
                LocalStorage.setData('project/'+self.projectId, project);

                // go to where we came from
                var to = $stateParams.referrer;
                var toParams = $stateParams.referrerParams;
                $state.go(to,toParams);
            });
        };
    }
]);