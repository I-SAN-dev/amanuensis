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

if(!$thisisamanu)die('Direct access restricted');

class helloWorld {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        echo 'Hello World: that was a get!';
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        echo 'Hello World: that was a post!';
    }

    /**
     * This methods reacts to DELETE Requests
     * Remember the parameter!!
     */
    public static function delete($_DELETE)
    {
        echo 'Hello World: that was a delete!';
    }
}