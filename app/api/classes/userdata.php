<?php
/**
 * Gets the current user data or adds a new one
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

class userdata {

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

    /**
    * Reacts to post requests
    * adds a user to the db
    */
    public function post()
    {

        //TODO: Authentication!
        //TODO: Sanitation!

        $password = hash('sha256', 'test123');
        $user = new User("test@test.de","Tester", $password, 0);
        var_dump($user);

    }

}