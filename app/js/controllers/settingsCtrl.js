/**
 * @class ama.controllers.SettingsCtrl
 * Controller for the app settings
 */
app.controller('SettingsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'constants',
    '$scope',
    'ErrorDialog',
    'DeleteService',
    'sha256Filter',
    'btfModal',
    '$q',
    function (ApiAbstractionLayer, LocalStorage, constants, $scope, ErrorDialog, DeleteService, sha256Filter, btfModal, $q) {
        var self = this;


        var modifyUser = function (type, userData) {
            var defer = $q.defer();
            console.log(self[type]);
            if(self[type].password1 != self[type].password2)
            {
                defer.reject({code:'1337',languagestring:'user.passwordsdontmatch'});
            }
            else
            {
                ApiAbstractionLayer('POST', {
                    name: 'userdata',
                    data: userData
                },true).then(function(data){
                    self.users = data;
                    self.reset(type);
                    defer.resolve(data);
                }, function (error) {
                    defer.reject(error);
                });
            }
            return defer.promise;
        };

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
         * @param user - the user to be modified
         */
        this.changeUserPass = function(user)
        {
            var modal = btfModal({
                templateUrl: 'templates/modules/changePasswordModal.html',
                controller: function(){
                    var changeModal = this;
                    this.username = user.username;
                    this.accept = function () {
                        self.passwordChange = {
                            password1: changeModal.password1,
                            password2: changeModal.password2
                        };
                        modifyUser('passwordChange',{id: user.id, password: sha256Filter(self.passwordChange.password1)}).then(function () {
                            modal.deactivate();
                        }, function (error) {
                            if(error.languagestring){
                                changeModal.errorMessage = error.languagestring;
                            } else {
                                changeModal.errorMessage = error.message;
                            }
                        });
                    };

                    this.cancel = function () {
                        modal.deactivate();
                        self.reset('passwordChange');
                    };
                },
                controllerAs: 'change'
            });
            modal.activate();
        };

        /**
         * Resets the user creation form
         */
        this.reset = function(type)
        {
            self[type] = {
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
            modifyUser('newUser',{
                username: self.newUser.username,
                email: self.newUser.email,
                password: sha256Filter(self.newUser.password1),
                accessgroup: 0
            }).then(function () {}, function (error) {
                ErrorDialog(error).activate();
            });
        };


        ApiAbstractionLayer('GET', 'settings').then(function (data) {
            LocalStorage.setData('settings', data);
            self.settings = data.settings;
            self.settingtypes = data.types;
            self.settingkeys = self.objectKeys(data.settings);
        });


        ApiAbstractionLayer('GET','apps').then(function(data){
            self.apps = data;
            self.checkffapp();
        });

        ApiAbstractionLayer('GET', {name: 'userdata', params: {list: 1}}).then(function(data){
            self.users = data;
        });

        this.reset('newUser');
        this.reset('passwordChange');
    }
]);