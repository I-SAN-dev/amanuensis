<?php
/**
 * Returns an acceptable refnumber for various needs
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
require_once('classes/project/amaProject.php');

class refnumber {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0);

        $dbal = DBAL::getInstance();

        $for = $_GET["for"];
        $projectid = $_GET["project"];

        if(in_array($for, array(
            'offers',
            'contracts',
            'acceptances',
            'invoices',
            'reminders',
            'customers'
        )))
        {
            $conf = Config::getInstance();
            $options = $conf->get['refnumber_'.$for];

            $refnumber = $options['scheme'];
            $idminlength = $options['idminlength'];

            /* get the possible next id for use in the refnumber */
            $q = $dbal->prepare("SELECT auto_increment FROM INFORMATION_SCHEMA.TABLES WHERE table_name = :table ");
            $q->bindParam(':table', $for);
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

            /* Add the project id and the clientid for all others than */
            if($for != 'customers' && isset($projectid) && $projectid != '')
            {
                $p = $projectid;
                $pp = str_pad($p, 6, '0', STR_PAD_LEFT);

                $replace['%p%'] = $p;
                $replace['%pp%'] = $pp;


                /* Add the client refnumber */
                $project = new AmaProject($projectid);
                $client = $project->getClient();
                $c = $client['refnumber'];
                $replace['%c%'] = $c;
            }



            foreach($replace as $code => $value)
            {
                $refnumber = str_replace($code, $value, $refnumber);
            }

            json_response(array(
                "refnumber"=> $refnumber
            ));
        }
        else
        {
            $error = new amaException(NULL, 400, "No or wrong 'for' specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }



    }

}