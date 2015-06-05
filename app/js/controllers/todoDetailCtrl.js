app.controller('TodoDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'PanelService',
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, PanelService, $stateParams) {
        var self = this;
        MasterDetailService.setMaster(this);

        var id = $stateParams.id;

        var getTodo = function () {
            self.todo = LocalStorage.getData('todo/'+ id);
            ApiAbstractionLayer('GET', {name:'todo',params: {id:id}}).then(function (data) {
                self.todo = data;
                LocalStorage.setData('todo/'+id, data);
            });
        };
        getTodo();


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

        this.todoItemChanged = function () {
            getTodo();
        }
    }
]);