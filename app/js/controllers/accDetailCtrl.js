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
    '$stateParams',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, ItemService, PdfService, $stateParams){
        var self = this;
        var id = $stateParams.id;
        MasterDetailService.setMaster(this);
        /**
         * The acceptance that was loaded from the API or the LocalStorage
         * @type {Object}
         */
        this.acceptance = LocalStorage.getData('acceptance/'+id);
        ApiAbstractionLayer('GET',{name:'acceptance',params: {id:id}}).then(function (data) {
            LocalStorage.setData('acceptance/'+id, data);
            self.acceptance = data;
        });

        /**
         * Uses the {@link ama.services.PdfService PdfService} to show either a PDF preview
         * or the generated PDF of the acceptance
         * @param {Event} event The event (commonly 'click') that triggered the function call
         * @param {bool} preview Indicates if a preview or the generated PDF should be shown
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


    }]);