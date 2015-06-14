/**
 * @class ama.directives.clientBox
 *
 * The clientBox directive
 * Shows a client's data (address etc.)
 *
 * ## Usage
 *     <div client-box="clientToShow"></div>
 *
 *
 * @author Christian Baur
 */
app.directive('clientBox', [
    function () {
        return {
            restrict: 'A',
            scope: {
                client: '=clientBox'
            },
            templateUrl: 'templates/directives/clientBox.html',
            controller: function($scope){

                var mailvalue;
                var mailname;

                $scope.$watch('client', function(){
                    if($scope.client && $scope.client.data && $scope.client.data.mail)
                    {
                        for(var i = 0; i<$scope.client.data.mail.length; i++ )
                        {
                            if(i==0 || $scope.client.data.mail[i].isdefault == 1)
                            {
                                mailvalue = $scope.client.data.mail[i].value;
                                mailname = $scope.client.data.mail[i].name;
                            }
                        }
                        $scope.mail = {};
                        $scope.mail.value = mailvalue;
                        $scope.mail.name = mailname;
                    }
                });

            }
        }
    }
]);