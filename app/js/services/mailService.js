app.factory('MailService', [
    'ApiAbstractionLayer',
    'constants',
    function (ApiAbstractionLayer, constants) {
        var createApiObject = function (type, id, mailtext) {
            var apiObject = {
                name: 'mail',
                data: {
                    type: type,
                    id: id,
                    additional: mailtext
                }
            };
            console.log(mailtext);
            if(mailtext){
                apiObject.data.additional = mailtext;
            }
            return apiObject;
        };
        return {
            showPreview: function(type, id, mailtext){
                var preview = window.open('','','height=500,width=900');
                var apiObject = createApiObject(type, id, mailtext);
                ApiAbstractionLayer('POST',apiObject).then(function (data) {
                    preview.location.href = constants.BASEURL+'/api?action=mail&path='+data.previewpath;
                });
            },
            send: function(type, id, mailtext) {
                var apiObject = createApiObject(type, id, mailtext);
                apiObject.data.send = true;
                return ApiAbstractionLayer('POST', apiObject);
            }
        }
    }
]);