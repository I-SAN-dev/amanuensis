<?php
/**
 * This will display a firefox webapp manifest
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

chdir('..');
set_include_path(getcwd());

require_once 'classes/config/config.php';

if(isset($_GET["test"]))
{
    ?>

    <html>
    <head><title>Test</title></head>
    <body>
    <p>
        <button onclick="navigator.mozApps.install('http://sa.ama.i-san.de/manifest.webapp')">install</button>
    </p>
    </body>
    </html>

    <?php
    die();
}

header('Content-Type: application/x-web-app-manifest+json');

ob_start();

$manifest = array(
    "name" => "Amanu",
    "description" => "Test",
    "launch_path" => "/",
    "icons" => array(
        "128" => "/img/logo.svg"
    ),
    "developer" => array(
        "name" => "I-SAN.de Webdesign & Hosting GbR",
        "url" => "http://i-san.de"
    ),
);

echo json_encode($manifest);

ob_end_flush();
