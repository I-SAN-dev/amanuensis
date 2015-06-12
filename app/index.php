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
<html lang="en" data-ng-app="ama">
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
    <base href="<?php echo($conf->getUrl(false)); ?>" />
    <title>
        <?php echo $conf->get['company']; ?> - AMANU
    </title>

    <!-- Favicon stuff -->
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-title" content="amanu">
    <meta name="application-name" content="amanu">
    <meta name="msapplication-TileColor" content="#404877">
    <meta name="msapplication-TileImage" content="/mstile-144x144.png">
    <meta name="theme-color" content="#404877">
    <!-- End Favicon stuff -->

    <?php
        echo ScriptLoader::echoScripts($conf->get['debug']);
    ?>
</head>
<body>

    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid" data-ama-module="'topBar'"></div>
    </div>

    <div id="mainCanvas">
            <div data-ui-view="mainContent" id="mainContent" class="fullheight"></div>
    </div>
<?php
    // basic Angular i18n
    $lang = $conf->get['lang'];
    if($lang != 'en'):
?>
    <script src="lib/angular-locales/angular-locale_<?php echo $lang; ?>.js"></script>
<?php
endif;
?>

</body>
</html>
<?php
ob_end_flush();
?>
