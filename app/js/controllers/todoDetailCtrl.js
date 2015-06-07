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
    '$stateParams',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, PanelService, $stateParams) {
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
        }
    }
]);