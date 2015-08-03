/**
 * @class ama.controllers.ClientDetailCtrl
 * Controller for the client detail view.
 */
app.controller('ClientDetailCtrl',
    ['ApiAbstractionLayer',
        'LocalStorage',
        '$scope',
        '$stateParams',
        'DeleteService',
        'MasterDetailService',
        'PanelService',
        'btfModal',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams, DeleteService, MasterDetailService, PanelService, btfModal) {

            var self = this;

            /**
             * @type {integer}
             * Indicates which panel should be shown. Initially set by the {@link ama.services.PanelService PanelService}
             */
            this.showPage = PanelService.getPanel('clients');

            MasterDetailService.setDetail(this);

            /**
             * A list of available genders with their respective id ('f' for female, 'm' for male)
             * @type {{name: string, id: string}[]}
             */
            this.genders = [
                {
                    name: 'clients.contactGender.male',
                    id: 'm'
                },
                {
                    name: 'clients.contactGender.female',
                    id: 'f'
                }
            ];

            var calls = 0;

            /**
             * Gets a client from the API
             * @param {integer} id The client id to query for
             */
            var getClient = function(id) {
                self.client = LocalStorage.getData('client'+'/'+id);
                ApiAbstractionLayer('GET', {name:'client', params: {id:id}}).then(function (data) {
                    LocalStorage.setData('client'+'/'+id, data);
                    self.client = data;
                });
            };

            /**
             * a flag indicating if the client's projects should be shown or not. *Deprecated.*
             * @type {boolean}
             */
            this.showProjects = false;
            /**
             * gets the projects associated with the client specified by param id
             * @param id - the client's id
             */
            var getProjects = function (id) {
                self.projects = LocalStorage.getData('client/'+id+'/projects');
                self.projectStatistics = LocalStorage.getData('client/'+id+'/statistics')
                ApiAbstractionLayer('GET', {name:'project',params:{client: id}}).then(function (data) {
                    self.projects = data.list;
                    self.projectStatistics = data.info;
                    LocalStorage.setData('client/'+id+'/projects', data.list);
                    LocalStorage.setData('client/'+id+'/statistics', data.info);
                });
            };

            // call getClient when the detail view is requested
            /**
             * Reacts on a change of the client detail. Triggered by the {@link ama.directives.masterDetail masterDetail directive}.
             * @param {Object} data The newly selected client
             */
            this.detailChanged = function(data){
                calls += 1;
                console.log(calls);
                self.client = data;
                getClient(data.id);
                getProjects(data.id);
            };

            // if the client state is entered with a certain id, we want to set the client detail for this id
            if($stateParams.id){
                MasterDetailService.notifyController('setDetail',{id:$stateParams.id});
            }

            // the next few lines contain code to create a new client - client_data connection


            /**
             * Object of flags indicate if we currently want to add a new client data of its type (phone/mail/fax)
             * TODO: do this dynamically
             * @type {{phone: boolean, mail: boolean, fax: boolean}}
             */
            this.newConnectionFlag = {
                phone: false,
                mail: false,
                fax: false
            };

            /**
             * Toggles the flag for the newConnection creation mode
             * @param {string} type Identifier of the type of client data
             */
            this.setNewConnectionFlag = function(type) {
                self.newConnectionFlag[type] = !self.newConnectionFlag[type];
            };

            /**
             * A simple object containing any possible new client data
             * with (initially) empty names and values.
             * Bound to input fields in the view.
             * @deprecated As fax works without this, we don't seem to need it.
             * TODO: create this dynamically
             * @property newConnection
             * @type {{phone: {name: string, value: string}, mail: {name: string, value: string}}}
             */
            //
            this.newConnection = {
                phone: {
                    name: '',
                    value: ''
                },
                mail: {
                    name: '',
                    value: ''
                }
            };

            /**
             * Performs a database request to add a new client - client_data connection of a certain type
             * @param {string} type Identifier of the type of client_data to be created
             */
            this.addConnection = function(type) {
                var name = self.newConnection[type].name;
                var value = self.newConnection[type].value;
                var data = {
                    clientid: self.client.id,
                    datatype: type,
                    name: name,
                    value: value
                };
                // Post to the API
                ApiAbstractionLayer('POST', {name: 'client_data', data: data}).then(function (data) {
                    self.setNewConnectionFlag(type);
                    var conns = self.client.data[type];
                    if(conns) {
                        conns.push({id: data.id, name: name, value: value});
                    } else {
                        self.client.data[type] = [{id: data.id, name: name, value: value}];
                    }
                    LocalStorage.setData('client/'+self.client.id, self.client);
                    self.newConnection[type].name = '';
                    self.newConnection[type].value = '';
                });
            };


            /**
             * Updates the view and the cache after a client - client_data connection was deleted
             * @param updatedList - the updated list of client_data which doesn't contain the deleted item
             */
            this.connectionDeleted = function (updatedList) {
                self.client.data = updatedList;
                LocalStorage.setData('client/'+self.client.id, self.client);
            };

            /**
             * Deletes the current client
             */
            this.deleteClient = function () {
                MasterDetailService.notifyMaster('deleteClient', self.client.id);
            };

            /**
             * Removes a category with a given catid from the client
             * @param catid - the id of the category to be removed from the client
             */
            this.removeCategory = function(catid)
            {
                var apiObject = {
                    name: 'client_categories',
                    data: {
                        id: catid,
                        clientid: this.client.id
                    }
                };
                ApiAbstractionLayer('DELETE', apiObject).then(function (data) {
                    if(data.success)
                    {
                        delete self.client.categories[catid];
                    }
                });

            };

            /**
             * Makes the mail with the given id the default mail address
             * @param id - the id of the mailaddress
             */
            this.makeMailDefault = function(id)
            {
                var mailAddresses = self.client.data.mail;
                var currentDefault = null, currentSet = false, newDefault = null, newSet = false, i= 0;

                console.log(newDefault, currentDefault, i, mailAddresses.length);
                while(i<mailAddresses.length) {
                    if(!currentSet && mailAddresses[i].isdefault == "1"){
                        currentDefault = i;
                        currentSet = true;
                    }
                    if(!newSet && id == mailAddresses[i].id){
                        newDefault = i;
                        newSet = true;
                    }
                    if(currentSet && newSet)
                        break;
                    else
                        i++;
                }

                var setNewDefault = function () {
                    ApiAbstractionLayer('POST', {name:'client_data', data:{id:id, isdefault:"1"}}).then(function () {
                        self.client.data.mail[newDefault].isdefault = "1";
                        LocalStorage.setData('client/'+self.client.id, self.client);
                    });
                };

                if(currentSet){
                    ApiAbstractionLayer('POST', {name:'client_data', data:{id:mailAddresses[currentDefault].id, isdefault:"0"}}).then(function () {
                        self.client.data.mail[currentDefault].isdefault = "0";
                        setNewDefault();
                    });
                } else {
                    setNewDefault();
                }

            };


            /**
             * Adds a project to the current client
             */
            this.addProject = function () {
                var apiObject = {
                    name: 'project',
                    data: {
                        name: self.newProject.name,
                        description: self.newProject.description,
                        client: self.client.id
                    }
                };
                ApiAbstractionLayer('POST', apiObject).then(function (data) {
                    LocalStorage.setData('project/'+data.id, data);
                    var clientProjects = LocalStorage.getData('client/'+self.client.id+'/projects') || [];
                    clientProjects.push(data);
                    LocalStorage.setData('client/'+self.client.id+'/projects', clientProjects);
                    self.newProject = null;
                    self.projects = clientProjects;
                    var projectList = LocalStorage.getData('currentProjects');
                    if(projectList){
                        projectList.push(data);
                        LocalStorage.setData('projects', projectList);
                    }
                    self.showPage = 2;
                });
            };

            /**
             * Opens a modal with a list of all available client categories
             * and handles adding/removal of categories to the current client
             */
            this.openCategoryModal = function(){
                var categoriesBackup = angular.copy(self.client.categories);
                var selectedCategories = [];
                var unSelectedCategories = [];
                var allCategories = LocalStorage.getData('clientCategories');
                ApiAbstractionLayer('GET', 'client_categories').then(function (data) {

                    for(var i = 0; i<data.length; i++){
                        if (categoriesBackup[data[i].id]) {
                            data[i].selected = true;
                            selectedCategories.push(data[i]);
                        }
                    }
                    allCategories = data;
                    var modal = btfModal({
                        templateUrl: 'templates/pages/clients/categoryDialog.html',
                        /**
                         * @class ama.controllers.ClientCategoriesDialog
                         * Controller for the modal being opened via {@link ama.controllers.ClientDetailCtrl#openCategoryModal the openCategoryModal function in ClientDetailCtrl}
                         */
                        controller: function(){
                            var cats = this;
                            if(allCategories.length > 0){
                                cats.showPage = 1;
                            } else {
                                cats.showPage = 2;
                            }

                            this.filterText = '';
                            /**
                             * An object containing all available categories
                             * @type {string|Object|*}
                             */
                            this.allCategories = allCategories;
                            var resetNewCategory = function () {
                                return {
                                    name: '',
                                    description: ''
                                };
                            };
                            /**
                             * @type {Object}
                             * Contains a category to be sent to the API for creation
                             */
                            this.newCategory = resetNewCategory();
                            /**
                             * Toggles the selection of a category
                             * @param category - the category to be toggled
                             */
                            this.toggleSelectCategory = function (category) {
                                var indexSelect = selectedCategories.indexOf(category);
                                var indexUnselect = unSelectedCategories.indexOf(category);
                                var indexAll = cats.allCategories.indexOf(category);
                                if(indexSelect != -1){
                                    selectedCategories.splice(indexSelect,1);
                                    unSelectedCategories.push(category);
                                    console.log(unSelectedCategories);
                                    delete self.client.categories[category.id];

                                } else {
                                    if(indexUnselect != -1)
                                        unSelectedCategories.splice(indexUnselect,1);
                                    selectedCategories.push(category);
                                    self.client.categories[category.id] = category.name;
                                }

                                if(cats.allCategories[indexAll].selected){
                                    cats.allCategories[indexAll].selected = false;
                                } else {
                                    cats.allCategories[indexAll].selected = true;
                                }

                            };

                            /**
                             * Creates a new category and adds it to the current client as well as the list of categories
                             */
                            this.addCategory = function(){
                                if(cats.newCategory.name){
                                    ApiAbstractionLayer('POST', {name: 'client_categories', data: cats.newCategory},true).then(function (data) {
                                        cats.allCategories.push(data);
                                        cats.toggleSelectCategory(data);
                                        LocalStorage.setData('clientCategories', cats.allCategories);
                                        cats.newCategory = resetNewCategory();
                                        cats.showPage = 1;
                                    });
                                }
                            };

                            var deleteFirstAppearance = function (array, id) {
                                for(var i=0; i<array.length; i++){
                                    if(array[i].id == id){
                                        array.splice(i,1);
                                        return true;
                                    }
                                }
                                return false;
                            };
                            /**
                             * Deletes a client category by given id
                             * @param id - the id of the category to be deleted
                             */
                            this.deleteCategory = function (id) {
                                // we do not use the deleteService as we are already inside a modal
                                ApiAbstractionLayer('DELETE', {name: 'client_categories', data: {id:id}}, true).then(function () {
                                    for(var i = 0; i < allCategories.length; i++){
                                        if(allCategories[i].id == id){
                                            var inBackup = false;
                                            if(allCategories[i].selected){
                                                inBackup = deleteFirstAppearance(selectedCategories, id);
                                                delete self.client.categories[id];
                                            } else {
                                                inBackup = deleteFirstAppearance(unSelectedCategories, id);
                                            }
                                            if(inBackup){
                                                deleteFirstAppearance(categoriesBackup, id);
                                            }
                                            break;
                                        }
                                    }
                                    allCategories.splice(i,1);
                                    LocalStorage.setData('clientCategories',allCategories);
                                });
                            };


                            /**
                             * Adds new and removes old categories from the client and closes the modal.
                             */
                            this.accept = function () {
                                console.log(unSelectedCategories);
                                if(selectedCategories.length > 0) {
                                    for (var i = 0; i < selectedCategories.length; i++) {
                                        if(!categoriesBackup[selectedCategories[i].id])
                                            ApiAbstractionLayer('POST', {
                                                name: 'client_categories',
                                                data: {id: selectedCategories[i].id, clientid: self.client.id}
                                            });
                                    }
                                }
                                if(unSelectedCategories.length > 0){
                                    for (var j = 0; j < unSelectedCategories.length; j++){
                                        if(categoriesBackup[unSelectedCategories[j].id])
                                            ApiAbstractionLayer('DELETE',{
                                                name: 'client_categories',
                                                data: {id: unSelectedCategories[j].id, clientid: self.client.id}
                                            });

                                    }
                                }
                                modal.deactivate();
                            };

                            /**
                             * resets the client categories and closes the modal
                             */
                            this.close = function () {
                                self.client.categories = categoriesBackup;
                                modal.deactivate();
                            };
                        },
                        controllerAs: 'categories'
                    });
                    modal.activate();
                });




            };
        }
    ]
);