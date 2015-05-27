app.controller('DashboardCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'PanelService',
    '$state',
    function (ApiAbstractionLayer, LocalStorage, PanelService, $state) {
        var self = this;

        /* projects */
        this.currentProjects = LocalStorage.getData('currentProjects');
        this.statistics = LocalStorage.getData('statistics');
        var apiObject = {
            name: 'project',
            params: {
                current: 1
            }
        };
        ApiAbstractionLayer('GET', apiObject).then(function (data) {
            self.currentProjects = data.list;
            self.statistics = data.info;
            LocalStorage.setData('currentProjects', data.list);
            LocalStorage.setData('statistics', data.info);
        });

        /* Stream */
        this.stream = LocalStorage.getData('stream');
        ApiAbstractionLayer('GET', 'stream').then(function (data) {
            self.stream = data;
            LocalStorage.setData('stream', data);
        });


        /**
         * Switches to new project view in client view
         */
        this.newProject = function () {
            PanelService.setPanel('clients', 3);
            $state.go('app.clients');
        };

        /**
         * Goes to a page
         * @param type - the type of the page, e.g. invoice
         * @param id - the id of the thing
         */
        this.goto = function(type, id)
        {
            var stateOfType = {
                client:'app.clients.detail',
                project:'app.projectDetail',
                offer:'app.offerDetail',
                contract:'app.contractDetail',
                todo:'app.todoDetail',
                acceptance:'app.acceptanceDetail',
                invoice:'app.invoiceDetail',
                reminder:'app.reminderDetail'
            };
            $state.go(stateOfType[type], {id: id});
        };

        /**
         * Checks if a client in a stream entry is linkable
         * @param entry - the entry
         * @returns {boolean}
         */
        this.clientLinkable = function(entry)
        {
            return !((entry.action == 'delete') && (entry.type == 'client'));
        };

        /**
         * Checks if a stream entry is linkable
         * @param entry - the entry
         * @returns {boolean}
         */
        this.linkable = function(entry)
        {
            return (entry.action != 'delete');
        };

    }
]);