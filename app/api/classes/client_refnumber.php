<?php
/**
 * Returns an acceptable refnumber for a new client
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

require_once('classes/database/dbal.php');
require_once('classes/errorhandling/amaException.php');
require_once('classes/authentication/authenticator.php');
require_once('classes/config/config.php');

class client_refnumber {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        //Authenticator::onlyFor(0);

        $conf = Config::getInstance();
        $dbal = DBAL::getInstance();

        $refnumber = $conf->get['refnumber']['scheme'];
        $idminlength = $conf->get['refnumber']['idminlength'];

        /* get the possible next userid for use in the refnumber */
        $q = $dbal->prepare("SELECT auto_increment FROM INFORMATION_SCHEMA.TABLES WHERE table_name = 'customers' ");
        $q->execute();
        $nextid = $q->fetch()["auto_increment"];
        $nextid=(string)$nextid;
        $nextid = str_pad($nextid, $idminlength, '0', STR_PAD_LEFT);


        $replace = array(
            '%y%' => date('y'),
            '%yy%' => date('Y'),
            '%m%' => date('n'),
            '%mm%' => date('m'),
            '%d%' => date('j'),
            '%dd%' => date('d'),
            '%ddd%' => date('z'),
            '%dddd%' => str_pad(date('z'), 3, '0', STR_PAD_LEFT),
            '%id%' => $nextid
        );

        foreach($replace as $code => $value)
        {
            $refnumber = str_replace($code, $value, $refnumber);
        }

        json_response(array(
            "refnumber"=> $refnumber
        ));

    }

}