/**
 * @class ama.controllers.ItemDetailCtrl
 * Controller for the item detail views.
 *
 * Remember: the term 'item' refers to a single piece of a offer/contract/list of todos/acceptance/invoice
 */
app.controller('ItemDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'DeleteService',
    'PanelService',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, PanelService) {
        MasterDetailService.setDetail(this);

        /**
         * Indicates what panel should be shown in the view
         * @type {integer}
         */
        this.showPage = PanelService.getPanel('items');

        /**
         * Sets the panel to show for the item detail view by using the {@link ama.services.PanelService PanelService}
         * @param {integer} pageNumber The number of the panel to show.
         */
        this.setPage = function (pageNumber) {
            PanelService.setPanel('items', pageNumber);
            self.showPage = PanelService.getPanel('items');
        };

        var self = this;

        var getIsConnected = function () {
            var count = 0;
            if(self.connections)
            {
                if(self.connections.offer && self.connections.offer.id)
                    count++;
                if(self.connections.contract && self.connections.contract.id)
                    count++;
                if(self.connections.todo && self.connections.todo.id)
                    count++;
                if(self.connections.acceptance && self.connections.acceptance.id)
                    count++;
                if(self.connections.invoice && self.connections.invoice.id)
                    count++;
            }
            return count>1;

        };

        /**
         * /**
         * Reacts on a change of the item detail. Triggered by the {@link ama.directives.masterDetail masterDetail directive}.
         * Re-initializes the detail view
         * @param {Object} item The newly selected item
         * @param {boolean} keyboard Indicates if the selection was taken by keyboard input
         */
        this.detailChanged = function (item, keyboard) {
            self.item = item;

            self.time = LocalStorage.getData('item/'+self.item.id+'/time') || [];
            ApiAbstractionLayer('GET', {name:'time',params:{forid: self.item.id}}).then(function (data) {
                self.time = data;
                LocalStorage.setData('item/'+self.item.id+'/time', data);
            });

            self.connections = LocalStorage.getData('item/'+self.item.id+'/connections')
            ||
            {
                offer:{},
                contract: {},
                todo: {},
                acceptance: {},
                invoice: {}
            };
            self.isConnected = getIsConnected();
            ApiAbstractionLayer('GET',{name:'item_connection', params:{id:self.item.id}}).then(function (data) {
                self.connections = data;
                self.isConnected = getIsConnected();
                LocalStorage.setData('item/'+self.item.id+'/connections',data);
            });
        };


        /**
         * Deletes the current item by notifying the master controller via {@link ama.services.MasterDetailService#notifyMaster the MasterDetailService}.
         */
        this.deleteItem = function () {
            MasterDetailService.notifyMaster('deleteItem', self.item.id);
        };

        /**
         * Changes the useRate value (fixed/hourly/dailyRate) of the current item.
         * @param {integer} value The value the userate property of the item should be set to
         */
        this.changeUseRate = function (value) {
            var apiObject = {
                name: 'item',
                data: {
                    id: self.item.id,
                    userate: value
                }
            };
            self.item.userate = value;
            ApiAbstractionLayer('POST', apiObject).then(function (data) {
                MasterDetailService.notifyMaster('priceChanged', data);
            });

        };

        /**
         * Set a start time in the time API
         */
        this.startTime = function () {
            ApiAbstractionLayer('POST',{name:'time', data: {item: self.item.id}}).then(function (data) {
                self.time.times.push(data);
            });
        };

        /**
         * Stops the timer with the given id
         * @param {integer} id The ID of the timer to be stopped
         */
        this.stopTime = function (id) {
            ApiAbstractionLayer('POST', {name: 'time', data:{id:id,endnow:true}}).then(function (data) {
                for(var i = 0; i<self.time.times.length; i++){
                    if(self.time.times[i].id == data.id){
                        self.time.times[i] = data;
                        break;
                    }
                }
            });
        };

        /**
         * Deletes a timer by given ID
         * @param {integer} id The ID of the timer to be deleted.
         */
        this.deleteTime = function (id) {
            DeleteService('time', {id:id,forid:self.item.id}).then(function (data) {
                self.time.times = data;
            });
        };

        /**
         * Moves the current item to another document.
         */
        this.moveItem = function () {
            // TODO: this
        };


    }
]);