/**
 * @class ama.services.ItemContainerService
 * # ItemContainerService
 * Holds functions to manage documents that have items associated (item containers).
 *
 * Remember: the term 'item' refers to a single piece of an offer/contract/list of todos/acceptance/invoice
 */
app.factory('ItemContainerService',[
    'ApiAbstractionLayer',
    'LocalStorage',
    'DeleteService',
    '$filter',
    '$q',
    '$state',
    function (ApiAbstractionLayer, LocalStorage, DeleteService, $filter, $q, $state) {
        var containerMap = {
            offer: 'offers',
            contract: 'contracts',
            fileContract: 'fileContracts',
            acceptance: 'acceptances',
            invoice: 'invoices'
        };
        var updateLocalStorage = function (type, projectId, container) {
            LocalStorage.setData(type+'/'+container.id, container);

            var project = LocalStorage.getData('project/'+projectId);
            if(project) {
                var list = project[containerMap[type]] || [];
                list.push(container);
                LocalStorage.setData('project/' + projectId, project);
            }
        };
        return {
            /**
             * Creates an item container of given type for a given project
             * @param {string} type One of: 'offer', 'contract', 'accepatance', 'invoice', 'reminder'
             * @param {string|int} projectId The id of the current project
             * @param {Object} newContainer The new item container to be posted to the API.
             * @returns {promise} A promise containing the newly crated item container or an error object.
             */
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
                    // go to the new document
                    var to = $filter('amaStates')(type, 'apiToState');
                    var toParams = {id:data.id, type: type};
                    $state.go(to, toParams);
                    defer.resolve(data);
                });
                return defer.promise;
            },
            /**
             * Updates the {@link ama.services.LocalStorage local storage} entry of an given item container
             * @param {string} type The type of the given item container (offer/contract/acceptance/invoice/reminder)
             * @param {int|string} projectId The ID of the current project
             * @param {object} container The container to update the entry for
             */
            updateLocalStorage: function (type, projectId, container) {
                updateLocalStorage(type, projectId, container);
            }
        }
    }

]);