app.controller('ClientCreationCtrl',
    [
        'ApiAbstractionLayer',
        'LocalStorage',
        '$state',
        '$stateParams',
        function (ApiAbstractionLayer, LocalStorage, $state, $stateParams) {

            var self = this;



            var refNumber = '';
            ApiAbstractionLayer('GET',{name:'refnumber', params: {for:'customers'}}).then(function (data) {
                if(self.newClient.refnumber === ''){
                    self.newClient.refnumber = data.refnumber;
                }
            });

            var initialNewClient = {
                companyname: null,
                contact_firstname: null,
                contact_lastname: null,
                street_no: null,
                additional: null,
                zip: null,
                city: null,
                country: null,
                comment: null,
                contact_gender: null,
                refnumber: refNumber
            };

            this.newClient = initialNewClient;

            this.genderOptions = [
                {
                    id: '',
                    name: ''
                },
                {
                    id: 'm',
                    name: 'clients.contactGender.male'
                },
                {
                    id: 'w',
                    name: 'clients.contactGender.female'
                }
            ];

            // Get all client categories
            this.allCategories = LocalStorage.getData('clientCategories');
            ApiAbstractionLayer('GET', 'client_categories').then(function(data){
                self.allCategories = data;
                LocalStorage.setData('clientCategories', data)
            });
            this.newClientCategories = [];
            /**
             * Adds one or more categori(es) to a client
             * @param {int} client - the client id
             * @param {object} categories - an array containing all category ids that shall be added to the client
             */
            var addCategoryLinks = function(client, categories) {
                if(categories.length > 0){
                    for (var i = 0; i<categories.length; i++) {
                        ApiAbstractionLayer('POST', {name: 'client_categories', data: {id: categories[i], clientid: client}});
                    }
                }
            };

            /**
             * Creates a new client
             */
            this.addClient = function () {
                ApiAbstractionLayer('POST', {name: 'client', data: self.newClient}).then(function(data){
                    // cache the new client and update the cached clientlist
                    LocalStorage.setData('client/'+data.id, data);
                    var list = LocalStorage.getData('clients') || [];
                    list.push(data);
                    LocalStorage.setData('clients', list);

                    addCategoryLinks(data.id, self.newClientCategories);
                    self.newClient = initialNewClient;

                    // go to where we came from or to the client list (and new client detail) if no referrer is specified
                    var to = $stateParams.referrer || 'app.clients';
                    var toParams;
                    if(to=='app.clients')
                        toParams = {id:data.id};
                    else
                        toParams = $stateParams.referrerParams;
                    $state.go(to,toParams);
                });
            };
        }]);