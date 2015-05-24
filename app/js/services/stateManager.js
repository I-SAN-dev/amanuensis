app.factory('StateManager',[
    'ApiAbstractionLayer',
    'LocalStorage',
    '$q',
    function (ApiAbstractionLayer, LocalStorage, $q) {
        return {
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