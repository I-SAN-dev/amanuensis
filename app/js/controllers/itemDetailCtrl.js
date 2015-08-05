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
    'ItemContainerService',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, PanelService, ItemContainerService) {
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

        this.getTime = function () {
            self.time = LocalStorage.getData('item/'+self.item.id+'/time') || [];
            ApiAbstractionLayer('GET', {name:'time',params:{forid: self.item.id}}).then(function (data) {
                self.time = data;
                LocalStorage.setData('item/'+self.item.id+'/time', data);
            });
        };

        /**
         * /**
         * Reacts on a change of the item detail. Triggered by the {@link ama.directives.masterDetail masterDetail directive}.
         * Re-initializes the detail view
         * @param {Object} item The newly selected item
         * @param {boolean} [keyboard] Indicates if the selection was taken by keyboard input
         */
        this.detailChanged = function (item, keyboard) {
            self.item = item;

            self.getTime();


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
         * Updates the time property of the item by a given object
         * @param {object} data Contains a times array and the totaltime (as provided by the time API)
         */
        var updateTime = function (data) {
            self.time.times = data.times;
            self.time.totaltime = data.totaltime;
        };

        /**
         * Set a start time in the time API
         */
        this.startTime = function () {
            ApiAbstractionLayer('POST',{name:'time', data: {item: self.item.id}}).then(function (data) {
                updateTime(data);
            });
        };

        /**
         * Stops the timer with the given id
         * @param {integer} id The ID of the timer to be stopped
         */
        this.stopTime = function (id) {
            ApiAbstractionLayer('POST', {name: 'time', data:{id:id,endnow:true}}).then(function (data) {
                updateTime(data);
            });
        };

        /**
         * Deletes a timer by given ID
         * @param {integer} id The ID of the timer to be deleted.
         */
        this.deleteTime = function (id) {
            DeleteService('time', {id:id,forid:self.item.id}).then(function (data) {
                updateTime(data);
            });
        };

        /**
         * Sets the current totaltime from the time recording as the time for price calculation with hourly rates
         */
        this.setTotaltimeAsTime = function () {
            self.item.hourlyrates = self.time.totaltime;
            ApiAbstractionLayer('POST', {name:'item', data: self.item}).then(function(data){
                self.item = data;
                MasterDetailService.notifyMaster('priceChanged', data);
            });
        };

        /**
         * Moves the current item to another document by notifying the master ({@link ama.directives.MasterDetail see MasterDetail directive}).
         */
        this.moveItem = function () {
            MasterDetailService.notifyMaster('moveItem', self.item);
        };

        /**
         * Removes an item from the current document
         */
        this.removeItemFromDocument = function()
        {
            MasterDetailService.notifyMaster('removeItemFromDocument', self.item);
        };

        MasterDetailService.notifyController('setFirstAsDetail');

    }
]);