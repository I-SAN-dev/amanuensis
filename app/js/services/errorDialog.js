/**
 * @class ama.services.ErrorDialog
 * Service that creates a modal showing error information when needed.
 *
 * @param {Object} errorObj The error to be presented in the modal.
 * @returns {btfModal} The modal with the error information. Has to be activated to be shown (modal.activate()).
 */
app.factory('ErrorDialog', function (btfModal) {
    return function(errorObj){
        var modal = btfModal({
            templateUrl: 'templates/modules/errorDialog.html',
            controller: function(){
                this.code = errorObj.code;
                this.message = errorObj.message;
                this.languagestring = errorObj.languagestring;
                this.file = errorObj.file;
                this.line = errorObj.line;



                this.close = function () {
                    console.log('close');
                    modal.deactivate();
                };
            },
            controllerAs: 'error'
        });
        return modal;
    };
});