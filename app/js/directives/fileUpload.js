/**
 * @class ama.directives.fileUpload
 *
 * The fileUpload directive & service.
 * Handles file uploads.
 *
 * Attribution: http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
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
    .service('fileUploadService', ['$http', '$q', function ($http, $q) {


        /**
         * @param file
         * @param uploadUrl
         * @returns {Promise}
         *
         * Uploads the specified file to the specified url.
         */
        this.uploadFile = function(file, uploadUrl){
            var fd = new FormData();
            fd.append('file', file);
            var defer = $q.defer();
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(data){
                    defer.resolve(data.path);
                })
                .error(function(error){
                    defer.reject(error)
                });
            return defer.promise;
        }
    }]);