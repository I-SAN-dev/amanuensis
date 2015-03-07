/**
 * AngularJS directive for drag and drop functionality based on HTML5 drag and drop API.
 */
angular.module('ama')
    .directive('dragAndDrop', function () {
        return {
            restrict: 'A',
            controller: function ($scope) {
                var self = this;

                var Draggable = function (elem) {
                    return {
                        element: elem,
                        draggedOverEdge: false,
                        dragSource: elem.parent(),
                        currDragTarget: null
                    }
                };

                var droppables = [];
                var draggables = [];
                this.addDroppable = function (droppable) {
                    droppables.push(droppable);
                };
                this.addDraggable = function (elem) {
                    var draggable = new Draggable(elem);
                    console.log(draggable);
                    draggables.push(draggable);


                    draggable.element.on('dragstart', function (e) {
                        /**
                         * The next line is just here to activate the HTML5 drag & drop API
                         * the dataTransfer key has to be 'text' due to some weird IE restriction
                         * the value must be a string, but can be left empty because we don't use it
                         */
                        e.originalEvent.dataTransfer.setData('text', '');
                        // the transferred data is actually stored in the model
                        self.setCurrentlyDragged(draggable);
                    });

                    draggable.element.on('dragend', function (e) {
                        //var dragData = $.parseJSON(e.originalEvent.dataTransfer.getData('text'));
                        /**
                         * remove the dragged element from the DOM if it was taken from the drop (=target) area
                         */
                        /*if(dragData.fromDropArea)
                            $(e.target).remove();*/

                        self.setCurrentlyDragged(null);
                        draggable.draggedOverEdge = false;
                    });
                };
                var currentlyDragged = null;
                this.setCurrentlyDragged = function (draggable) {
                    currentlyDragged = draggable;
                };
                this.getCurrentlyDragged = function () {
                    return currentlyDragged;
                }
            },
            link: function ($scope, elem, attr) {
                /**
                 * We listen for an event that triggers the binding of the dragstart event to the element.
                 * Thus, new draggable elements can be created at runtime.
                 */
                $scope.$on('bindDragging', function (event, data) {

                });
            }
        }
    })
    .directive('draggable', function () {
        return {
            restrict: 'A',
            require: '^dragAndDrop',
            link: function($scope, elem, attr, ctrl) {

                ctrl.addDraggable(elem);
                /**
                 * Trigger an event to bind the required event listeners to the element
                 */
                //$scope.$emit('bindDragging', {element:elem});
            }
        };
    })

    .directive('droppable', function () {
        return {
            restrict: 'A',
            require: '^dragAndDrop',
            link: function($scope, elem, attr, ctrl) {
                ctrl.droppable = elem;
                /**
                 * The dragover event needs to be reset (preventDefault()). If not, the drop event will never fire.
                 */
                elem.on('dragover', function (e) {
                    e.preventDefault();
                });

                elem.on('dragenter', function(e) {
                    e.preventDefault();
                    var dragged = ctrl.getCurrentlyDragged();
                    dragged.currDragTarget = elem;
                    if (elem == dragged.dragSource)
                        dragged.draggedOverEdge = false;
                    else
                        dragged.draggedOverEdge = true;
                    ctrl.setCurrentlyDragged(dragged);

                });

                elem.on('dragleave', function (e) {
                    e.preventDefault();
                    var dragged = ctrl.getCurrentlyDragged();
                    dragged.currDragTarget = null;
                    if (elem == dragged.dragSource) {
                        dragged.draggedOverEdge = true;
                    }
                });

                /**
                 * When the drop event fires, copy the element to the drop area and re-bind the dragstart event to it
                 */
                elem.on('drop', function (e) {
                    e.preventDefault();
                    var dragged = ctrl.getCurrentlyDragged();
                    console.log(dragged.dragSource, elem, $(elem));
                    if(dragged.dragSource.is(elem)) {
                        console.log(true);
                        dragged.element.appendTo(e.target);
                    }
                    else {
                        var draggedElem = dragged.element.clone();
                        draggedElem.appendTo(e.target);
                        draggedElem.dragSource = elem;
                        ctrl.addDraggable(draggedElem);
                    }


                });
            }
        };
    });