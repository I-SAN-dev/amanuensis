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
/*
        angular.element('.draggable-item').on('click', function (e) {
            alert('Clicked!');
        });

        angular.element('.draggable-item').on('dragstart', function (e) {
            e.originalEvent.dataTransfer.setData('element', $(this));
            console.log('dragstart');
        });

        angular.element('.drop-area').on('dragover', function (e) {
            e.preventDefault();
        });

        angular.element('.drop-area').on('drop', function (e) {
            e.preventDefault();
        });
        */
    }]
);
