/**
 * MasterDetail Communication Service
 * Allows sharing functions between master and detail controllers.
 */
app.factory('MasterDetailService', [
    function () {
        var master, detail;
        var processParams = function (args) {
            var params = [];
            for (var i = 1; i<args.length; i++){
                params.push(args[i]);
            }
            return params;
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
            notifyMaster: function() {
                var fnName = arguments[0];
                master[fnName].apply(null,processParams(arguments));
            },
            notifyDetail: function () {
                var fnName = arguments[0];
                detail[fnName].apply(null,processParams(arguments));
            }
        }
    }
]);