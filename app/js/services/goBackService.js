/**
 * @class ama.services.GoBackService
 *
 * # GoBackService
 * Just goes back one state.
 */
app.factory('GoBackService', ['$state', '$stateParams', function ($state, $stateParams) {
    return function () {
        $state.go($stateParams.referrer, $stateParams.referrerParams);
    }
}]);