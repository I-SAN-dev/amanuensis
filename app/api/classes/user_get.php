<?php
/**
 * Gets the current user data
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

class user_get {

    /**
    * This method reacts to GET Requests
    * it returns the current loggedin user
    */
    public static function get()
    {
        $response = array();
        if(!Authenticator::isLoggedin())
        {
            $error = new amaException(NULL, 401, "Not logged in");
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }
        else
        {
            $user = Authenticator::getUser();
            $response["username"] = $user->username;
            $response["email"] = $user->email;
            $response["accessgroup"] = $user->accessgroup;
        }
        json_response($response);
    }

}