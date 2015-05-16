/**
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
    .service('fileUploadService', ['$http', '$q', function ($http, $q) {
        this.uploadFileToUrl = function(file, uploadUrl){
            var fd = new FormData();
            fd.append('file', file);
            var defer = $q.defer();
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
                .success(function(path){
                    defer.resolve(path);
                })
                .error(function(error){
                    defer.reject(error)
                });
            return defer.promise;
        }
    }]);