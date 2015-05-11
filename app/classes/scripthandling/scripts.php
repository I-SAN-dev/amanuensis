<?php
/**
 * Static class that holds the links to all needed scripts from root
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

class Scripts
{
    /**
     * @var array $libs
     * Holds the path to all library js files
     */
    public static $libs = array(
        "lib/jquery-2.1.3.min.js",
        "lib/angular-1.3.14.min.js",
        "lib/bootstrap.min.js",
        "lib/modules/angular-ui-router.min.js",
        "lib/modules/angular.btf-modal.min.js",
        "lib/modules/angular-translate.min.js",
        "lib/modules/angular-translate-loader-static-files.min.js",
        "lib/modules/angular-animate.min.js",
        //"lib/modules/angular-sanitize.min.js",
        "lib/modules/textAngular-sanitize.js",
        "lib/sha256.js",
        "lib/summernote.min.js",
        "js/app.js", // has to be loaded before the other scripts
    );
    /**
     * @var array $byTemplate
     * Holds the path to all templates that should be compiled
     */
    public static $byTemplate = array(
        "constants.jst",
        "modules.jst",
    );

    /**
     * @var array $scripts
     * Holds the path to all default js files
     */
    public static $scripts = array(
        // Filters
        "js/filters/sha256.js",
        "js/filters/amaStates.js",
        // Services
        "js/services/authService.js",
        "js/services/apiAbstractionLayer.js",
        "js/services/errorDialog.js",
        "js/services/deleteService.js",
        "js/services/localStorage.js",
        "js/services/masterDetailService.js",
        "js/services/itemService.js",
        // Directives
        "js/directives/menu.js",
        "js/directives/module.js",
        "js/directives/masterDetail.js",
        "js/directives/inPlaceEdit.js",
        "js/directives/materialInput.js",
        //Controllers
        //"js/controllers/rootCtrl.js",
        "js/controllers/authCtrl.js",
        "js/controllers/clientsCtrl.js",
        "js/controllers/clientDetailCtrl.js",
        "js/controllers/clientCategoriesCtrl.js",
        "js/controllers/clientCreationCtrl.js",
        "js/controllers/projectsCtrl.js",
        "js/controllers/projectDetailCtrl.js",
        "js/controllers/projectCreationCtrl.js",
        "js/controllers/acceptancesCtrl.js",
        "js/controllers/invoicesCtrl.js",
        "js/controllers/offersCtrl.js",
        "js/controllers/offerDetailCtrl.js",
        "js/controllers/itemPresetsCtrl.js",
        "js/controllers/itemPresetDetailCtrl.js",
        "js/controllers/itemPresetCreationCtrl.js",
        "js/controllers/itemCreationCtrl.js",
        "js/controllers/settingsCtrl.js",
    );

    /**
     * @var array $css
     * Holds the path to all css files
     */
    public static $css = array(
        "css/ama.css",
    );
}


?>