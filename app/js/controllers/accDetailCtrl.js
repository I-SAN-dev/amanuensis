/**
 * @class ama.controllers.AcceptanceDetailCtrl
 * Controller for the acceptances overview page
 * @author Christian Baur <c.baur@i-san.de>
 */
app.controller('AcceptanceDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'PdfService',
    '$stateParams',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, PdfService, $stateParams){
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



    }]);