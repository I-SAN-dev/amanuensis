/**
 * MasterDetail Communication Service
 * Allows sharing functions between master and detail controllers.
 */
app.factory('MasterDetailService', [
    function () {
        var master, detail;
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
            notifyMaster: function() {
                var fnName = arguments[0];
                var params = [];
                for (var i = 1; i<arguments.length; i++) {
                    params.push(arguments[i]);
                }
                master[fnName].apply(null,params);
            },
            notifyDetail: function () {
                var fnName = arguments[0];
                var params = [];
                for (var i = 1; i<arguments.length; i++) {
                    params.push(arguments[i]);
                }
                detail[fnName].apply(null,params);
            }
        }
    }
]);