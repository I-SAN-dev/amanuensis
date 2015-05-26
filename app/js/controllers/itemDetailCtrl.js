app.controller('ItemDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'DeleteService',
    '$scope',
    '$timeout',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, DeleteService, $scope,$timeout) {
        MasterDetailService.setDetail(this);
        var self = this;
        this.detailChanged = function (item, keyboard) {
            self.item = item;
            if(keyboard) {
                $scope.$apply();
            }

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


        this.deleteItem = function () {
            MasterDetailService.notifyMaster('deleteItem', self.item.id);
        };
        this.changeUseRate = function () {
            var apiObject = {
                name: 'item',
                data: {
                    id: self.item.id,
                    userate: self.item.userate
                }
            };
            ApiAbstractionLayer('POST', apiObject).then(function (data) {
                MasterDetailService.notifyMaster('priceChanged', data);
            });
        };

        this.startTime = function () {
            ApiAbstractionLayer('POST',{name:'time', data: {item: self.item.id}}).then(function (data) {
                self.time.times.push(data);
            });
        };

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
        
        this.deleteTime = function (id) {
            DeleteService('time', {id:id,forid:self.item.id}).then(function (data) {
                self.time.times = data;
            });
        };

        var getIsConnected = function () {
            var count = 0;
            if(self.connections.offer.id)
                count++;
            if(self.connections.contract.id)
                count++;
            if(self.connections.todo.id)
                count++;
            if(self.connections.acceptance.id)
                count++;
            if(self.connections.invoice.id)
                count++;

            console.log(count);
            return count>1;

        };

        this.moveItem = function () {
            // TODO: this
        };

        // set the first element of the list active
        if($scope.masterList.length > 0)
            MasterDetailService.setDetailView($scope.masterList[0]);

    }
]);