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