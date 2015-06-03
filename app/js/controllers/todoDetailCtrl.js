app.controller('TodoDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, $stateParams) {
        var self = this;
        MasterDetailService.setMaster(this);
        var id = $stateParams.id;
        this.todo = LocalStorage.getData('todo/'+ id);
        ApiAbstractionLayer('GET', {name:'todo',params: {id:id}}).then(function (data) {
            self.todo = data;
        });


        self.nextStep = function()
        {
            alert('TODO: create acceptance or invoice');
        }
    }
]);