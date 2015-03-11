<?php
/**
 * This static class handles Login Sessions, wraps the default PHP session handling.
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

require_once('classes/config/config.php');
require_once('classes/errorhandling/amaException.php');

class AmaSession {

    /**
     * Starts a PHP session if necessary
     */
    static function start()
    {
        /* Only do this once per request */
        if(session_id() == '' || !isset($_SESSION))
        {
            session_start();

            /* Check if IP address has changed to prevent some session hijacking */
            $ipaddress = $_SERVER['REMOTE_ADDR'];

            if(!isset($_SESSION['ipaddress']) || $_SESSION['ipaddress'] == '')
            {
                $_SESSION['ipaddress'] = $ipaddress;
            }
            else
            {
                /* The user changed ipadress in one session - terminate it! */
                if($_SESSION['ipaddress'] != $ipaddress)
                {
                    AmaSession::destroy();
                    $error = new amaException(NULL, 401, "IP Address change detected!");
                    $error->renderJSONerror();
                    $error->setHeaders();
                    die();
                }
            }
        }
    }

    /**
     * Sets a session variable
     * @param mixed $key
     * @param mixed $value
     */

    static function set($key, $value)
    {
        /* start a Session if not already started */
        AmaSession::start();

        $_SESSION[$key] = $value;
    }

    /**
     * Gets a Session param
     * @param mixed $key
     * @return mixed
     */
    static function get($key)
    {
        /* start a Session if not already started */
        AmaSession::start();

        return $_SESSION[$key];
    }

    /**
     * destroys the active Session and unsets cookies
     * @return boolean - true if everything is alright, false if something went wrong
     */
    static function destroy()
    {
        $a = setcookie(session_name(), "", 1);
        $b = setcookie(session_name(), false);
        unset($_COOKIE[session_name()]);
        $c = session_destroy();

        return $a&$b&$c;
    }



}
