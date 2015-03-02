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

class Authenticator
{

    /**
     * Logs an user in
     * @param string $username - the username
     * @param string $fe_salted_password - the password string which is already salted from the frontend
     * @return boolean - true if success, false if fail
     */
    public static function login($username, $fe_salted_password)
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

    }

    /**
     * Returns an validation Token
     * @return string - an validation token
     */
    public static function getToken()
    {

    }
}