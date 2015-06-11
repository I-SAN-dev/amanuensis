/**
 * @class ama.services.NotificationService
 * # The NotificationService
 *
 * Shows a provided message in a box (so called snackbar) which is removed from the DOM after a provided duration
 *
 * @param {String} message The message to be shown. Should be a translatable language string
 * @param {integer} duration The time in ms the snackbar is to be shown
 */
app.factory('NotificationService', [
    '$document',
    '$timeout',
    '$filter',
    function ($document, $timeout, $filter) {
        return function (message, duration) {
            var html = '<div class="snackbar snackbar-hide"><div>'+$filter('translate')(message)+'</div></div>';
            $($document[0].body).append(html);
            $('.snackbar').removeClass('snackbar-hide').addClass('snackbar-show');
            $timeout(function () {
                $timeout(function(){
                    $('.snackbar').removeClass('snackbar-show').addClass('snackbar-hide');
                }, 500).then(function () {
                    $('.snackbar').remove();
                });
            }, duration);
        };
    }
]);