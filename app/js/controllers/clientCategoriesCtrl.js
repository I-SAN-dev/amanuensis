/**
 * Controller for the client categories list view.
 * Gets the client categories list and holds functions to add and delete client categories in the database.
 */
app.controller('ClientCategoriesCtrl', ['ApiAbstractionLayer', 'LocalStorage', function (ApiAbstractionLayer, LocalStorage) {

    // Get all client categories
    this.allCategories = LocalStorage.getData('clientCategories');
    ApiAbstractionLayer('GET', 'client_categories').then(function (data) {
        self.allCategories = data;
        LocalStorage.setData('clientCategories', data)
    });

    var self = this;
    /**
     * Creates a new client category
     */
    this.addCategory = function () {
        ApiAbstractionLayer('POST', {name: 'client_categories', data: self.newCategory}).then(function (data) {
            self.allCategories.push(data);
            LocalStorage.setData('clientCategories', self.allCategories);
        });
    };

    /**
     * Deletes a client category by given ID
     */
    this.deleteCategory = function (id) {
        ApiAbstractionLayer('DELETE', {name: 'client_categories', data: {id: id}}).then(function (data) {
            self.allCategories = data;
            LocalStorage.setData('clientCategories', self.allCategories);
        });
    };
}]);