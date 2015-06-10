/**
 * @class ama.directives.todoStats
 *
 * The todoStats directive
 * Shows a nice todo/done graph
 *
 * ## Usage
 *
 *     <div todo-stats="theTodoStatsObject"></div>
 * @author Sebastian Antosch
 */
app.directive('todoStats', [
    function () {
        // these input types are available

        return {
            restrict: 'A',
            scope: {
                stats:'=todoStats'
            },
            controller: function ($scope, amaDateFilter) {

                $scope.angle=90;
                $scope.bgorfg = '#FFB300';

                $scope.$watch('stats', function(){

                    if($scope.stats)
                    {
                        $scope.open = $scope.stats.items_total - $scope.stats.items_done;
                        $scope.done = $scope.stats.items_done;
                        $scope.due = $scope.stats.due;


                        /* calc percent */
                        var percent = $scope.stats.items_total == 0 ? 0 : $scope.done / $scope.stats.items_total;
                        /* calc degrees */
                        var degrees = percent * 360;
                        if(degrees < 180)
                        {
                            $scope.bgorfg = '#FFB300';
                            $scope.angle = 90+degrees;
                        }
                        else
                        {
                            $scope.bgorfg = '#009688';
                            $scope.angle = -90+degrees;
                        }

                    }


                });

                $scope.checkOverdue = function()
                {
                    if($scope.stats)
                    {
                        if($scope.stats.due === undefined || $scope.stats.due == null)
                        {
                            return false;
                        }

                        var duedate = $scope.stats.due.replace(/\s/g, "T");
                        return Date.parse(duedate) < Date.now();
                    }
                    else
                    {
                        return false;
                    }
                };






            },
            replace: true,
            templateUrl: 'templates/directives/todoStats.html'
        }
    }
]);