<?php
/**
 * Logs the current user out
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

require_once('classes/authentication/authenticator.php');
require_once('classes/errorhandling/amaException.php');

class logout {

    /**
     * This method reacts to GET Requests
     * it logs the current user out and returns the current login state
     */
    public static function get()
    {
        if(Authenticator::logout())
        {
            $response = array(
                "loggedin"=>Authenticator::isLoggedin()
            );
            json_response($response);
        }
        else
        {
            $error = new amaException(NULL, 500, "Something went wrong logging out");
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }
    }

}