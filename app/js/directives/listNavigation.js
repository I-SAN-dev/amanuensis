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

                var scrollArea = angular.element(elem);

                var callback = scope.callback;

                /**
                 * Looks for the next or previous item in the master list
                 * @param offset - specifies how many items to go back or forward in the list
                 * @returns {*} - the requested neighbor object
                 */
                var getNeighbor = function (offset, active, list) {

                    //console.log(list);
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
                            //console.log(list);
                        }
                    } else {
                        oldPos = -offset;
                    }

                    console.log(oldPos);
                    return oldPos + offset;
                };

                // select the only element left in the list when the list is filtered down to one element
                $document.unbind('keyup');
                $document.on('keyup', function (event) {
                    var list = $filter('filter')(scope.list, scope.filterText);
                    if (list.length == 1) {
                        callback(list[0]);
                    }
                });

                // navigate to the next or previous item when up or down key is pressed
                $document.unbind('keydown');
                $document.on('keydown', function (event) {
                    var list = $filter('filter')(scope.list, scope.filterText);

                    var domList = elem[0].children;


                    var active = scope.active || null;
                    var key = event.keyCode;

                    var animation = {
                        duration: 500,
                        queue: false
                    };
                    var documentOffset = 40;
                    var newActiveOffset;


                    var viewportHeight = scrollArea.height();
                    console.log(viewportHeight);
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
                                console.log(newActiveOffset,scrollTop);
                                if (newActiveOffset < 0) {
                                    var newScrollTop = scrollTop + newActiveOffset ;
                                    console.log(newScrollTop);
                                    scrollArea.animate({scrollTop: newScrollTop}, animation);
                                }

                            }
                        }
                    }
                    if (key == 40) {
                        event.stopPropagation();
                        event.preventDefault();


                        position = getNeighbor(1, active, list);
                        var nextDetail = list[position];
                        console.log(nextDetail);
                        if (nextDetail) {
                            callback(nextDetail, true);
                            if(domList[position]) {
                                var newActiveItem = $(domList[position]);

                                newActiveOffset = newActiveItem.position();
                                newActiveOffset = newActiveItem.height() + newActiveOffset.top;
                                console.log(newActiveOffset);
                                if (newActiveOffset > viewportHeight) {
                                    scrollArea.animate({scrollTop: scrollTop + (newActiveOffset - viewportHeight)}, animation);
                                }
                            }
                        }
                    }
                });
            }
    }
}]);