<?php
/**
 * Handles setting updates
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

if(!$thisisamanu)die('Direct access restricted');

require_once('classes/errorhandling/amaException.php');
require_once('classes/authentication/authenticator.php');
require_once('classes/config/config.php');

class settings {

    /**
     * Echoes the current config
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0);

        $conf = Config::getInstance();

        $array = $conf->get;
        /* Censor some config values, they only can be set but not read */
        $array["db"]["password"] = '*****';
        $array["appsecret"] = '*****';

        json_response($array);
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        echo 'Hello World: that was a post!';
    }


}