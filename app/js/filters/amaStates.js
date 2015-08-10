/**
 * @class ama.filters.amaStates
 * # The amaStates filter
 * Converts an amanu status code to a language string representing the status or an amanu app state name to an API name (i.e. 'app.offerDetail'->'offer').
 *
 * ## Usage
 * HTML:
 *
 *     {{statusCode|amaStates:type}}
 *
 * JavaScript:
 *
 *     $filter('amaStates')(statusCode, type)
 *
 * type can be one of: 'project', 'offer', 'acceptance', 'invoice', 'reminder', 'stateToApi', 'error', 'errorDescription'
 *
 */
app.filter('amaStates', function () {
    var statusCodes = {
        project: {
            '0': 'projects.states.created',
            '1': 'projects.states.waiting',
            '2': 'projects.states.todo',
            '3': 'projects.states.overdueWaiting',
            '4': 'projects.states.overdueTodo',
            '5': '',
            '6': '',
            '7': 'projects.states.finished',
            '8': 'projects.states.archived'
        },
        offer: {
            '0': 'offers.states.created',
            '1': 'offers.states.pdfGenerated',
            '2': 'offers.states.pdfSent',
            '3': 'offers.states.clientAccepted',
            '-1': 'offers.states.clientDeclined'
        },
        acceptance: {
            '0': 'acceptances.states.created',
            '1': 'acceptances.states.pdfGenerated',
            '2': 'acceptances.states.pdfSent',
            '3': 'acceptances.states.clientAccepted',
            '-1': 'acceptances.states.clientDeclined'
        },
        invoice: {
            '0': 'invoices.states.created',
            '1': 'invoices.states.pdfGenerated',
            '2': 'invoices.states.pdfSent',
            '3': 'invoices.states.paid',
            '4': 'invoices.states.overdueNoReminder',
            '5': 'invoices.states.overdueReminderCreated'
        },
        reminder: {
            '0':'reminders.states.created',
            '1':'reminders.states.pdfGenerated',
            '2':'reminders.states.pdfSent'
        },
        stateToApi: {
            'app.offerDetail': 'offer',
            'app.contractDetail': 'contract',
            'app.acceptanceDetail': 'acceptance',
            'app.invoiceDetail': 'invoice'
        },
        error: {
            "400": "errors.codes.400.message",
            "401": "errors.codes.401.message",
            "403": "errors.codes.403.message",
            "404": "errors.codes.404.message",
            "405": "errors.codes.405.message",
            "500": "errors.codes.500.message"
        },
        errorDescription: {
            "400": "errors.codes.400.description",
            "401": "errors.codes.401.description",
            "403": "errors.codes.403.description",
            "404": "errors.codes.404.description",
            "405": "errors.codes.405.description",
            "500": "errors.codes.500.description"
        }
    };

    return function(input, type){
        return statusCodes[type][input];
    }
});