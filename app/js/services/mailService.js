/**
 * @class ama.services.MailService
 * # MailService
 * Holds functions to show and send e-mails.
 */
app.factory('MailService', [
    'ApiAbstractionLayer',
    'NotificationService',
    'constants',
    '$filter',
    '$q',
    function (ApiAbstractionLayer, NotificationService, constants, $filter, $q) {
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
            /**
             * Shows an email preview in a popup window
             * @param {string} type The type of document for which the mail preview shall be shown.
             * @param {int|string} id The ID of the document for which the mail preview shall be shown.
             * @param {string} mailtext An additional text for the email.
             */
            showPreview: function(type, id, mailtext){
                var preview = window.open('','','height=500,width=900');
                var apiObject = createApiObject(type, id, mailtext);
                ApiAbstractionLayer('POST',apiObject).then(function (data) {
                    preview.location.href = constants.URL+'/api?action=mail&path='+data.previewpath;
                });
            },
            /**
             * Sends an email with information about a given document. Notifies the user when the email was sent.
             * @param {string} type The type of document for which the mail preview shall be shown.
             * @param {int|string} id The ID of the document for which the mail preview shall be shown.
             * @param {string} mailtext An additional text for the email.
             * @returns {promise} The answer from the API
             */
            send: function(type, id, mailtext) {
                var defer = $q.defer();
                var apiObject = createApiObject(type, id, mailtext);
                apiObject.data.send = true;
                ApiAbstractionLayer('POST', apiObject).then(function(data){
                    NotificationService($filter('translate')(type+'.notifications.emailSent'),5000);
                    defer.resolve(data);
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            }
        }
    }
]);