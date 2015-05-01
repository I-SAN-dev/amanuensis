/**
 * MasterDetail Communication Service
 * Allows sharing functions between master and detail controllers.
 */
app.factory('MasterDetailService', [
    function () {
        var master, detail, masterDetail;
        var processParams = function (params) {
            var params = [];
            for (var i = 1; i<params.length; i++){
                params.push(params[i]);
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
            setMasterDetail: function (ctrl) {
                masterDetail = ctrl;
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