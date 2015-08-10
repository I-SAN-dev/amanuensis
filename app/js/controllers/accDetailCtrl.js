/**
 * @class ama.controllers.AcceptanceDetailCtrl
 * Controller for the acceptances overview page
 * @author Christian Baur <c.baur@i-san.de>
 */
app.controller('AcceptanceDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'ItemService',
    'PdfService',
    'MailService',
    'StateManager',
    'NextStepModal',
    'DeleteService',
    '$scope',
    '$state',
    '$stateParams',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, ItemService, PdfService, MailService, StateManager, NextStepModal, DeleteService, $scope, $state, $stateParams){
        var self = this;
        var id = $stateParams.id;
        MasterDetailService.setMaster(this);
        /**
         * The acceptance that was loaded from the API or the LocalStorage
         * @type {Object}
         */
        this.acceptance = LocalStorage.getData('acceptance/'+id);

        /*
        Load the acceptance from the API
         */
        var getAcceptance = function()
        {
            ApiAbstractionLayer('GET',{name:'acceptance',params: {id:id}}).then(function (data) {
                LocalStorage.setData('acceptance/'+id, data);
                self.acceptance = data;
            });
        };
        getAcceptance();

        /*
        Change the acceptance's state
         */
        var changeState = function(toState){
            StateManager.setState('acceptance', id, toState).then(function (data) {
                self.acceptance = data;
            });
        };

        /**
         * Uses the {@link ama.services.PdfService PdfService} to show either a PDF preview
         * or the generated PDF of the acceptance
         * @param {Event} event The event (commonly 'click') that triggered the function call
         * @param {boolean} preview Indicates if a preview or the generated PDF should be shown
         * @param {String} path *optional* Path to the generated PDF
         */
        this.viewPdf = function (event,preview,path) {
            PdfService(event,preview,'acceptance',id, path).then(function (data) {
                if(data){
                    self.acceptance.path = data.path;
                    self.acceptance.state = 1;
                    LocalStorage.setData('acceptance/'+id,self.acceptance);
                }
            });
        };

        /**
         * Uses the {@link ama.services.MailService MailService} to show a mail preview for the current offer.
         * @param {Event} event The event (click) that led to the function call
         */
        this.openMailPreview = function (event) {
            event.preventDefault();
            $scope.mailtext = $scope.getValueFromWysiwyg('mailtext');
            MailService.showPreview('acceptance',self.acceptance.id, $scope.mailtext);
        };

        /**
         * Uses the {@link ama.services.MailService MailService} to send a mail with the current offer.
         * Changes the state of the offer to 2 (PDF sent) on success.
         */
        this.send = function () {
            $scope.mailtext = $scope.getValueFromWysiwyg('mailtext');
            MailService.send('acceptance',self.acceptance.id, $scope.mailtext).then(function (data) {
                changeState(2);
            });
        };

        /**
         * Changes the state of the acceptance to -1 (client declined)
         */
        this.decline = function(){
            changeState(-1);
        };

        /**
         * Opens a {@link ama.services.NextStepModal NextStepModal}.
         */
        this.nextStep = function()
        {
            NextStepModal('acceptance', self.acceptance);
        };
        /**
         * Changes the acceptance's state to 3 (client accepted)
         * Opens a {@link ama.services.NextStepModal NextStepModal}.
         */
        this.accept = function () {
            changeState(3);
            self.nextStep();
        };

        /**
         * Gets called when the ordering of the items in the acceptance was changed.
         * Uses {@link ama.services.ItemService#changeOrdering the changeOrdering() function in the ItemService} to apply the new ordering on the server
         * This changes the global_order property of the items.
         */
        this.orderChanged = function () {
            ItemService.changeOrdering(self.acceptance.items);
        };

        /**
         * Moves the specified item to another acceptance by calling {@link ama.services.ItemService#moveItem the moveItem() function in ItemService}
         * @param {Object} item The item to be moved.
         */
        this.moveItem = function (item) {
            ItemService.moveItem(item, 'acceptance', self.acceptance.id, self.acceptance.project.acceptances);
        };

        /**
         * Removes a given item from the document
         * @param {Object} item The item to be removed
         */
        this.removeItemFromDocument = function(item)
        {
            ItemService.removeItemFromDocument(item, 'acceptance');
            getAcceptance();
        };

        /**
         * Generates a stateParams object from the current stateParams for a certain state
         * @param {string} forState The state for which the stateParams should be generated
         * @returns {{referrer: string, referrerParams: {id: ($stateParams.id|*)}, for: string, forId: ($stateParams.id|*)}} The stateParams for the state to be transitioned to, generated from the current stateParams.
         */
        this.getStateParams = function(forState){
            if(forState == 'itemCreation'){
                return {
                    referrer: 'app.acceptanceDetail',
                    referrerParams: {
                        id: id
                    },
                    for: 'acceptance',
                    forId: id
                };
            }
        };

        /**
         * Deletes the current acceptance via {@link ama.services.DeleteService DeleteService}
         */
        this.deleteAcceptance = function () {
            DeleteService('acceptance', id).then(function () {
                $state.go('app.projectDetail', {id: self.acceptance.project.id});
            });
        };

        this.itemListChanged = function (items) {
            if(items)
                self.acceptance.items = items;
            else
                getAcceptance();
        }


    }]);