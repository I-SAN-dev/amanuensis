app.factory('MailService', [
    'ApiAbstractionLayer',
    'constants',
    function (ApiAbstractionLayer, constants) {
        return {
            showPreview: function(type, id){
                var apiObject = {
                    name: 'mail',
                    data: {
                        type: type,
                        id: id
                    }
                };
                ApiAbstractionLayer('POST',apiObject).then(function (data) {
                    window.open(constants.BASEURL+'/api?action=mail&path='+data.previewpath,'','height=500,width=900');
                });
            }
        }
    }
]);