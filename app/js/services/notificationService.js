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
    '$window',
    '$timeout',
    '$filter',
    function ($document, $window, $timeout, $filter) {
        return function (message, duration)
        {
            var snackbar = $('<div class="snackbar snackbar-hide"><div>'+$filter('translate')(message)+'</div></div>');
            $($document[0].body).append(snackbar);

            /* Immediate transitions are optimized away by browsers. We need to wait a little bit */
            $window.requestAnimationFrame(function(){
                snackbar.removeClass('snackbar-hide');
            });

            $timeout(function ()
            {
                snackbar.addClass('snackbar-hide');
                snackbar.on('transitionend', function()
                {
                    snackbar.remove();
                });

            }, duration);
        };
    }
]);