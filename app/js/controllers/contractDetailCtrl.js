/**
 * Controller for the contractDetail page
 */
app.controller('ContractDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'PdfService',
    '$stateParams',
    '$sce',
    function(ApiAbstractionLayer, LocalStorage, MasterDetailService, PdfService, $stateParams, $sce){
        var self = this;
        var id = $stateParams.id;
        var type = $stateParams.type;
        this.isFileContract = type == 'fileContract';
        MasterDetailService.setMaster(this);
        this.contract = LocalStorage.getData(type+'/'+id);
        ApiAbstractionLayer('GET',{name:type,params: {id:id}}).then(function (data) {
            LocalStorage.setData(type+'/'+id, data);
            self.contract = data;
            if(self.isFileContract){
                self.iframeSrc = $sce.trustAsResourceUrl('api/?action=protectedpdf&path='+data.path);
            }
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