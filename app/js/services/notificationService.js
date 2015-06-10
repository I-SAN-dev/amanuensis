app.factory('NotificationService', [
    '$document',
    '$timeout',
    function ($document, $timeout) {
        return function (message, duration) {
            var html = '<div class="snackbar snackbar-hide"><div>'+message+'</div></div>';
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