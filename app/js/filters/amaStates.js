app.filter('amaStates', function () {
    var statusCodes = {
        offer: {
            '0': 'created',
            '1': 'PDF generated',
            '2': 'PDF sent',
            '3': 'client accepted',
            '-1': 'client declined'
        }
    };

    return function(input, type){
        return statusCodes[type][input];
    }
});