/**
 * @class ama.controllers.ProjectCreationCtrl
 * Controller for the project creation view.
 * *DEPRECATED:* This view doesn't exist anymore.
 */
app.controller('ProjectCreationCtrl',[
        'ApiAbstractionLayer',
        'LocalStorage',
        function (ApiAbstractionLayer, LocalStorage) {
            var self = this;
            /**
             * Adds a new project to the given client
             * @param {Object} client The client to which the project should be added
             */
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