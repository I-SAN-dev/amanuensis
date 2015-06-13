/**
 * @class ama.controllers.TodoDetailCtrl
 *
 * Controller for the todoDetail view.
 */
app.controller('TodoDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'PanelService',
    'ItemService',
    'DeleteService',
    '$state',
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, PanelService, ItemService, DeleteService, $state, $stateParams) {
        var self = this;
        MasterDetailService.setMaster(this);
        PanelService.setPanel('items',2);

        var id = $stateParams.id;

        var getTodo = function () {
            self.todo = LocalStorage.getData('todo/'+ id);
            ApiAbstractionLayer('GET', {name:'todo',params: {id:id}}).then(function (data) {
                self.todo = data;
                LocalStorage.setData('todo/'+id, data);
            });
        };
        getTodo();

        /**
         *
         */
        this.nextStep = function()
        {
            alert('TODO: create acceptance or invoice');
        };

        /**
         * Generates a stateParams object from the current stateParams for a certain state
         * @param {string} forState The state for which the stateParams should be generated
         * @returns {{referrer: string, referrerParams: {id: ($stateParams.id|*)}, for: string, forId: ($stateParams.id|*)}} The stateParams for the state to be transitioned to, generated from the current stateParams.
         */
        this.getStateParams = function(forState){
            if(forState == 'itemCreation'){
                return {
                    referrer: 'app.todoDetail',
                    referrerParams: {
                        id: id
                    },
                    for: 'todo',
                    forId: id
                };
            }
        };

        /**
         * Reloads the todoList
         */
        this.todoItemChanged = function () {
            getTodo();
        };

        /**
         * Gets called when the ordering of the items in the todolist was changed.
         * Uses {@link ama.services.ItemService#changeOrdering the changeOrdering() function in the ItemService} to apply the new ordering on the server
         * This changes the todo_order property of the items.
         */
        this.orderChanged = function () {
            ItemService.changeOrdering(self.todo.items, true);
        };

        /**
         * Moves the specified item to another todolist by calling {@link ama.services.ItemService#moveItem the moveItem() function in ItemService}
         * @param {Object} item The item to be moved.
         */
        this.moveItem = function (item) {
            ItemService.moveItem(item, 'todo', self.todo.id, self.todo.project.todos);
        };

        /**
         * Removes a given item from the document
         * @param {Object} item The item to be removed
         */
        this.removeItemFromDocument = function(item)
        {
            ItemService.removeItemFromDocument(item, 'todo');
            getTodo();
        };

        /**
         * Deletes the current todolist via {@link ama.services.DeleteService DeleteService}
         */
        this.deleteTodo = function () {
            DeleteService('todo', id).then(function () {
                $state.go('app.projectDetail', {id: self.todo.project.id});
            });
        };
    }
]);