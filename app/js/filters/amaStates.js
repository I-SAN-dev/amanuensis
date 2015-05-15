app.filter('amaStates', function () {
    var statusCodes = {
        offer: {
            '0': 'offers.states.created',
            '1': 'offers.states.pdfGenerated',
            '2': 'offers.states.pdfSent',
            '3': 'offers.states.clientAccepted',
            '-1': 'offers.states.clientDeclined'
        }
    };

    return function(input, type){
        return statusCodes[type][input];
    }
});