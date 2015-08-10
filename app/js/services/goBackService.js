/**
 * @class ama.services.GoBackService
 *
 * # GoBackService
 * Just goes back one state (or to the dashboard if no referrer is defined).
 */
app.factory('GoBackService', ['$state', '$stateParams', function ($state, $stateParams) {
    return function () {
        var to = $stateParams.referrer || 'app.dashboard';
        var toParams = $stateParams.referrerParams || {};
        $state.go(to, toParams);
    }
}]);