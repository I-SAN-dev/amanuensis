/**
 * Controller for the contractDetail page
 */
app.controller('ContractDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'PdfService',
    '$stateParams',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, PdfService, $stateParams){
        var self = this;
        var id = $stateParams.id;
        MasterDetailService.setMaster(this);
        this.contract = LocalStorage.getData('contract/'+id);
        ApiAbstractionLayer('GET',{name:'contract',params: {id:id}}).then(function (data) {
            LocalStorage.setData('contract/'+id, data);
            self.contract = data;
        });

        this.viewPdf = function (event,preview,path) {
            PdfService(event,preview,'contract',id, path).then(function (data) {
                if(data){
                    self.acceptance.path = data.path;
                    self.acceptance.state = 1;
                    LocalStorage.setData('contract/'+id,self.acceptance);
                }
            });
        };



    }]);