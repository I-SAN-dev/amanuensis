/**
 * Service that creates a modal showing error information when needed.
 */
app.factory('ErrorDialog', function (btfModal) {
    return function(errorObj){
        var modal = btfModal({
            templateUrl: 'templates/modules/errorDialog.html',
            controller: function(){
                this.code = errorObj.code;
                this.message = errorObj.message;
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