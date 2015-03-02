angular.module('ama')
    .directive('dragAndDrop', function () {
        return {
            restrict: 'A',
            link: function ($scope, elem, attr) {
                $scope.$on('bindDragging', function (event, data) {
                    data.element.on('dragstart', function (e) {
                        e.originalEvent.dataTransfer.setData('text', JSON.stringify({element: e.target.outerHTML, fromDropArea: data.fromDropArea}));
                        console.log(data);
                    });

                    data.element.on('dragend', function (e) {
                        var dragData = $.parseJSON(e.originalEvent.dataTransfer.getData('text'));
                        if(dragData.fromDropArea)
                            $(e.target).remove();
                    });
                });
            }
        }
    })
    .directive('draggable', function () {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {
                $scope.$emit('bindDragging', {element:elem});
            }
        };
    })

    .directive('droppable', function () {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {

                elem.on('dragover', function (e) {
                    e.preventDefault();
                });

                elem.on('dragenter', function(e) {
                    e.preventDefault();
                });

                elem.on('drop', function (e) {
                    e.preventDefault();
                    var dragged = $.parseJSON(e.originalEvent.dataTransfer.getData('text'));
                    if(!dragged.fromDropArea) {
                        var draggedElement = $($.parseHTML(dragged.element));
                        draggedElement.appendTo(e.target);

                        var eventData = {};
                        eventData.element = draggedElement;
                        eventData.fromDropArea = elem.hasClass('drop-area');
                        $scope.$emit('bindDragging', eventData);
                    }
                });
            }
        };
    });