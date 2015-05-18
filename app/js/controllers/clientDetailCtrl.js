/**
 * Controller for the client detail view.
 */
app.controller('ClientDetailCtrl',
    ['ApiAbstractionLayer',
        'LocalStorage',
        '$scope',
        '$stateParams',
        'DeleteService',
        'MasterDetailService',
        'btfModal',
        function (ApiAbstractionLayer, LocalStorage, $scope, $stateParams, DeleteService, MasterDetailService, btfModal) {

            var self = this;

            MasterDetailService.setDetail(this);


            var calls = 0;
            /**
             * Gets a client from the API
             * @param {int} id - the client id to query for
             */
            var getClient = function(id) {
                self.client = LocalStorage.getData('client'+'/'+id);
                ApiAbstractionLayer('GET', {name:'client', params: {id:id}}).then(function (data) {
                    LocalStorage.setData('client'+'/'+id, data);
                    self.client = data;
                });
            };

            this.showProjects = false;
            var getProjects = function (id) {
                self.projects = LocalStorage.getData('client/'+id+'/projects');
                ApiAbstractionLayer('GET', {name:'project',params:{client: id}}).then(function (data) {
                    self.projects = data;
                    LocalStorage.setData('client/'+id+'/projects', data);
                });
            };

            // call getClient when the detail view is requested
            this.detailChanged = function(data){
                calls += 1;
                console.log(calls);
                self.client = data;
                getClient(data.id);
                getProjects(data.id);
            };

            // if the client state is entered with a certain id, we want to set the client detail for this id
            if($stateParams.id){
                $scope.$parent.setDetail({id:$stateParams.id});
            }

            // the next few lines contain code to create a new client - client_data connection

            // set flags for all types of client data.
            // the flag indicate if we currently want to add a new client data of its type
            // TODO: do this dynamically
            this.newConnectionFlag = {
                phone: false,
                mail: false,
                fax: false
            };

            /**
             * Toggles the flag for the newConnection creation mode
             * @param {string} type - identifier of the type of client data
             */
            this.setNewConnectionFlag = function(type) {
                self.newConnectionFlag[type] = !self.newConnectionFlag[type];
            };

            // just a simple object containing any possible new client data
            // with (initially) empty names and values.
            // bound to input fields in the view
            // TODO: create this dynamically
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
             * @param {string} type - identifier of the type of client_data to be created
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
                var mailAdresses = self.client.data.mail;
                var i = 0, j = 0, k= 0;
                var iStopped = false, jStopped = false;
                while(i<mailAdresses.length) {
                    if(mailAdresses[i].id!=id && !jStopped)
                        j++;
                    else
                        jStopped = true;
                    if(mailAdresses[i].isdefault == "0" && ! iStopped)
                        k++;
                    else
                        iStopped = true;
                    if(iStopped && jStopped){
                        break;
                    } else {
                        i++;
                    }
                }
                ApiAbstractionLayer('POST', {name:'client_data', data:{id:mailAdresses[k].id, isdefault:"0"}}).then(function () {
                    self.client.data.mail[k].isdefault = "0";
                    ApiAbstractionLayer('POST', {name:'client_data', data:{id:id, isdefault:"1"}}).then(function () {
                        self.client.data.mail[j].isdefault = "1";
                        LocalStorage.setData('client/'+self.client.id, self.client);
                    });
                });
            };


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
                    var clientProjects = LocalStorage.getData('client/'+self.client.id+'/projects');
                    clientProjects.push(data);
                    LocalStorage.setData('client/'+self.client.id+'/projects', clientProjects);
                    self.newProject = null;
                    self.projects = clientProjects;
                    var projectList = LocalStorage.getData('projects');
                    projectList.push(data);
                    LocalStorage.setData('projects', projectList);
                    self.showPage = 2;
                });
            };

            this.openCategoryModal = function(){
                ApiAbstractionLayer('GET', 'client_categories').then(function (data) {
                    var allCategories = data;
                });
                var modal = btfModal({
                    templateUrl: 'templates/pages/clients/categoryDialog.html',
                    controller: function(){
                        this.activeCategories = self.client.categories;
                        this.allCategories = allCategories;

                        this.close = function () {
                            console.log('close');
                            modal.deactivate();
                        };
                    },
                    controllerAs: 'categories'
                });
                return modal;
            };
        }
    ]
);