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
            console.log(this.draggableElements);
        };

    }]
)
.directive('draggable', function () {
    return {
        restrict: 'A',
        link: function($scope, elem, attr) {
            elem.on('dragstart', function (e) {
                e.originalEvent.dataTransfer.setData('element', $(this));
                console.log('dragstart');
            })
        }
    };
})
.directive('droppable', function () {
    return {
        restrict: 'A',
        link: function($scope, elem, attr) {

            elem.on('dragover', function (e) {
                e.preventDefault();
                console.log('dragover');
            });

            elem.on('drop', function (e) {
                e.preventDefault();
                console.log('drop');
            });
        }
    };
});