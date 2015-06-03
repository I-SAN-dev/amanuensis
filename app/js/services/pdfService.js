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