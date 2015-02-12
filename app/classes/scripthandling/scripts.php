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
        "link/to/jsfile/which/is/a/lib.js",
    );

    /**
     * @var array $byTemplate
     * Holds the path to all templates that should be compiled
     */
    public static $byTemplate = array(
        "link/to/jstemplate/that/should/be/compiled.jst",
        "link/to/jstemplate/that/should/be/compiled.jst",
    );

    /**
     * @var array $scripts
     * Holds the path to all default js files
     */
    public static $scripts = array(
        "link/to/jsfile/which/is/nice.js",
    );

    /**
     * @var array $css
     * Holds the path to all css files
     */
    public static $css = array(
        "link/to/cssfile/which/is/nice.css",
    );
}


?>