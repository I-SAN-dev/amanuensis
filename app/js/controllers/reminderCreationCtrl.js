app.controller('ReminderCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'RefnumberService',
    '$stateParams',
    '$state',
    function (ApiAbstractionLayer, LocalStorage, RefnumberService, $stateParams, $state) {
        var invoiceId = $stateParams.invoice;
        var projectId = $stateParams.project;
        var self = this;
        RefnumberService('reminders', projectId).then(function (data) {
            self.newReminder = {
                invoice: invoiceId,
                refnumber: data.refnumber
            };
        });

        this.createReminder = function () {
            ApiAbstractionLayer('POST', {name: 'reminder', data:self.newReminder}).then(function (data) {
                var invoice = LocalStorage.getData('invoice/'+invoiceId)||{reminders:[data]};
                LocalStorage.setData('invoice/'+invoiceId, self.invoice);
                LocalStorage.setData('invoice/'+invoiceId+'reminder/'+data.id, data);
                $state.go('app.reminderDetail',{id: data.id});
            })
        };
    }
]);