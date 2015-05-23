app.controller('SettingsCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'constants',
    '$scope',
    function (ApiAbstractionLayer, LocalStorage, constants, $scope) {
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

        this.response =  LocalStorage.getData('settings');
        this.settings = this.response ? this.response.settings : {};
        this.settingtypes = this.response ? this.response.types: {};
        this.settingkeys = this.objectKeys(this.settings);

        ApiAbstractionLayer('GET', 'settings').then(function (data) {
            self.settings = data.settings;
            self.settingtypes = data.types;
            self.settingkeys = self.objectKeys(self.settings);
        });







    }
]);