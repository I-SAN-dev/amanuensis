app.filter('amaStates', function () {
    var statusCodes = {
        offer: {
            '0': 'offers.states.created',
            '1': 'offers.states.pdfGenerated',
            '2': 'offers.states.pdfSent',
            '3': 'offers.states.clientAccepted',
            '-1': 'offers.states.clientDeclined'
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