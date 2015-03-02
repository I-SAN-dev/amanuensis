<?php
/**
 * GET: a user login token
 * POST: logs a user in
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

class login {

    /**
     * This method reacts to GET Requests
     * it returns the current login state and, if not logged in, a login token
     */
    public static function getsrf()
    {
        $response = array(
            "loggedin"=>Authenticator::isLoggedin(),
            "token"=>""
        );
        if(!Authenticator::isLoggedin())
        {
            $response["token"] = Authenticator::getToken();
        }
        json_response($response);
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        echo 'Hello World: that was a post!';
    }
}