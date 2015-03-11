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

/* Output buffering */
ob_start();
?>
<!DOCTYPE html>
<html lang="en" ng-app="ama">
<head>
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
<body>
<div data-ui-view="mainContent"></div>
<ul>
    <li>
        <a data-ui-sref="index">Home</a>
    </li>
    <li>
        <a data-ui-sref="login">Login</a>
    </li>
</ul>
hello world lalala<br/>

</body>
</html>
<?php
ob_end_flush();
?>
