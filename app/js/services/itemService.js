/**
 * @class ama.services.ItemService
 * # ItemService
 * A service that holds functions to manage items.
 * Remember: the term 'item' refers to a single piece of an offer/contract/list of todos/acceptance/invoice
 */
app.factory('ItemService',[
    'ApiAbstractionLayer',
    'LocalStorage',
    function (ApiAbstractionLayer, LocalStorage) {
        return {
            /**
             * Gets all items of given document
             * @param {string} forType The type of the document (offer/contract/acceptance/invoice)
             * @param {string|int} forId The ID of the document
             * @returns {Array} The list of items of the document
             */
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
            /**
             * Gets an item specified by id
             * @param {string|int} id - The id of the item
             * @returns {Object} the item
             */
            getItem: function (id) {
                var apiObject = {
                    name: 'item',
                    data: {
                        id: id
                    }
                };
                var lsKey = 'item/' + id;
                var item = LocalStorage.getData(lsKey);
                ApiAbstractionLayer('GET', apiObject).then(function (data) {
                    LocalStorage.setData(lsKey, data);
                    return data;
                }, function () {
                    return item;
                });
            },
            /**
             * Binds a bulk of items to a given item container (document)
             * @param {Array} itemIds List of item IDs to be bound
             * @param {string} forType The type of the container (offer/contract/acceptance/invoice/reminder)
             * @param {int|string} forId The Id of the container
             * @returns {promise} A promise containing the answer from the API
             */
            bindItemsToContainer: function (itemIds, forType, forId) {
                var items = itemIds.join(',');
                var apiObject = {
                    name: 'bulk',
                    data: {
                        ids: items,
                        for: forType,
                        forid: forId
                    }
                };
                return ApiAbstractionLayer('POST',apiObject);
            },
            /**
             * Changes the ordering of a given list of items on the server
             * @param {Array} list The ordered list of items
             * @param {boolean} isTodo *Optional.* Set this to true if the todo_order is to be changed
             * @returns {promise} A promise containing the answer from the API
             */
            changeOrdering: function(list,isTodo){
                var setOrder = 'global';
                if(isTodo){
                    setOrder = 'todo';
                }
                var bulkOrder = [];
                for(var i=0; i<list.length; i++){
                    list[i].todo_order = i;
                    bulkOrder.push(list[i].id+':'+i);
                }
                bulkOrder = bulkOrder.join(',');
                return ApiAbstractionLayer('POST', {name:'bulk', data: {order:bulkOrder,setorder:setOrder}});
            }
        }
    }
]);