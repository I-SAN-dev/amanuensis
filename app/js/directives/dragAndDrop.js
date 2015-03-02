/**
 * AngularJS directive for drag and drop functionality based on HTML5 drag and drop API.
 */
angular.module('ama')
    .directive('dragAndDrop', function () {
        return {
            restrict: 'A',
            link: function ($scope, elem, attr) {
                /**
                 * We listen for an event that triggers the binding of the dragstart event to the element.
                 * Thus, new draggable elements can be created at runtime.
                 */
                $scope.$on('bindDragging', function (event, data) {
                    data.element.on('dragstart', function (e) {
                        /**
                         * save some information about the dragged element
                         * the dataTransfer key has to be 'text' due to some weird IE restriction
                         * the value must be a string
                         */
                        e.originalEvent.dataTransfer.setData('text', JSON.stringify({element: e.target.outerHTML, fromDropArea: data.fromDropArea}));
                    });

                    data.element.on('dragend', function (e) {
                        var dragData = $.parseJSON(e.originalEvent.dataTransfer.getData('text'));
                        /**
                         * remove the dragged element from the DOM if it was taken from the drop (=target) area
                         */
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
                /**
                 * Trigger an event to bind the required event listeners to the element
                 */
                $scope.$emit('bindDragging', {element:elem});
            }
        };
    })

    .directive('droppable', function () {
        return {
            restrict: 'A',
            link: function($scope, elem, attr) {
                /**
                 * The dragover event needs to be reset (preventDefault()). If not, the drop event will never fire.
                 */
                elem.on('dragover', function (e) {
                    e.preventDefault();
                });

                elem.on('dragenter', function(e) {
                    e.preventDefault();
                });

                /**
                 * When the drop event fires, copy the element to the drop area and re-bind the dragstart event to it
                 */
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