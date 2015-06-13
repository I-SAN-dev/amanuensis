/**
 * @class ama.controllers.OfferDetailCtrl
 *
 * Controller for the offer detail view.
 */
app.controller('OfferDetailCtrl', [
        'ApiAbstractionLayer',
        'LocalStorage',
        'MasterDetailService',
        'DeleteService',
        'PdfService',
        'MailService',
        'StateManager',
        'NextStepModal',
        'ItemService',
        '$state',
        '$stateParams',
        '$scope',
        '$q',
        function (ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, PdfService, MailService, StateManager, NextStepModal, ItemService, $state, $stateParams, $scope, $q) {
            var id = $stateParams.id;
            MasterDetailService.setMaster(this);
            var self = this;

            /**
             * Uses the {@link ama.services.PdfService PdfService} to show either a PDF preview
             * or the generated PDF of the offer.
             * @param {Event} event The event (commonly 'click') that triggered the function call
             * @param {bool} preview Indicates if a preview or the generated PDF should be shown
             * @param {String} path *optional* Path to the generated PDF
             */
            this.viewPdf = function (event, preview, path) {
                PdfService(event,preview,'offer',id, path).then(function (data) {
                    if(data){
                        self.offer.path = data.path;
                        self.offer.state = 1;
                        LocalStorage.setData('offer/'+id, self.offer);
                    }
                });
            };
            $scope.mailtext = '';
            // (re)set a flag indicating if the Controller was fully loaded
            // needed for setting transition classes
            $scope.$on('$stateChangeStart', function (event, toState) {
                self.loaded = false;
            });
            setTimeout(function () {
                self.loaded = true;
                $scope.$apply();
            }, 1000);




            /**
             * The app's date format. *DEPRECATED.*
             * TODO: load dateFormat from Config
             * @type {string}
             */
            this.dateFormat = 'dd.MM.yyyy';

            /**
             * The current offer.
             * @type {Object}
             */
            this.offer = LocalStorage.getData('offer/'+id);



            var getOffer = function () {
                var defer = $q.defer();
                ApiAbstractionLayer('GET',{name: 'offer', params: {id: id}}).then(function (data) {
                    self.offer = data;
                    LocalStorage.setData('offer/'+id, data);
                    self.loaded = true;
                    defer.resolve(data);
                });
                return defer.promise;
            };

            getOffer();

            var changeState = function(toState){
                StateManager.setState('offer', id, toState).then(function (data) {
                    self.offer = data;
                });
            };

            /**
             * Sets the first item of a provided list as active item in the MasterDetail view
             */
            this.setFirstItemAsDetail = function () {
                if(self.offer) {
                    var list = self.offer.items;
                    if (list.length > 0){
                        console.log(list);
                        MasterDetailService.notifyController('setDetail',list[0]);
                    }
                }
            };


            /**
             * Uses the {@link ama.services.MailService MailService} to show a mail preview for the current offer.
             * @param {Event} event The event (click) that led to the function call
             */
            this.openMailPreview = function (event) {
                event.preventDefault();
                $scope.mailtext = $scope.getValueFromWysiwyg('mailtext');
                MailService.showPreview('offer',self.offer.id, $scope.mailtext);
            };

            /**
             * Uses the {@link ama.services.MailService MailService} to send a mail with the current offer.
             * Changes the state of the offer to 2 (PDF sent) on success.
             */
            this.send = function () {
                $scope.mailtext = $scope.getValueFromWysiwyg('mailtext');
                MailService.send('offer',self.offer.id, $scope.mailtext).then(function (data) {
                    changeState(2);
                });
            };

            /**
             * Deletes an item by given id.
             * @param {id} itemId The id of the item to be deleted
             */
            this.deleteItem = function (itemId) {
                DeleteService('item', itemId).then(function (data) {
                    self.offer.items = data;
                    LocalStorage.setData('offer/'+id, self.offer);
                });
            };

            /**
             * Gets called when the price of an item inside the offer changes.
             * Reloads the offer.
             * @param {Object} item The item that was changed.
             */
            this.priceChanged = function (item) {
                self.loaded = false;
                getOffer();
            };

            /**
             * Generates a stateParams object from the current stateParams for a certain state
             * @param {string} forState The state for which the stateParams should be generated
             * @returns {{referrer: string, referrerParams: {id: ($stateParams.id|*)}, for: string, forId: ($stateParams.id|*)}} The stateParams for the state to be transitioned to, generated from the current stateParams.
             */
            this.getStateParams = function(forState){
                if(forState == 'itemCreation'){
                    return {
                        referrer: 'app.offerDetail',
                        referrerParams: {
                            id: id
                        },
                        for: 'offer',
                        forId: id
                    };
                }
            };



            /**
             * Changes the state of the offer to -1 (client declined)
             */
            this.decline = function(){
                changeState(-1);
            };

            /**
             * Changes the offer's state to 3 (client accepted)
             * Opens a {@link ama.services.NextStepModal NextStepModal}.
             */
            this.accept = function () {
                changeState(3);
                NextStepModal('offer',self.offer);
            };

            /**
             * Gets called when the ordering of the items in the offer was changed.
             * Uses {@link ama.services.ItemService#changeOrdering the changeOrdering() function in the ItemService} to apply the new ordering on the server
             * This changes the global_order property of the items.
             */
            this.orderChanged = function () {
                ItemService.changeOrdering(self.offer.items);
            };

            /**
             * Moves the specified item to another offer by calling {@link ama.services.ItemService#moveItem the moveItem() function in ItemService}
             * @param {Object} item The item to be moved.
             */
            this.moveItem = function (item) {
                ItemService.moveItem(item, 'offer', self.offer.id, self.offer.project.offers);
            };

            /**
             * Removes a given item from the document
             * @param {Object} item The item to be removed
             */
            this.removeItemFromDocument = function(item)
            {
                ItemService.removeItemFromDocument(item, 'offer');
                getOffer();
            };

            /**
             * Deletes the current offer via {@link ama.services.DeleteService DeleteService}
             */
            this.deleteOffer = function () {
                DeleteService('offer', id).then(function () {
                    $state.go('app.projectDetail', {id: self.offer.project.id});
                });
            };
        }
    ]
);