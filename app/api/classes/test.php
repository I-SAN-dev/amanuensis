<?php
/**
 * This is an test api
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
require_once('classes/mail/amaMail.php');

class test {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {

        $mail = new AmaMail('Ich','sebastian-antosch@t-online.de','test');
        $mail->setContent('<p>Dies ist ein Test!</p>');
        $mail->addAttachment('archive/2015/09/offer/2015-09-10__123.pdf');
        $mail->send();

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