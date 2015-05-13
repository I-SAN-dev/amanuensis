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
require_once('classes/database/dbal.php');
require_once('classes/errorhandling/amaException.php');

class userdata {

    /**
    * This method reacts to GET Requests
    * it returns the current loggedin user
    */
    public static function get()
    {
        Authenticator::onlyFor(0,1);

        /* output current user */
        if(!isset($_GET["list"]) || $_GET["list"] == '')
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
                $response["id"] = $user->id;
                $response["username"] = $user->username;
                $response["email"] = $user->email;
                $response["accessgroup"] = $user->accessgroup;
                $response["fe_key"] = $user->fe_key;
            }
            json_response($response);
        }
        /* output a list of all users */
        else
        {
            $dbal = DBAL::getInstance();
            $result = $dbal->simpleSelect(
                'users',
                array(
                    'id',
                    'email',
                    'username',
                    'last_failed_login_attempt',
                    'accessgroup'
                )
            );
            /* Convert timestamp to human readable date */
            foreach($result as &$entry)
            {
                $entry['last_failed_login_attempt'] = date("Y-m-d H:i:s", $entry['last_failed_login_attempt']);
            }
            json_response($result);
        }
    }

    /**
    * Reacts to post requests
    * adds a user to the db
    */
    public function post()
    {
        Authenticator::onlyFor(0);

        //TODO: Authentication!
        //TODO: Sanitation!

        $password = hash('sha256', 'test123');
        $user = new User("test@test.de","Tester", $password, 0);
        var_dump($user);

    }

}