app.controller('TodoCreationCtrl', [
    'ItemContainerService',
    '$state',
    '$stateParams',
    function (ItemContainerService,$state,$stateParams) {
        var self = this;
        var project = $stateParams.project;
        var projectId = project.id;
        this.projectName = project.name;
        this.newTodo = {
            project: projectId
        };
        this.createTodo = function () {
            ItemContainerService.createItemContainer('todo',projectId,self.newTodo).then(function (data) {
                $state.go('app.todoDetail',{id:data.id});
            });
        }
    }
]);