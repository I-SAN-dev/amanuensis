/**
 * @class ama.services.RefnumberService
 * # RefnumberService
 * Gets the next refnumber for a given document type in the current project.
 * @param {string} type The type of document to get the refnumber for
 * @param {string|int} project The ID of the current project
 */
app.factory('RefnumberService', ['ApiAbstractionLayer', function(ApiAbstractionLayer){
    return function (type, project) {
        return ApiAbstractionLayer('GET',{name:'refnumber', params: {for:type, project: project}});
    };
}]);