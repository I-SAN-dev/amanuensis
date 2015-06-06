/**
 * @class ama.controllers.TodoCreationCtrl
 * Controller for the todolist creation view
 */
app.controller('TodoCreationCtrl', [
    'ItemContainerService',
    'ErrorDialog',
    '$state',
    '$stateParams',
    function (ItemContainerService,ErrorDialog,$state,$stateParams) {
        var self = this;
        if(!$stateParams.project){
            ErrorDialog({code:'1337',languagestring:'errors.noProjectSpecified'}).activate();
            $state.go('app.dashboard')
        }
        var project = $stateParams.project;
        var projectId = project.id;
        /**
         * Name of the current project (derived from stateParams)
         * @type {string}
         */
        this.projectName = project.name;

        /**
         * The todolist to be created
         * @type {{project: *}}
         */
        this.newTodo = {
            project: projectId
        };

        /**
         * Creates a new todoList in the current project
         */
        this.createTodo = function () {
            ItemContainerService.createItemContainer('todo',projectId,self.newTodo).then(function (data) {
                $state.go('app.todoDetail',{id:data.id});
            });
        }
    }
]);