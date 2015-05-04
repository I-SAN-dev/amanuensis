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

/*
 *
 * Javascript has to call navigator.mozApps.install('http://sa.ama.i-san.de/manifest.webapp')
 *
 */

header('Content-Type: application/x-web-app-manifest+json');

ob_start();

$conf = Config::getInstance();

$manifest = array(
    "name" => "Amanu",
    "description" => $conf->get['company'],
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
