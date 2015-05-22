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

            self.connections = LocalStorage.getData('item/'+self.item.id+'/connections')||[];
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

        var timer = function (index) {
            return $timeout(function () {
                self.time[index].duration += 1;
                timer(index);
            },1000);
        };
        var timeouts = [];
        this.startTime = function () {
            ApiAbstractionLayer('POST',{name:'time', data: {item: self.item.id}}).then(function (data) {
                self.time.duration = 0;
                self.time.push(data);
                timeouts[self.time.length-1] = timer(self.time.length-1);
            });
        };

        this.stopTime = function (id) {
            ApiAbstractionLayer('POST', {name: 'time', data:{id:id,endnow:true}}).then(function (data) {
                for(var i = 0; i<self.time.length; i++){
                    if(self.time[i].id == data.id){
                        self.time[i] = data;
                        timeouts[i].cancel();
                        break;
                    }
                }
            });
        };
        
        this.deleteTime = function (id) {
            DeleteService('time', {id:id,forid:self.item.id}).then(function (data) {
                self.time = data;
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

            return count>1;

        }
    }
]);