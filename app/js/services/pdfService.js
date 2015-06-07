/**
 * @class ama.services.PdfService
 * Shows a PDF representation of a document in a popup window.
 * @param {Event} event The event that led to the call of the service
 * @param {boolean} preview Indicates if a preview should be rendered or the actual PDf should be shown
 * @param {string} forType The type of the document for which the PDF representation shall be shown
 * @param {string|int} forId The ID of the document for which the PDF representation shall be shown
 * @param {string} pdfPath *Optional.* The path to the PDF saved on the server.
 * @returns {promise} A promise containing the answer from the API
 */
app.factory('PdfService', [
    'ApiAbstractionLayer',
    'constants',
    '$q',
    function (ApiAbstractionLayer, constants, $q) {
        var popup;
        var openPopup = function (viewPath) {
            popup = window.open(
                viewPath,
                '',
                'height=500,width=900'
            );
        };

        return function (event, preview, forType, forId, pdfPath) {
            event.preventDefault();


            var defer = $q.defer();


            if(preview) {
                openPopup(constants.BASEURL+'/api?action=pdfgen&for='+forType+'&forid='+forId);
                if(forType == 'contract'){
                    popup.print();
                }
                defer.resolve();

            } else {
                if(pdfPath){
                    openPopup(constants.BASEURL+'/api?action=protectedpdf&path='+pdfPath);
                    if(forType == 'contract'){
                        popup.print();
                    }
                    defer.resolve();
                } else {
                    var apiObject = {
                        name: 'pdfgen',
                        data: {
                            for: forType,
                            forid: forId
                        }
                    };


                    ApiAbstractionLayer('POST', apiObject).then(function (data) {
                        defer.resolve(data);
                    }, function (error) {
                        defer.reject(error);
                    });

                }
            }

            return defer.promise;




        };
    }
]);