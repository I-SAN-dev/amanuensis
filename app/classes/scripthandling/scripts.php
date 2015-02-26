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
        "lib/modules/angular-ui-router.min.js",
    );

    /**
     * @var array $byTemplate
     * Holds the path to all templates that should be compiled
     */
    public static $byTemplate = array(
        "compileme.jst",
    );

    /**
     * @var array $scripts
     * Holds the path to all default js files
     */
    public static $scripts = array(
        "js/app.js",
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