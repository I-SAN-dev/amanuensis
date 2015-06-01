app.controller('SettingsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'constants',
    '$scope',
    'ErrorDialog',
    'DeleteService',
    'sha256Filter',
    function (ApiAbstractionLayer, LocalStorage, constants, $scope, ErrorDialog, DeleteService, sha256Filter) {
        var self = this;

        /**
         * Will give me all keys of an object
         * @param obj
         * @returns {Array}
         */
        this.objectKeys = function(obj)
        {
            if(obj)
            {
                return Object.keys(obj);
            }
            return [];
        };

        /**
         * test if the given object can be a setting
         * @param val
         * @returns {boolean}
         */
        this.isSetting = function(val)
        {
            return((val != '%spacer%') && !(typeof(val) === 'object'));
        };
        /**
         * Test if the given object is a setting object
         * @param val
         * @returns {boolean}
         */
        this.isSettingSet = function(val)
        {
            return((val != '%spacer%') && (typeof(val) === 'object'));
        };

        /**
         * Tries to install the amanu firefox open web app
         * @param e - the click event
         */
        $scope.ffappinstalled = false;
        this.installffapp = function(e)
        {
            e.preventDefault();

            if(navigator.mozApps)
            {
                var app = navigator.mozApps.install(this.apps.firefoxapp);
                app.onsuccess = function()
                {
                    if(app.result)
                    {
                        $scope.ffappinstalled = true;
                        $scope.$apply();
                    }
                };
            }
            else
            {
                ErrorDialog({
                    code:'1337',
                    languagestring:'errors.browsertoold'
                }).activate();
            }
        };

        /**
         * Checks if the ff extension is installed
         */
        this.checkffapp = function()
        {
            if(navigator.mozApps)
            {
                var app = navigator.mozApps.checkInstalled(this.apps.firefoxapp);
                app.onsuccess = function()
                {
                    if(app.result)
                    {
                        $scope.ffappinstalled = true;
                        $scope.$apply();
                    }
                };
            }
        };


        /**
         * Deletes a user with a given id
         * @param e - the click event
         * @param id - the id of the user
         */
        this.deleteUser = function(e, id)
        {
            e.preventDefault();
            DeleteService('userdata',id).then(function(data){
                self.users = data;
            });
        };

        /**
         * Changes the passwort of a user with a given id
         * @param e - the click event
         * @param id - the id of the user
         */
        this.changeUserPass = function(e, id)
        {
            e.preventDefault();
            alert('TODO: Christian, bau ein Modal!');
        };

        /**
         * Resets the user creation form
         */
        this.resetNewUser = function()
        {
            this.newUser = {
                username: '',
                email:'',
                password1:'',
                password2:''
            }
        };

        /**
         * Adds a new user
         */
        this.addNewUser = function()
        {
            if(this.newUser.password1 != this.newUser.password2)
            {
                ErrorDialog({code:'1337',languagestring:'user.passwordsdontmatch'}).activate();
            }
            else
            {
                ApiAbstractionLayer('POST', {
                    name: 'userdata',
                    data: {
                        username: self.newUser.username,
                        email: self.newUser.email,
                        password: sha256Filter(self.newUser.password1),
                        accessgroup: 0
                    }
                }).then(function(data){
                    self.users = data;
                    self.resetNewUser();
                });
            }
        };

        this.response =  LocalStorage.getData('settings');
        this.settings = this.response ? this.response.settings : {};
        this.settingtypes = this.response ? this.response.types: {};
        this.settingkeys = this.objectKeys(this.settings);

        ApiAbstractionLayer('GET', 'settings').then(function (data) {
            LocalStorage.setData('settings', data);
            self.settings = data.settings;
            self.settingtypes = data.types;
            self.settingkeys = self.objectKeys(self.settings);
        });

        ApiAbstractionLayer('GET','apps').then(function(data){
            self.apps = data;
            self.checkffapp();
        });

        ApiAbstractionLayer('GET', {name: 'userdata', params: {list: 1}}).then(function(data){
            self.users = data;
        });

        this.resetNewUser();








    }
]);