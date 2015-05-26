/**
 * MasterDetail Communication Service
 * Allows sharing functions between master and detail controllers.
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
        this.editMode = false;
        this.notifyEditor = function () {
            var fnName = arguments[0];
            if(typeof editor[fnName] === 'function') {
                return editor[fnName].apply(null, processParams(arguments));
            }
        };
        this.notifyDetail = function () {
            var fnName = arguments[0];
            if(typeof detail[fnName] === 'function') {
                return detail[fnName].apply(null,processParams(arguments));
            }
        };
        return {
            /**
             * References the masterCtrl
             * @param ctrl
             */
            setMaster: function(ctrl) {
                master = ctrl;
            },
            setDetail: function(ctrl) {
                detail = ctrl;
            },
            setEditor: function(ctrl) {
                editor = ctrl;
            },
            setController: function (ctrl) {
                controller = ctrl;
            },
            editMode: self.editMode,
            notifyMaster: function() {
                var fnName = arguments[0];
                if(typeof master[fnName] === 'function') {
                    return master[fnName].apply(null, processParams(arguments));
                }
            },
            notifyDetail: self.notifyDetail,
            notifyEditor: self.notifyEditor,
            notifyController: function () {
                var fnName = arguments[0];
                if(typeof controller[fnName] === 'function') {
                    return controller[fnName].apply(null, processParams(arguments));
                }
            },
            setDetailView: function(detail, keyboard){
                if(self.editMode) {
                    self.notifyEditor('cancel');
                    self.editMode = false;
                }

                if($state.params.hasDetails)
                    $state.go($state.current.name, {id: detail.id});
                self.notifyDetail('detailChanged', detail, keyboard);
                return detail;
            }
        }
    }
]);