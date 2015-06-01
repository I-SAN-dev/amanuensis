app.factory('NextStepModal', [
    'ItemContainerService',
    'btfModal',
    '$state',
    function (ItemContainerService, btfModal, $state) {
        var offer = {
            name: 'offer.name',
            api: 'offer',
            stateName: 'app.offerDetail'
        };
        var contract = {
            name: 'contract.name',
            api: 'contract',
            stateName: 'app.contractDetail'
        };
        var todo = {
            name: 'todo.name',
            api: 'todo',
            stateName: 'app.todoDetail'
        };
        var acceptance = {
            name: 'acceptance.name',
            api: 'acceptance',
            stateName: 'app.acceptanceDetail'
        };
        var invoice = {
            name: 'invoice.name',
            api: 'invoice',
            stateName: 'app.invoiceDetail'
        };
        var reminder = {
            name: 'reminder.name',
            api: 'reminder',
            stateName: 'app.reminderDetail'
        };

        var others = function (type) {
            switch (type){
                case 'offer':
                    return [contract,todo,acceptance,invoice];
                case 'contract':
                    return [todo,acceptance,invoice];
                case 'todo':
                    return [acceptance,invoice];
                case 'invoice':
                    return [reminder];
                default :
                    return [];
            }
        };
        return function (type, object) {
            var modal = btfModal(
                {
                    templateUrl: 'templates/modules/nextStepModal.html',
                    controller: ['$scope', '$filter', function($scope, $filter){
                        var self = this;
                        this.before = object;
                        this.options = others(type);
                        this.selected = this.options[0];
                        var getPrefix = function (name) {
                            return '['+ $filter('translate')(name) +'] ';
                        };
                        var prefix = getPrefix(this.selected.name);
                        this.name = prefix + object.name;
                        this.select = function (selected, keyboard) {
                            self.selected = selected;
                            var newPrefix = getPrefix(selected.name);
                            if(self.name.substr(0,prefix.length)==prefix)
                                self.name = newPrefix + self.name.substr(prefix.length);
                            prefix = newPrefix;
                            if(keyboard) {
                                $scope.$apply();
                            }
                        };
                        this.transform = function() {
                            var newItemContainer = angular.copy(object);
                            delete newItemContainer.id;
                            delete newItemContainer.state;
                            delete newItemContainer.path;
                            newItemContainer.project = object.project.id;
                            ItemContainerService.createItemContainer(this.selected.api, object.project.id, newItemContainer).then(function (data) {
                                modal.deactivate();
                                $state.go(self.selected.stateName,{id:data.id});
                            });
                        };
                        this.close = function () {
                            modal.deactivate();
                        };
                    }],
                    controllerAs: 'next'
                }
            );
            modal.activate();
        };
    }
]);