app.factory('ItemService',[
    'ApiAbstractionLayer',
    'LocalStorage',
    function (ApiAbstractionLayer, LocalStorage) {
        return {
            getItems: function(forType, forId) {
                var apiObject = {
                    name: 'item',
                    params: {
                        for: forType,
                        forid: forId
                    }
                };
                var lsKey = 'items';
                if(forType)
                    lsKey = lsKey+'/'+forType;
                if(forId)
                    lsKey = lsKey+'/'+forId;
                var items = LocalStorage.getData(lsKey);

                ApiAbstractionLayer('GET', apiObject).then(function (data) {
                    LocalStorage.setData(lsKey, data);
                    return data;
                }, function () {
                    return items;
                });
            },
            getItem: function (id) {
                var apiObject = {
                    name: 'item',
                    data: {
                        id: id
                    }
                };
                var lsKey = 'item/'+id;
                var item = LocalStorage.getData(lsKey);
                ApiAbstractionLayer('GET', apiObject).then(function (data) {
                    LocalStorage.setData(lsKey, data);
                    return data;
                }, function () {
                    return item;
                });
            }
        }
    }
]);