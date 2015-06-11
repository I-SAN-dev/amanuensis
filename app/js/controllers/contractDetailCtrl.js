/**
 * @class ama.controllers.ContractDetailCtrl
 * Controller for the contractDetail page
 */
app.controller('ContractDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'PdfService',
    'ItemService',
    '$stateParams',
    '$sce',
    "constants",
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, PdfService, ItemService, $stateParams, $sce, constants){
        var self = this;
        var id = $stateParams.id;
        var type = this.type = $stateParams.type;
        /**
         * Indicates if current project is fileContract (which cannot contain amanu items) or a amanu contract
         * @type {boolean}
         */
        this.isFileContract = type == 'fileContract';
        MasterDetailService.setMaster(this);
        /**
         * The contract.
         * @type {Object}
         */
        this.contract = LocalStorage.getData(type+'/'+id);
        ApiAbstractionLayer('GET',{name:type,params: {id:id}}).then(function (data) {
            LocalStorage.setData(type+'/'+id, data);
            self.contract = data;
            if(self.isFileContract){
                self.fileName = data.path.replace(/\\/g,'/').replace( /.*\//, '' ); /* Use filename instead of refnumber */
                self.iframeSrc = $sce.trustAsResourceUrl(constants.URL+'/api/?action=protectedpdf&path='+data.path);
            }
        });

        /**
         * Uses the {@link ama.services.PdfService PdfService} to show either a PDF preview
         * or the generated PDF of the contract
         * @param {Event} event The event (commonly 'click') that triggered the function call
         * @param {bool} preview Indicates if a preview or the generated PDF should be shown
         * @param {String} [path] *optional* Path to the generated PDF
         */
        this.viewPdf = function (event,preview,path) {
            PdfService(event,preview, type,id, path).then(function (data) {
                if(data){
                    self.contract.path = data.path;
                    LocalStorage.setData('contract/'+id,self.contract);
                }
            });
        };

        /**
         * Gets called when the ordering of the items in the contract was changed.
         * Uses {@link ama.services.ItemService#changeOrdering the changeOrdering() function in the ItemService} to apply the new ordering on the server
         * This changes the global_order property of the items.
         */
        this.orderChanged = function () {
            ItemService.changeOrdering(self.contract.items);
        }



    }]);