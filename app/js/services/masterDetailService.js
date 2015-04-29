/**
 * MasterDetail Communication Service
 * Allows sharing functions between master and detail controllers.
 */
app.factory('MasterDetailService', [
    function () {
        var master, detail;
        return {
            setMaster: function(ctrl) {
                console.log(ctrl);
                master = ctrl;
            },
            setDetail: function(ctrl) {
                detail = ctrl;
            },
            notifyMaster: function(fnName, param) {
                console.log(master[fnName]);
                master[fnName](param);
            },
            notifyDetail: function (fnName, param) {
                detail[fnName](param);
            }
        }
    }
]);