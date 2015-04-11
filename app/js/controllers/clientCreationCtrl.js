app.controller('ClientCreationCtrl',
    [
        'ApiAbstractionLayer',
        'LocalStorage',
        function (ApiAbstractionLayer, LocalStorage) {

            var self = this;



            var refNumber = '';
            ApiAbstractionLayer('GET','client_refnumber').then(function (data) {
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

            // Get all client categories
            this.allCategories = LocalStorage.getData('clientCategories');
            ApiAbstractionLayer('GET', 'client_categories').then(function(data){
                self.allCategories = data;
                LocalStorage.setData('clientCategories', data)
            });
            this.newClientCategories = [];
            /**
             * Adds one or more categori(es) to a client
             * TODO: test it when the API supports it
             * @param {int} client - the client id
             * @param {object} categories - an array containing all category ids that shall be added to the client
             */
            var addCategoryLinks = function(client, categories) {
                if(categories.length > 0){
                    for (var i in categories) {
                        ApiAbstractionLayer('POST', {name: 'client_categories', data: {id: categories[i], clientid: client}});
                    }
                }
            };

            /**
             * Creates a new client
             */
            this.addClient = function () {
                ApiAbstractionLayer('POST', {name: 'client', data: self.newClient}).then(function(data){
                    addCategoryLinks(data.id, self.newClientCategories);
                    self.newClient = initialNewClient;
                });
            };
        }]);