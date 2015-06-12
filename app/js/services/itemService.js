/**
 * @class ama.services.ItemService
 * # ItemService
 * A service that holds functions to manage items.
 * Remember: the term 'item' refers to a single piece of an offer/contract/list of todos/acceptance/invoice
 */
app.factory('ItemService',[
    'ApiAbstractionLayer',
    'LocalStorage',
    'btfModal',
    '$state',
    function (ApiAbstractionLayer, LocalStorage, btfModal, $state) {

        var sortNumber = function (a,b) {
            return a-b;
        };

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
                if(itemIds.length>0) {
                    var items = itemIds.join(',');
                    var apiObject = {
                        name: 'bulk',
                        data: {
                            ids: items,
                            for: forType,
                            forid: forId
                        }
                    };
                    return ApiAbstractionLayer('POST', apiObject);
                }
            },
            /**
             * Changes the ordering of a given list of items on the server
             * @param {Array} list The ordered list of items
             * @param {boolean} [isTodo] *Optional.* Set this to true if the todo_order is to be changed
             * @returns {promise} A promise containing the answer from the API
             */
            changeOrdering: function(list,isTodo){
                var bulkOrder = [];
                var setOrder = 'global';
                if(isTodo){
                    setOrder = 'todo';

                    for(var i=0; i<list.length; i++){
                        list[i].todo_order = i;
                        bulkOrder.push(list[i].id+':'+i);
                    }
                }
                else
                {
                    /* preserve existing order numbers*/
                    var orderNumbers = [];
                    for(var j = 0; j<list.length; j++)
                    {
                        orderNumbers.push(parseInt(list[j].global_order));
                    }
                    /* make order numbers unique and sort them*/
                    orderNumbers = orderNumbers.sort(sortNumber).filter(function(item, pos, ary){
                        return !pos || item != ary[pos-1];
                    });
                    /* refill the orderNumbers, necessary if there where duplicates*/
                    var difference = list.length - orderNumbers.length;
                    for(var k = 0; k < difference; k++)
                    {
                        orderNumbers.push(orderNumbers[orderNumbers.length-1] + 1)
                    }

                    /* assign the new order numbers */
                    for(var l=0; l<list.length; l++){
                        list[l].global_order = orderNumbers[l];
                        bulkOrder.push(list[l].id+':'+orderNumbers[l]);
                    }
                }

                bulkOrder = bulkOrder.join(',');
                return ApiAbstractionLayer('POST', {name:'bulk', data: {order:bulkOrder,setorder:setOrder}});
            },
            moveItem: function(item, containerType, containerId, availableContainers){
                for(var i = 0; i<availableContainers.length; i++){
                    if(availableContainers[i].id == containerId){
                        availableContainers.splice(i,1);
                        break;
                    }
                }
                var modal = btfModal({
                    templateUrl: 'templates/pages/items/moveDialog.html',
                    controller: function(){
                        var ctrl = this;
                        this.available = availableContainers;
                        this.type = containerType;

                        this.accept = function () {
                            if(ctrl.selected){
                                var apiObject = {
                                    name: 'item',
                                    data: {
                                        id: item.id
                                    }
                                };
                                apiObject.data[containerType] = ctrl.selected;
                                ApiAbstractionLayer('POST', apiObject).then(function (data) {
                                    LocalStorage.setData('item/'+item.id, data);
                                    $state.go('app.'+containerType+'Detail',{id:ctrl.selected});
                                });
                            }
                            modal.deactivate();
                        };


                        this.close = function () {
                            console.log('close');
                            modal.deactivate();
                        };
                    },
                    controllerAs: 'move'
                });
                modal.activate();
            }
        }
    }
]);