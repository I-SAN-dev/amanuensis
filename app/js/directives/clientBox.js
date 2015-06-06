/**
 * @class ama.directives.clientBox
 *
 * The clientBox directive
 * Shows a client's data (address etc.)
 *
 * ## Usage
 *     <div client-box="clientToShow"></div>
 *
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