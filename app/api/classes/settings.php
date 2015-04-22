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
        Authenticator::onlyFor(0);

        if(isset($_POST["key"]) && $_POST["key"] != "" && isset($_POST["value"]))
        {
            $conf = Config::getInstance();

            /* check if key is first-level or second-level*/
            if (strpos($_POST["key"],'.') !== false)
            {
                //true, second-level
                $keylevel = explode('.', $_POST["key"]);

                if( isset($conf->get[ $keylevel[0] ]) &&
                    is_array($conf->get[ $keylevel[0] ]) &&
                    isset($conf->get[ $keylevel[0] ][ $keylevel[1] ]))
                {
                    $conf->get[ $keylevel[0] ][ $keylevel[1] ] = $_POST["value"];
                    $conf->save();
                }
                else
                {
                    // key is not valid
                    $error = new amaException(NULL, 400, "Invalid key.");
                    $error->renderJSONerror();
                    $error->setHeaders();
                }

            }
            else
            {
                //false, first-level
                if(isset($conf->get[$_POST["key"]]))
                {
                    $conf->get[$_POST["key"]] = $_POST["value"];
                    $conf->save();
                }
                else
                {
                    // key is not valid
                    $error = new amaException(NULL, 400, "Invalid key.");
                    $error->renderJSONerror();
                    $error->setHeaders();
                }
            }

        }
        else
        {
            $error = new amaException(NULL, 400, "Not all required parameters given.");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        self::get();
    }
}