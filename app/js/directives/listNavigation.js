/**
 * @class ama.directives.listNavigation
 *
 * The listNavigation directive
 * Shows a list and handles keyboard inputs to navigate through that list
 *
 * ## Usage
 *    <div list-navigation="callbackFunction"
 *         list="listToNavigateThrough"
 *         active="activeListItem (optional)"
 *         filter-text="filterForTheList (optional)"></div>
 *
 *
 * @author Christian Baur
 */
app.directive('listNavigation',[
    '$document',
    '$filter',
    function ($document, $filter) {
        return {
            restrict: 'A',
            scope: {
                list: '=',
                active: '=',
                callback: '=listNavigation',
                filterText:'=filterText'
            },
            link:function(scope, elem) {

                scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    if(!toParams.hasDetails){
                        $document.unbind('keyup');
                        $document.unbind('keydown');
                    }
                    console.log(event, toState, toParams, fromState, fromParams);
                });

                var scrollArea = angular.element(elem);

                var callback = scope.callback;

                /**
                 * Looks for the next or previous item in the master list
                 * @param offset - specifies how many items to go back or forward in the list
                 * @returns {*} - the requested neighbor object
                 */
                var getNeighbor = function (offset, active, list) {
                    var oldPos;
                    if (active) {
                        oldPos = list.indexOf(active);
                        if (oldPos == -1) {
                            //console.log(list);
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].id > active.id) {
                                    list.splice(i, 0, active);
                                    oldPos = i;
                                    break;
                                }
                            }
                        }
                    } else {
                        oldPos = -offset;
                    }

                    return oldPos + offset;
                };

                var getFilteredList = function () {
                    if(scope.filterText){
                        return $filter('filter')(scope.list, scope.filterText);
                    } else return scope.list;
                };

                // select the only element left in the list when the list is filtered down to one element
                $document.unbind('keyup');
                $document.on('keyup', function (event) {
                    var list = getFilteredList();
                    if (list.length == 1) {
                        callback(list[0]);
                    }
                });

                // navigate to the next or previous item when up or down key is pressed
                $document.unbind('keydown');
                $document.on('keydown', function (event) {
                    var list = getFilteredList();

                    var domList = $(elem[0]).find('[data-ng-repeat]');


                    var active = scope.active || null;
                    var key = event.keyCode;

                    var animation = {
                        duration: 500,
                        queue: false
                    };
                    var documentOffset = 40;
                    var newActiveOffset;


                    var viewportHeight = scrollArea.height();
                    var scrollTop = scrollArea.scrollTop();

                    var position;
                    if (key == 38) { // arrow up
                        event.stopPropagation();
                        event.preventDefault();
                        position = getNeighbor(-1, active, list);
                        var prevDetail = list[position];

                        if (prevDetail) {
                            callback(prevDetail, true);
                            if(domList[position]) {
                                newActiveOffset = $(domList[position]).position();
                                newActiveOffset = newActiveOffset.top - domList[position].offsetHeight;
                                if (newActiveOffset < 0) {
                                    // scroll to the element
                                    var newScrollTop = scrollTop + newActiveOffset ;
                                    scrollArea.animate({scrollTop: newScrollTop}, animation);
                                }

                            }
                        }
                    }
                    if (key == 40) { // arrow down
                        event.stopPropagation();
                        event.preventDefault();

                        position = getNeighbor(1, active, list);
                        var nextDetail = list[position];

                        if (nextDetail) {
                            callback(nextDetail, true);
                            console.log(domList);
                            if(domList[position]) {
                                var newActiveItem = $(domList[position]);

                                newActiveOffset = newActiveItem.position();
                                newActiveOffset = newActiveItem.height() + newActiveOffset.top;
                                if (newActiveOffset > viewportHeight) {
                                    // scroll to the element
                                    scrollArea.animate({scrollTop: scrollTop + (newActiveOffset - viewportHeight)}, animation);
                                }
                            }
                        }
                    }
                });
            }
    }
}]);