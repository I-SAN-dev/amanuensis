/**
 * @class ama.services.StateManager
 * # StateManager
 * Holds functions to manage document states.
 */
app.factory('StateManager',[
    'ApiAbstractionLayer',
    'LocalStorage',
    '$q',
    function (ApiAbstractionLayer, LocalStorage, $q) {
        return {
            /**
             * Sets a new state for a given document
             * @param {string} type The type of document
             * @param {int|string} id The ID of the document
             * @param {int|string} state The status code of the desired new state
             * @returns {promise} A promise containing the changed document or an error object
             */
            setState: function(type, id, state){
                var defer = $q.defer();
                ApiAbstractionLayer('POST',{name:type, data:{id: id, state:state}}).then(function (data) {
                    LocalStorage.setData(type+'/'+id, data);
                    defer.resolve(data);
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            }
        }
    }
]);