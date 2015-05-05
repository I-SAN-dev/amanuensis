app.controller('ProjectCreationCtrl',[
        'ApiAbstractionLayer',
        'LocalStorage',
        function (ApiAbstractionLayer, LocalStorage) {
            var self = this;
            this.clients = LocalStorage.getData('clients');
            ApiAbstractionLayer('GET','client').then(function (data) {
                for(var i= 0; i<data.length; i++){
                    // process contact name if companyname is not set
                    if(!data[i].companyname){
                        data[i].companyname =
                            (data[i].contact_firstname || '')
                            +' '
                            +(data[i].contact_lastname || '');
                    }
                }
                self.clients = data;
                LocalStorage.setData('clients', self.clients);
            })
        }
    ]
);