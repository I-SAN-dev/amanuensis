/**
 * @class ama.services.MasterDetailService
 *
 * # MasterDetail Communication Service
 * Allows sharing functions between master and detail controllers.
 *
 */
app.factory('MasterDetailService', [
    '$state',
    function ($state) {
        var master, detail, editor, controller;
        var processParams = function (args) {
            var params = [];
            for (var i = 1; i<args.length; i++){
                params.push(args[i]);
            }
            return params;
        };
        var self = this;
        var editMode = false;
        /**
         * Calls a function inside the registered editor controller
         * @returns {*} The return value of the function being called
         */
        this.notifyEditor = function () {
            var fnName = arguments[0];
            if(typeof editor[fnName] === 'function') {
                return editor[fnName].apply(null, processParams(arguments));
            }
        };
        /**
         * Calls a function inside the registered detail controller
         * @returns {*} The return value of the function being called
         */
        this.notifyDetail = function () {
            var fnName = arguments[0];
            if(typeof detail[fnName] === 'function') {
                return detail[fnName].apply(null,processParams(arguments));
            }
        };
        return {
            /**
             * Registers the master controller
             * @param {Object} ctrl The controller to be registered as master.
             */
            setMaster: function(ctrl) {
                master = ctrl;
            },
            /**
             * Registers the detail controller
             * @param {Object} ctrl The controller to be registered as detail.
             */
            setDetail: function(ctrl) {
                detail = ctrl;
                console.log(detail);
            },
            /**
             * Registers the editor controller
             * @param {Object} ctrl The controller to be registered as editor.
             */
            setEditor: function(ctrl) {
                editor = ctrl;
            },
            /**
             * Registers the {@link ama.directives.masterDetail masterDetail directive}'s controller
             * @param {Object} ctrl The controller of the directive.
             */
            setController: function (ctrl) {
                controller = ctrl;

                console.log(controller);
            },
            /**
             * Sets a flag in the service indicating if the detail is currently in edit mode.
             * @param {boolean} flag
             * @returns {boolean} The current value of the edit mode flag
             */
            editMode: function(flag){
                if(flag !== undefined)
                    editMode = flag;
                return editMode;
            },
            /**
             * Calls a function inside the registered master controller
             * @returns {*} The return value of the function being called
             */
            notifyMaster: function() {
                var fnName = arguments[0];
                if(typeof master[fnName] === 'function') {
                    return master[fnName].apply(null, processParams(arguments));
                }
            },
            /**
             * The notifyDetail function, wrapped in a property
             */
            notifyDetail: self.notifyDetail,
            /**
             * The notifyEditor function, wrapped in a property
             */
            notifyEditor: self.notifyEditor,
            /**
             * Calls a function inside the registered masterDetail directive controller
             * @returns {*} The return value of the function being called
             */
            notifyController: function () {
                var fnName = arguments[0];
                if(typeof controller[fnName] === 'function') {
                    return controller[fnName].apply(null, processParams(arguments));
                }
            },
            /**
             * Changes the detail
             * @param {Object} detailItem The newly selected detail
             * @param {boolean} [keyboard] *Optional.* Indicates if the detail was changed by keyboard input
             * @returns {Object} The new detail.
             */
            setDetailView: function(detailItem, keyboard){
                if(editMode) {
                    console.log('cancel edit');
                    self.notifyEditor('cancel');
                    editMode = false;
                }

                if($state.params.hasDetails)
                    $state.go($state.current.name, {id: detailItem.id});
                console.log('set detail view', detailItem, detail);
                self.notifyDetail('detailChanged', detailItem, keyboard);
                return detailItem;
            }
        }
    }
]);