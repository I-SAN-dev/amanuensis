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


        this.nextStep = function()
        {
            alert('TODO: create acceptance or invoice');
        };

        this.getStateParams = function(forState){
            if(forState == 'itemCreation'){
                return {
                    referrer: 'app.todoDetail',
                    referrerParams: {
                        id: id
                    },
                    for: 'todo',
                    forId: id
                };
            }
        };
    }
]);