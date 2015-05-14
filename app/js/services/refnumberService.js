app.factory('RefnumberService', ['ApiAbstractionLayer', function(ApiAbstractionLayer){
    return function (type, project) {
        return ApiAbstractionLayer('GET',{name:'refnumber', params: {for:type, project: project}});
    };
}]);