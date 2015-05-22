app.factory('MailService', [
    'ApiAbstractionLayer',
    'constants',
    function (ApiAbstractionLayer, constants) {
        return {
            showPreview: function(type, id){
                var preview = window.open('','','height=500,width=900');
                var apiObject = {
                    name: 'mail',
                    data: {
                        type: type,
                        id: id
                    }
                };
                ApiAbstractionLayer('POST',apiObject).then(function (data) {
                    preview.location.href = constants.BASEURL+'/api?action=mail&path='+data.previewpath;
                });
            },
            send: function(type, id) {
                var apiObject = {
                    name: 'mail',
                    data: {
                        type: type,
                        id: id,
                        send: true
                    }
                };
                return ApiAbstractionLayer('POST', apiObject);
            }
        }
    }
]);