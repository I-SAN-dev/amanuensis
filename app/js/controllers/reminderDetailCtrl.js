/**
 * @class ama.controllers.ReminderDetailCtrl
 *
 * Controller for the reminder detail view.
 */
app.controller('ReminderDetailCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'MasterDetailService',
    'MailService',
    'PdfService',
    'StateManager',
    'DeleteService',
    '$stateParams',
    '$scope',
    function (ApiAbstractionLayer, LocalStorage, MasterDetailService, MailService, PdfService, StateManager, DeleteService, $stateParams, $scope) {
        MasterDetailService.setMaster(this);
        var id = $stateParams.id;
        var self = this;
        this.reminder = LocalStorage.getData('reminder/'+id);
        ApiAbstractionLayer('GET', {name: 'reminder', params: {id:id}}).then(function (data) {
            self.reminder = data;
            LocalStorage.setData('reminder/'+id, data);
        });

        /**
         * Uses the {@link ama.services.PdfService PdfService} to show either a PDF preview
         * or the generated PDF of the reminder.
         * @param {Event} event The event (commonly 'click') that triggered the function call
         * @param {bool} preview Indicates if a preview or the generated PDF should be shown
         * @param {String} path *optional* Path to the generated PDF
         */
        this.viewPdf = function (event, preview, path) {
            PdfService(event,preview,'reminder',id, path).then(function (data) {
                if(data){
                    self.reminder.path = data.path;
                    self.reminder.state = 1;
                    LocalStorage.setData('reminder/'+id, self.reminder);
                }
            });
        };

        var changeState = function(toState){
            StateManager.setState('reminder', id, toState).then(function (data) {
                self.reminder = data;
            });
        };

        /**
         * Uses the {@link ama.services.MailService MailService} to show a mail preview for the current reminder.
         * @param {Event} event The event (click) that led to the function call
         */
        this.openMailPreview = function (event) {
            event.preventDefault();
            $scope.mailtext = $scope.getValueFromWysiwyg('mailtext');
            MailService.showPreview('reminder',self.reminder.id, $scope.mailtext);
        };

        /**
         * Uses the {@link ama.services.MailService MailService} to send a mail with the current offer.
         * Changes the state of the offer to 2 (PDF sent) on success.
         */
        this.send = function () {
            $scope.mailtext = $scope.getValueFromWysiwyg('mailtext');
            MailService.send('reminder',self.reminder.id, $scope.mailtext).then(function (data) {
                changeState(2);
            });
        };

        /**
         * Deletes an item by given id.
         * @param {id} itemId The id of the item to be deleted
         */
        this.deleteItem = function (itemId) {
            DeleteService('item', itemId).then(function (data) {
                self.reminder.items = data;
                LocalStorage.setData('reminder/'+id, self.reminder);
            });
        };
    }
]);