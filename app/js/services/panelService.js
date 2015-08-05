/**
 * @class ama.services.PanelService
 * # PanelService
 * Holds functions to set and get the current panel to show in some views
 */
app.factory('PanelService', [
    function () {
        var panelMax = {
            clients: 3,
            items: 3,
            offers: 2
        };

        var panels = {};

        return {
            /**
             * Gets the currently shown panel of a specified view
             * @param {string} site Name of the view
             * @returns {int} The number of the currently shown panel
             */
            getPanel: function (site) {
                if(panels[site])
                    return panels[site];
                else return 1;
            },
            /**
             * Sets the panel to show in a specified view
             * @param site Name of the view
             * @param panel The number of the panel which should be shown
             */
            setPanel: function(site, panel){
                if(panelMax[site] >= panel && panel > 0)
                    panels[site] = panel;
            }
        };
    }
]);