app.factory('DeleteService',
    [
        'ApiAbstractionLayer',
        'btfModal',
        '$q',
        'LocalStorage',
        'ErrorDialog',
        function(ApiAbstractionLayer, btfModal, $q, LocalStorage, ErrorDialog){
    return function (apiAction, id) {
        var data = {id:id};
        if(typeof(id) === "object") {
            data = id;
        }
        var defer = $q.defer();
        var modal = btfModal({
            templateUrl: 'templates/modules/deleteDialog.html',
            controller: function(){

                this.accept = function () {
                    ApiAbstractionLayer('DELETE', {name: apiAction, data: data}, true).then(function (data) {
                        modal.deactivate();
                        LocalStorage.removeItem(apiAction+'/'+id);
                        defer.resolve(data);
                    }, function (data) {
                        modal.deactivate();
                        ErrorDialog(data.error).activate();
                        defer.reject(data);
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