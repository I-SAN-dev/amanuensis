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
require_once('classes/database/sani.php');
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
                $error = new amaException(NULL, 401, "Not logged in", 'login.required');
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
            self::getUserList();
        }
    }

    /**
    * Reacts to post requests
    * adds a user to the db or updates one
    */
    public function post()
    {
        Authenticator::onlyFor(0);
        if(!isset($_POST["id"]) || $_POST["id"] == '')
        {
            self::createUser();
        }
        else
        {
            self::updateUser();
        }
    }


    public function delete($_DELETE)
    {
        if(!isset($_DELETE["id"]) || $_DELETE["id"] == '')
        {
            $error = new amaException(NULL, 400, "No id specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        /* Get the current user */
        $user = Authenticator::getUser();
        if($_DELETE["id"] == $user->id)
        {
            $error = new amaException(NULL, 400, "You cannot delete yourself");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        $dbal = DBAL::getInstance();
        $count = $dbal->deleteRow('users', array('id', $_DELETE["id"]));
        if($count < 1)
        {
            $error = new amaException(NULL, 404, "There was no user found with the given id");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        else
        {
            self::getUserList();
        }
    }

    /**
     * Outputs a list of all users
     */
    private function getUserList()
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

    /**
     * Creates a new user
     */
    private function createUser()
    {
        $email = Sani::email($_POST["email"]);
        $username = Sani::validString($_POST["username"], array(
            "maxlength" => 100,
            "minlength" => 2,
            "safe_chars" => true,
            "required" => true
        ));
        $password = Sani::validString($_POST["password"], array(
            "required" => true,
            "minlength" => 64,
            "maxlength" => 64,
            "safe_chars" => true
        ));
        $accesslevel = Sani::options($_POST["accessgroup"], array(0 ,1));

        $user = new User($email, $username, $password, $accesslevel);

        self::getUserList();
    }

    /**
     * Updates an existing user
     */
    private function updateUser()
    {
        $dbal = DBAL::getInstance();
        $userdata = $dbal->simpleSelect(
            'users',
            array(
               'email'
            ),
            array('id', $_POST["id"]),
            1
        );

        if(!$userdata)
        {
            $error = new amaException(NULL, 404, "User not found");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        $user = User::get($userdata['email']);

        /* update mail address */
        if(isset($_POST["email"]) && $_POST["email"] != '')
        {
            $email = Sani::email($_POST["email"]);
            $user->setEmail($email);
        }

        /* update username */
        if(isset($_POST["username"]) && $_POST["username"] != '')
        {
            $username = Sani::validString($_POST["username"], array(
                "maxlength" => 100,
                "minlength" => 2,
                "safe_chars" => true,
                "required" => true
            ));
            $user->setUsername($username);
        }

        /* update password */
        if(isset($_POST["password"]) && $_POST["password"] != '')
        {
            $password = Sani::validString($_POST["password"], array(
                "required" => true,
                "minlength" => 64,
                "maxlength" => 64,
                "safe_chars" => true
            ));
            $user->setPassword($password);
        }

        /* update accesslevel */
        if(isset($_POST["accessgroup"]) && $_POST["accessgroup"] != '')
        {
            $currentuser = Authenticator::getUser();
            if($currentuser->id == $user->id)
            {
                $error = new amaException(NULL, 400, "You can not modify your own access group");
                $error->renderJSONerror();
                $error->setHeaders();
            }

            $accesslevel = Sani::options($_POST["accessgroup"], array(0 ,1));
            $user->setAccessgroup($accesslevel);
        }

        self::getUserList();
    }

}