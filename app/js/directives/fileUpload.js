/**
 * @class ama.directives.fileUpload
 *
 * The fileUpload directive.
 * Handles file uploads. Also see {@link ama.services.fileUploadService}
 *
 * ## Usage
 *
 *     <input file-upload></input>
 *
 * [Based on code from uncorkedstudios.com](http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs)
 */
app.directive('fileUpload', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileUpload);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}])
    /**
     * @class ama.services.fileUploadService
     *
     * Provides a function to upload a file to the server.
     *
     */
    .service('fileUploadService', ['NotificationService', 'ErrorDialog', '$http', '$q', '$rootScope', function (NotificationService, ErrorDialog, $http, $q, $rootScope) {


        /**
         * @param file
         * @param uploadUrl
         * @returns {Promise}
         *
         * Uploads the specified file to the specified url.
         */
        this.uploadFile = function(file, uploadUrl){
            $rootScope.loaded = false;
            var fd = new FormData();
            fd.append('file', file);
            var defer = $q.defer();
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(data){
                    defer.resolve(data.path);
                    $rootScope.loaded= true;
                    NotificationService('global.notifications.uploadSucceeded',5000);
                })
                .error(function(error){
                    defer.reject(error);
                    $rootScope.loaded = true;
                    ErrorDialog(error.error).activate();
                });
            return defer.promise;
        };
    }]);