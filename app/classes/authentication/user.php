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
require_once('classes/config/config.php');
require_once('classes/mail/amaMail.php');
require_once('classes/authentication/authenticator.php');

class User {

    /**
     * Returns the User with the given email address or NULL if none found
     * @param string $email - the email address of the wanted user
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
            $user->fe_key = $result['fe_key'];

            return $user;
        }
    }


    /**
     * Creates a new User and saves it to the Datastore
     * @param string $email
     * @param string $username
     * @param string $password - completely hashed if already existent user or only once hashed with sha256 without salt!
     * @param int $accessgroup
     * @param boolean $savetodb - set to false if user already exists
     */
    public function __construct($email, $username, $password, $accessgroup, $savetodb = true)
    {
        $this->email = $email;
        $this->username = $username;
        $this->accessgroup = $accessgroup;

        if(!$savetodb)
        {
            /* this is a completely readymade password already from the db, we keep it as is */
            $this->password = $password;
        }
        else
        {
            $otheruser = self::userdataByMail($email);
            if($otheruser)
            {
                $error = new amaException(NULL, 400, 'E-Mail address already in use','user.emailinuse');
                $error->renderJSONerror();
                $error->setHeaders();
            }

            $this->created = time();

            /* if it is a new user we get a only simply hashed password and need to salt it before storing */
            $algo = 'sha256';
            $salt = hash($algo, $this->created);
            $this->password = hash($algo, $password.$salt);


            $dbal = DBAL::getInstance();
            $q = $dbal->prepare("INSERT INTO users (email, username, created, password, accessgroup) VALUES (:email, :username, :created, :password, :accessgroup)");
            $q->bindParam(':email', $this->email);
            $q->bindParam(':username', $this->username);
            $q->bindParam(':created', $this->created);
            $q->bindParam(':password', $this->password);
            $q->bindParam(':accessgroup', $this->accessgroup);

            $q->execute();

            $this->sendNotification();

            $result = User::userdataByMail($this->email);
            $this->id = $result["id"];
            $this->fe_key = $result["fe_key"];
        }
    }

    /**
     * Sets the email address
     * @param String $email
     */
    public function setEmail($email)
    {
        $otheruser = self::userdataByMail($email);
        if(!$otheruser)
        {
            $dbal = DBAL::getInstance();
            $q = $dbal->prepare("UPDATE users SET email=:email WHERE id=:id");
            $q->bindParam(':email', $email);
            $q->bindParam(':id', $this->id);
            $q->execute();

            $this->$email = $email;
        }
        else
        {
            $error = new amaException(NULL, 400, 'E-Mail address already in use','user.emailinuse');
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

    /**
     * Sets the email address
     * @param String $username
     */
    public function setUsername($username)
    {
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("UPDATE users SET username=:username WHERE email=:email");
        $q->bindParam(':username', $username);
        $q->bindParam(':email', $this->email);
        $q->execute();

        $this->username = $username;
    }

    /**
     * Sets the access group
     * @param int $accessgroup
     */
    public function setAccessgroup($accessgroup)
    {
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("UPDATE users SET accessgroup=:accessgroup WHERE email=:email");
        $q->bindParam(':accessgroup', $accessgroup);
        $q->bindParam(':email', $this->email);
        $q->execute();

        $this->accessgroup = $accessgroup;
    }

    /**
     * Sets the password
     * @param String $password - the one time hashed password
     */
    public function setPassword($password)
    {
        $algo = 'sha256';
        $salt = hash($algo, $this->created);
        $newpassword = hash($algo, $password.$salt);

        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("UPDATE users SET password=:password WHERE email=:email");
        $q->bindParam(':password', $newpassword);
        $q->bindParam(':email', $this->email);
        $q->execute();

        $this->password = $newpassword;
    }

    /**
     * Sets the last failed login attempt to now
     */
    public function setLastFailedLoginAttempt()
    {
        $time = time();
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("UPDATE users SET last_failed_login_attempt=:time WHERE email=:email");
        $q->bindParam(':time', $time);
        $q->bindParam(':email', $this->email);
        $q->execute();

        $this->last_failed_login_attempt = $time;
    }

    /**
     * Notifies a new user by email
     */
    private function sendNotification()
    {
        $conf = Config::getInstance();
        $executingUser = Authenticator::getUser();

        if($executingUser)
        {
            $mail = new AmaMail($this->username, $this->email,'Dein Account bei amanu');
            $mail->setContent('
                <p>
                Hallo '.$this->username.',<br/>
                <br/>
                Der Benutzer '.$executingUser->username.' hat für dich einen Account beim Projektverwaltungstool amanu von '.$conf->get["company"].' angelegt.<br/>
                <br/>
                Frage Ihn jetzt nach deinem Passwort!<br/>
                <br/>
                Mit deiner Mailadresse '.$this->email.' kannst du dich dann hier einloggen:
                <a href="'.$conf->get["baseurl"].'">'.$conf->get["baseurl"].'</a><br/>
                ');
            $mail->send();
        }

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

        if($result = $q->fetch(PDO::FETCH_ASSOC))
        {
            $conf= Config::getInstance();
            $secret = $conf->get['appsecret'];
            $result['fe_key'] = hash('sha256', $result['created'].$result['id'].$secret);

            return $result;
        }
        else
        {
            return NULL;
        }

    }

}