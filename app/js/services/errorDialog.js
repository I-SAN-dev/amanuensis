/**
 * @class ama.services.ErrorDialog
 * Service that creates a modal showing error information when needed.
 *
 * @param {Object} errorObj The error to be presented in the modal.
 * @returns {btfModal} The modal with the error information. Has to be activated to be shown (modal.activate()).
 */
app.factory('ErrorDialog', function (btfModal) {


    var self = this;
    self.errorActive = false;

    return function(errorObj){

        /* only show an error modal, if no other error modal is present */
        if(!self.errorActive)
        {
            self.errorActive = true;
            var modal = btfModal({
                templateUrl: 'templates/modules/errorDialog.html',
                controller: function(){
                    this.code = errorObj.code;
                    this.message = errorObj.message;
                    this.languagestring = errorObj.languagestring;
                    this.file = errorObj.file;
                    this.line = errorObj.line;

                    this.close = function () {
                        self.errorActive = false;
                        modal.deactivate();
                    };
                },
                controllerAs: 'error'
            });
            return modal;
        }
        /* otherwise only log the error to the console */
        else
        {
            /* return an object behaving similiar to the modal, so we can use it in same context */
            /* quak quak ducktyping */
            return {
                activate: function(){
                    console.error(errorObj.code + ' - ' + errorObj.message + ' (' + errorObj.file + ':' + errorObj.line + ')');
                }
            }
        }


    };
});