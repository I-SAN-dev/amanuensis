app.factory('PdfService', [
    'ApiAbstractionLayer',
    function (ApiAbstractionLayer) {
        return function (preview, forType, forId) {
            var method = 'POST';
            var paramType = 'data';
            if(preview) {
                method = 'GET';
                paramType = 'params';
            }

            var apiObject = {
                name: 'pdfgen'
            };
            apiObject[paramType] = {
                for: forType,
                forid: forId
            };

            return ApiAbstractionLayer(method, apiObject);
        };
    }
])