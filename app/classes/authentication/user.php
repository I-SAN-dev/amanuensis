<?php
/**
 * A class representing an User
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

require_once('classes/database/dbal.php');

class User {

    /**
     * Returns the User with the given email adress or NULL if none found
     * @param string $email - the email adress of the wanted user
     * @return User|NULL
     */
    static function get($email)
    {

        /* check if user is existent */
        $result = User::userdataByMail($email);
        if(!$result)
        {
            return NULL;
        }
        else
        {
            /* create the user object */
            $user = new User(
                $result["email"],
                $result["username"],
                $result["password"],
                $result["accessgroup"],
                false
            );
            $user->id = $result["id"];
            $user->created = $result["created"];
            $user->last_failed_login_attempt = $result["last_failed_login_attempt"];

            return $user;
        }
    }


    /**
     * Creates a new User and saves it to the Datastore
     * @param string $email
     * @param string $username
     * @param string $password - already hashed!
     * @param int $accessgroup
     * @param boolean $savetodb - set to false if user already exists
     */
    public function __construct($email, $username, $password, $accessgroup, $savetodb = true)
    {
        $this->email = $email;
        $this->username = $username;
        $this->password = $password;
        $this->accessgroup = $accessgroup;

        if($savetodb)
        {
            $this->created = time();

            $dbal = DBAL::getInstance();
            $q = $dbal->prepare("INSERT INTO users (email, username, created, password, accessgroup) VALUES (:email, :username, :created, :password, :accessgroup)");
            $q->bindParam(':email', $this->email);
            $q->bindParam(':username', $this->username);
            $q->bindParam(':created', $this->created);
            $q->bindParam(':password', $this->password);
            $q->bindParam(':accessgroup', $this->accessgroup);

            $q->execute();


            $result = User::userdataByMail($this->email);
            $this->id = $result["id"];
        }
    }

    /**
     * Sets the email adress
     * @param String $email
     */
    public function setEmail($email)
    {
        //TODO
    }

    /**
     * Sets the email address
     * @param String $username
     */
    public function setUsername($username)
    {
        //TODO
    }

    /**
     * Gets an PDOStatement result with user data to a given Mail
     * @param $email
     * @return mixed - the first result for the user
     */
    static private function userdataByMail($email)
    {
        /* look for the user */
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("SELECT id, email, username, created, last_failed_login_attempt, password, accessgroup FROM users WHERE email = :email");
        $q->bindParam(':email', $email);
        $q->execute();

        return $q->fetch();
    }

}