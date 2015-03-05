<?php
/**
 * Allows to add a user to the system
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

require_once('classes/authentication/user.php');

class user_add {

    /**
     * Reacts to post requests
     * adds a user to the db
     */
    public function post()
    {

        //TODO: Authentication!
        //TODO: Sanitation!

        $user = new User("test@test.de","Tester","test123", 0);
        var_dump($user);

    }

}