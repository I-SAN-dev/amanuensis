<?php
/**
 * This class handles authentication and token management
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
require_once('classes/authentication/user.php');
require_once('classes/authentication/amaSession.php');
require_once('classes/errorhandling/amaException.php');

class Authenticator
{

    /**
     * Logs an user in
     * @param string $email - the users email address
     * @param string $fe_salted_password - the password string which is already salted from the frontend
     * @return boolean - true if success, false if fail
     */
    public static function login($email, $fe_salted_password)
    {
        /* Get user from email */
        $user = User::get($email);
        if(!$user)
        {
            $error = new amaException(NULL, 400, 'Unknown email address', 'login.unknownmail');
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }

        $algo = 'sha256';
        $password = $user->password;
        $be_password1 = hash($algo, $password.self::getToken($user->created));
        $be_password2 = hash($algo, $password.self::getToken($user->created, true));

        /* Check if the login data is correct */
        if($fe_salted_password == $be_password1 || $fe_salted_password == $be_password2)
        {
            AmaSession::set('user', $user);
            return true;
        }
        else
        {
            $user->setLastFailedLoginAttempt();
            $error = new amaException(NULL, 401, 'Invalid email and/or password', 'login.invalid');
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }

    }

    /**
     * Logs the user out
     * @return boolean - true if success, false if fail
     */
    public static function logout()
    {
        return AmaSession::destroy();
    }

    /**
     * Gets the current User object
     * @return User|NULL
     */
    public static function getUser()
    {
        if(Authenticator::isLoggedin())
        {
            return AmaSession::get('user');
        }
        else
        {
            return NULL;
        }
    }

    /**
     * Checks if a user is logged in
     * @return boolean
     */
    public static function isLoggedin()
    {
        return AmaSession::get('user') != NULL;
    }

    /**
     * Checks if the user is logged in and has one of the as parameter given access levels,
     * outputs matching errors if not
     */
    public static function onlyFor()
    {

        $accesslevels = func_get_args();

        /* 401 if not logged in */
        /*
        if(!self::isLoggedin())
        {
            $error = new amaException(NULL, 401, "Login required", "login.required");
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }*/

        /* 403 if not in matching usergroup */
        /*
        if(count($accesslevels) > 0 && !in_array(self::getUser()->accessgroup, $accesslevels))
        {
            $error = new amaException(NULL, 403, "Not allowed", "login.noaccess");
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }*/

    }


    /**
     * Returns an validation Token
     * @param $usertime - the creation timestamp of the user
     * @param $previous - whether or not the previous token should be get
     * @return string - an validation token
     */
    public static function getToken($usertime, $previous = false)
    {
        $algo = 'sha256';
        $conf = Config::getInstance();
        $secret = $conf->get['appsecret'];
        $timeIn10Minutes = floor(time()/(1000*60*10))+ ($previous ? -1 : 0);

        $token = hash(
            $algo,
            hash($algo, $timeIn10Minutes)
            .hash($algo, $secret)
            .hash($algo, $timeIn10Minutes)
            .hash($algo, $usertime)
        );

        return $token;
    }
}