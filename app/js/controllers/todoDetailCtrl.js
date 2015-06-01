app.controller('TodoDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, $stateParams) {
        var self = this;
        var id = $stateParams.id;
        this.todo = LocalStorage.getData('todo/'+ id);
        ApiAbstractionLayer('GET', {name:'todo',params: {id:id}}).then(function (data) {
            self.todo = data;
        })
    }
]);