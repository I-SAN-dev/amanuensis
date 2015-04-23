<?php
/**
 * This is the entry point of the App
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

set_include_path(getcwd());

require_once 'classes/scripthandling/scriptLoader.php';
require_once 'classes/config/config.php';
require_once 'classes/errorhandling/amaException.php';


$baseurl = $_SERVER['SERVER_PROTOCOL'].'://'.$_SERVER['HTTP_HOST'].'/';

/* Output buffering */
ob_start();
?>
<!DOCTYPE html>
<html lang="en" data-ng-app="ama">
<head>
    <base href="<?php echo($baseurl); ?>">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <script>
        var pageErrors = [];
    </script>
    <?php
        $conf = Config::getInstance();
    ?>
    <title>
        <?php echo $conf->get['company']; ?> - AMANU
    </title>

    <link rel="apple-touch-icon" href="apple-touch-icon.png">

    <?php
        echo ScriptLoader::echoScripts($conf->get['debug']);
    ?>
</head>
<body data-ng-init="getLoginState()">
<div class="navbar navbar-inverse navbar-fixed-top">
    <div class="container-fluid" data-ama-module="'topBar'"></div>
</div>
<div class="container-fluid">
    <div class="row">
        <div class="col-lg-1 col-md-2 col-sm-3">
            <div data-ama-menu data-menuname="'mainNav'"></div>
        </div>
        <div class="col-lg-11 col-md-10 col-sm-9" data-ui-view="mainContent" id="mainContent"></div>
    </div>

</div>



</body>
</html>
<?php
ob_end_flush();
?>
