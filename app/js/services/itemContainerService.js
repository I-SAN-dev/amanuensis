app.factory('ItemContainerService',[
    'ApiAbstractionLayer',
    'LocalStorage',
    '$filter',
    '$q',
    function (ApiAbstractionLayer, LocalStorage,$filter, $q) {
        var containerMap = {
            offer: 'offers',
            contract: 'contracts',
            acceptance: 'acceptances',
            invoice: 'invoices',
            reminder: 'reminders'
        };
        return {
            createItemContainer: function(type, projectId, newContainer) {
                var defer = $q.defer();
                var date = new Date;
                newContainer.date = $filter('date')(date,'yyyy-MM-dd HH:mm:ss');

                var apiObject = {
                    name: type,
                    data: newContainer
                };
                ApiAbstractionLayer('POST', apiObject).then(function (data) {
                    LocalStorage.setData('contract/'+data.id, data);

                    var project = LocalStorage.getData('project/'+projectId);
                    var list = project[containerMap[type]] || [];
                    list.push(data);
                    LocalStorage.setData('project/'+projectId, project);
                    defer.resolve(data);
                });
                return defer.promise;
            }
        }
    }

]);