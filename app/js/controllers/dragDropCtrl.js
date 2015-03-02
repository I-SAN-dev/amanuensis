/**
 * Created by Christian on 01.03.2015.
 */
angular.module('ama')
.controller('DragDropCtrl', [function(){
        this.element = {
            text: 'My fancy text',
            type: 'div'
        };

        this.draggableElements = [];

        this.addElement = function(text, type) {
            this.draggableElements.push({text: text, type: type});
        };

    }]
)
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
                        if (elem.hasClass('drop-area')) {
                            eventData.fromDropArea = true;
                        } else {
                            eventData.fromDropArea = false;
                        }
                        $scope.$emit('bindDragging', eventData);
                    }
                });
            }
        };
    });