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

    }

    /**
     * Logs the user out
     * @return boolean - true if success, false if fail
     */
    public static function logout()
    {

    }

    /**
     * Gets the current User object
     * @return User
     */
    public static function getUser()
    {

    }

    /**
     * Checks if a user is logged in
     * @return boolean
     */
    public static function isLoggedin()
    {
        return false;
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