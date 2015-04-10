app.factory('DeleteService', ['ApiAbstractionLayer', 'btfModal', function(ApiAbstractionLayer, btfModal){
    return function (apiAction, id) {
        var modal = btfModal({
            templateUrl: 'templates/modules/deleteDialog.html',
            controller: function(){

                this.accept = function () {
                    ApiAbstractionLayer('DELETE', {name: apiAction, data: {id:id}}).then(function () {
                        modal.deactivate();
                    });
                };

                this.cancel = function () {
                    modal.deactivate();
                };
            },
            controllerAs: 'delete'
        });
        modal.activate();
    };
}]);