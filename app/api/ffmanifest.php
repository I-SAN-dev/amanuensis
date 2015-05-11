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
        "16" => "/favicon-16x16.png",
        "32" => "/favicon-32x32.png",
        "48" => "/img/logo-48.png",
        "64" => "/img/logo-64.png",
        "128" => "/img/logo-128.png",
        "256" => "/img/logo-256.png",
        "30" => "/img/logo-30.png",
        "60" => "/img/logo-60.png",
        "90" => "/img/logo-90.png",
        "120" => "/img/logo-120.png",
    ),
    "developer" => array(
        "name" => "I-SAN.de Webdesign & Hosting GbR",
        "url" => "http://i-san.de"
    ),
);

echo json_encode($manifest);

ob_end_flush();
