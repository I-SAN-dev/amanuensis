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
        "lib/modules/angular-pickadate.min.js",
        "lib/modules/ng-sortable.min.js",
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
        "js/filters/noSpace.js",
        "js/filters/price.js",
        "js/filters/gender.js",
        "js/filters/amaDate.js",
        // Services
        "js/services/authService.js",
        "js/services/apiAbstractionLayer.js",
        "js/services/notificationService.js",
        "js/services/errorDialog.js",
        "js/services/deleteService.js",
        "js/services/localStorage.js",
        "js/services/masterDetailService.js",
        "js/services/itemService.js",
        "js/services/pdfService.js",
        "js/services/mailService.js",
        "js/services/refnumberService.js",
        "js/services/itemContainerService.js",
        "js/services/panelService.js",
        "js/services/stateManager.js",
        "js/services/nextStepModal.js",
        // Directives
        "js/directives/menu.js",
        "js/directives/module.js",
        "js/directives/masterDetail.js",
        "js/directives/paymentStats.js",
        "js/directives/todoStats.js",
        "js/directives/inPlaceEdit.js",
        "js/directives/materialInput.js",
        "js/directives/clientBox.js",
        "js/directives/listNavigation.js",
        "js/directives/fileUpload.js",
        //Controllers
        //"js/controllers/rootCtrl.js",
        "js/controllers/authCtrl.js",
        "js/controllers/dashboardCtrl.js",
        "js/controllers/clientsCtrl.js",
        "js/controllers/clientDetailCtrl.js",
        "js/controllers/clientCategoriesCtrl.js",
        "js/controllers/clientCreationCtrl.js",
        "js/controllers/projectArchiveCtrl.js",
        "js/controllers/projectDetailCtrl.js",
        "js/controllers/projectCreationCtrl.js",
        "js/controllers/accDetailCtrl.js",
        "js/controllers/invoicesCtrl.js",
        "js/controllers/offersCtrl.js",
        "js/controllers/offerDetailCtrl.js",
        "js/controllers/offerCreationCtrl.js",
        "js/controllers/contractDetailCtrl.js",
        "js/controllers/contractCreationCtrl.js",
        "js/controllers/acceptanceCreationCtrl.js",
        "js/controllers/invoiceCreationCtrl.js",
        "js/controllers/invoiceDetailCtrl.js",
        "js/controllers/itemPresetsCtrl.js",
        "js/controllers/itemPresetDetailCtrl.js",
        "js/controllers/itemPresetCreationCtrl.js",
        "js/controllers/itemDetailCtrl.js",
        "js/controllers/itemCreationCtrl.js",
        "js/controllers/settingsCtrl.js",
        "js/controllers/todoDetailCtrl.js",
        "js/controllers/todoCreationCtrl.js",
        "js/controllers/reminderDetailCtrl.js",
        "js/controllers/reminderCreationCtrl.js",
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