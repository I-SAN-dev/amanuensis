<?php
/**
 * This is an Hello World API example
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

class helloWorld {

    /**
     * This method reacts to GET Requests
     */
    static function get()
    {
        echo 'Hello World: that was a get!';
    }

    /**
     * This methods reacts to POST Requests
     */
    static function post()
    {
        echo 'Hello World: that was a post!';
    }
}