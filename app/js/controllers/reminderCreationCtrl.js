app.controller('ReminderCreationCtrl', [
    'ApiAbstractionLayer',
    'LocalStorage',
    'RefnumberService',
    'ErrorDialog',
    '$stateParams',
    '$state',
    '$filter',
    'GoBackService',
    function (ApiAbstractionLayer, LocalStorage, RefnumberService, ErrorDialog, $stateParams, $state, $filter, GoBackService) {
        var self = this;
        if(!$stateParams.invoice){
            ErrorDialog({code:'1337',languagestring:'errors.noProjectSpecified'}).activate();
            $state.go('app.dashboard');
        } else {
            var invoice = $stateParams.invoice;
            var invoiceId = invoice.id;
            var projectId = invoice.project.id;
            self.invoiceName = invoice.name;
            RefnumberService('reminders', projectId).then(function (data) {
                self.newReminder = {
                    invoice: invoiceId,
                    refnumber: data.refnumber
                };
            });
        }



        this.createReminder = function ()
        {
            var date = new Date;
            self.newReminder.date = $filter('date')(date,'yyyy-MM-dd HH:mm:ss');
            ApiAbstractionLayer('POST', {name: 'reminder', data:self.newReminder}).then(function (data) {
                invoice.reminders.push(data);
                LocalStorage.setData('invoice/'+invoiceId, invoice);
                LocalStorage.setData('invoice/'+invoiceId+'reminder/'+data.id, data);
                $state.go('app.reminderDetail',{id: data.id});
            });
        };

        this.cancel = GoBackService;
    }
]);