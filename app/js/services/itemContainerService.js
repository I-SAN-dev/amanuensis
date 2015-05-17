app.factory('ItemContainerService',[
    'ApiAbstractionLayer',
    'LocalStorage',
    '$filter',
    '$q',
    function (ApiAbstractionLayer, LocalStorage,$filter, $q) {
        var containerMap = {
            offer: 'offers',
            contract: 'contracts',
            fileContract: 'fileContracts',
            acceptance: 'acceptances',
            invoice: 'invoices',
            reminder: 'reminders'
        };
        var updateLocalStorage = function (type, projectId, container) {
            LocalStorage.setData(type+'/'+container.id, container);

            var project = LocalStorage.getData('project/'+projectId);
            var list = project[containerMap[type]] || [];
            list.push(container);
            LocalStorage.setData('project/'+projectId, project);

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
                    updateLocalStorage(type,projectId,data);
                    defer.resolve(data);
                });
                return defer.promise;
            },
            updateLocalStorage: function (type, projectId, container) {
                updateLocalStorage(type, projectId, container);
            }
        }
    }

]);