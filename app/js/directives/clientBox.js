/**
 * The clientBox directive
 * Shows client data
 *
 * @author Christian Baur
 */
app.directive('clientBox', [
    function () {
        return {
            restrict: 'A',
            scope: {
                client: '=clientBox'
            },
            templateUrl: 'templates/directives/clientBox.html'
        }
    }
]);