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


                // navigate to the next or previous item when up or down key is pressed
                $document.unbind('keyup');
                $document.on('keyup', function (event) {
                    var list = $filter('filter')(scope.list, scope.filterText);

                    var domList = elem[0].children;

                    console.log(event);
                    if(list.length==1){
                        callback(list[0]);
                        return;
                    }
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
                            callback(prevDetail);
                            if(domList[position-1]) {
                                newActiveOffset = $(domList[position - 1]).position().top;
                                console.log(newActiveOffset);
                                if (newActiveOffset < scrollTop)
                                    scrollArea.animate({scrollTop: newActiveOffset - documentOffset}, animation);
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
                            callback(nextDetail);
                            if(domList[position+1]) {
                                var newActiveItem = $(domList[position + 1]);
                                console.log(newActiveItem);
                                newActiveOffset = newActiveItem.height() + newActiveItem.position().top;

                                if (newActiveOffset > viewportHeight) {
                                    scrollArea.animate({scrollTop: scrollTop + newActiveItem.height() + documentOffset}, animation);
                                }
                            }
                        }
                    }
                });
            }
    }
}]);