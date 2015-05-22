app.controller('ItemDetailCtrl', [
    'ApiAbstractionLayer',
    'MasterDetailService',
    'DeleteService',
    '$scope',
    '$timeout',
    function (ApiAbstractionLayer, MasterDetailService, DeleteService, $scope,$timeout) {
        MasterDetailService.setDetail(this);
        var self = this;
        this.detailChanged = function (item, keyboard) {
            self.item = item;
            if(keyboard) {
                $scope.$apply();
            }
            self.time = [];
            ApiAbstractionLayer('GET', {name:'time',params:{forid: self.item.id}}).then(function (data) {
                self.time = data;
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
        }
    }
]);