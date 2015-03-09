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
require_once('classes/authentication/user.php');
require_once('classes/errorhandling/amaException.php');

class login {

    /**
     * This method reacts to GET Requests
     * it returns the current login state and, if not logged in, a login token for the given user
     */
    public static function get()
    {
        $response = array(
            "loggedin"=>Authenticator::isLoggedin(),
            "token"=>"",
            "salt"=>"",
        );

        $email = $_GET['mail'];

        /* Generate token only if user is not logged in and an email adress is supplied */
        if(!Authenticator::isLoggedin() && isset($email) && $email != '')
        {

            /* Check email address */
            if(!filter_var($email, FILTER_VALIDATE_EMAIL))
            {
                $error = new amaException(NULL, 400, "Invalid email address given");
                $error->renderJSONerror();
                $error->setHeaders();
                die();
            }

            /* get the user */
            $user = User::get($email);
            if(!$user)
            {
                $error = new amaException(NULL, 400, "Unknown email address");
                $error->renderJSONerror();
                $error->setHeaders();
                die();
            }

            /* Generate the salt and the token */
            $salt = hash('sha256', $user->created);

            $token = Authenticator::getToken($user->created);

            $response["token"] = $token;
            $response["salt"] = $salt;
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