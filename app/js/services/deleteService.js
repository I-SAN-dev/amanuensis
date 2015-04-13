app.factory('DeleteService',
    [
        'ApiAbstractionLayer',
        'btfModal',
        '$q',
        'LocalStorage',
        function(ApiAbstractionLayer, btfModal, $q, LocalStorage){
    return function (apiAction, id) {
        var defer = $q.defer();
        var modal = btfModal({
            templateUrl: 'templates/modules/deleteDialog.html',
            controller: function(){

                this.accept = function () {
                    ApiAbstractionLayer('DELETE', {name: apiAction, data: {id:id}}).then(function (data) {
                        modal.deactivate();
                        LocalStorage.removeItem(apiAction+'/'+id);
                        defer.resolve(data);
                    });
                };

                this.cancel = function () {
                    modal.deactivate();
                    defer.reject();
                };
            },
            controllerAs: 'delete'
        });
        modal.activate();
        return defer.promise;
    };
}]);