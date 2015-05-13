app.controller('ProjectCreationCtrl',[
        'ApiAbstractionLayer',
        'LocalStorage',
        function (ApiAbstractionLayer, LocalStorage) {
            var self = this;
            this.addProject = function (client) {
                var apiObject = {
                    name: 'project',
                    data: {
                        name: self.newProject.name,
                        description: self.newProject.description,
                        client: client
                    }
                };
                ApiAbstractionLayer('POST', apiObject).then(function (data) {
                    LocalStorage.setData('project/'+data.id, data);
                    self.newProject = null;
                });
            };
        }
    ]
);