/**
 * Service that creates a modal showing error information when needed.
 */
app.factory('ErrorDialog', function (btfModal) {
    return btfModal({
                templateUrl: 'templates/modules/errorDialog.html',
                controller: function(ErrorDialog){
                    this.code = errorObj.code;
                    this.message = errorObj.message;
                    this.file = errorObj.file;
                    this.line = errorObj.line;
                    
                    this.close = function () {
                        ErrorDialog.deactivate();
                    };
                },
                controllerAs: 'error'
            });
});