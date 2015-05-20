app.factory('PanelService', [
    function () {
        var panelMax = {
            clients: 3,
            items: 3,
            offers: 2
        };

        var panels = {};

        return {
            getPanel: function (site) {
                if(panels[site])
                    return panels[site];
                else return 1;
            },
            setPanel: function(site, panel){
                if(panelMax[site]<=panel && panel > 0)
                    panels[site] = panel;
            }
        };
    }
]);