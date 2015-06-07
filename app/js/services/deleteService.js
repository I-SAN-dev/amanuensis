/**
 * @class ama.services.DeleteService
 * # DeleteService
 * Opens a modal that asks the user if he/she wants to delete something. Deletes that thing after the user confirms.
 *
 * @param {string} apiAction The name of the apiAction (i.e. 'invoice', if an invoice shall be deleted)
 * @param {int|string|Object} The ID of the object to be deleted. If given as object, it can also contain additional parameters for the API.
 * @returns {promise} A promise containing the API's answer after the deletion or nothing if the user cancelled the deletion.
 */
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