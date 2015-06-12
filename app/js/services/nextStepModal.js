/**
 * @class ama.services.NextStepModal
 * # NextStepModal
 * Shows a modal asking the user what to do next (i.e. when an offer is accepted)
 *
 * @param {string} type The type of document of which the state just changed
 * @param {Object} object The document
 */
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
            stateName: 'app.contractDetail',
            additionalParams: {
                type: 'contract'
            }
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
                    controller: ['RefnumberService','ItemService', '$scope', '$filter', function(RefnumberService, ItemService, $scope, $filter){
                        var self = this;
                        this.copyItems = true;
                        this.before = object;
                        this.options = others(type);
                        this.selected = this.options[0];
                        var getPrefix = function (name) {
                            return '['+ $filter('translate')(name) +'] ';
                        };
                        var prefix = getPrefix(this.selected.name);
                        this.name = prefix + object.name;
                        if(this.selected.api != 'todo'){
                            RefnumberService(this.selected.api+'s',object.project.id).then(function (data) {
                                $scope.refnumber = data.refnumber;
                            });
                        }

                        this.select = function (selected, keyboard) {
                            self.selected = selected;
                            var newPrefix = getPrefix(selected.name);
                            if(self.name.substr(0,prefix.length)==prefix)
                                self.name = newPrefix + self.name.substr(prefix.length);
                            prefix = newPrefix;
                            if(selected.api != 'todo') {
                                RefnumberService(selected.api + 's', object.project.id).then(function (data) {
                                    $scope.refnumber = data.refnumber;
                                });
                            }
                            if(keyboard) {
                                $scope.$apply();
                            }
                        };
                        this.transform = function() {
                            var newItemContainer = angular.copy(object);
                            delete newItemContainer.id;
                            delete newItemContainer.description;
                            delete newItemContainer.state;
                            delete newItemContainer.path;
                            newItemContainer.name = self.name;
                            newItemContainer.refnumber = $scope.refnumber;
                            newItemContainer.project = object.project.id;

                            var itemsToCopy = [];
                            for(var i = 0; i<object.items.length; i++){
                                itemsToCopy.push(object.items[i].id);
                            }


                            ItemContainerService.createItemContainer(this.selected.api, object.project.id, newItemContainer).then(function (data) {
                                if(self.copyItems)
                                    ItemService.bindItemsToContainer(itemsToCopy, self.selected.api, data.id);
                                modal.deactivate();
                                var stateParams = {id:data.id};
                                if(self.selected.additionalParams)
                                    stateParams = angular.extend(stateParams,self.selected.additionalParams);
                                $state.go(self.selected.stateName,stateParams);
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