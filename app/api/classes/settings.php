<?php
/**
 * Handles setting updates
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

require_once('classes/errorhandling/amaException.php');
require_once('classes/authentication/authenticator.php');
require_once('classes/config/config.php');

class settings {

    /**
     * Echoes the current config
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0);

        $conf = Config::getInstance();

        $array = $conf->get;

        /* Censor some config values, they only can be set but not read */
        $array["db"]["password"] = '*****';
        $array["appsecret"] = '*****';
        $array["mail"]["password"] = '*****';

        /* define some groups */
        $d = array();
        $d['settings.company'] = array('company', 'company_addition','address', '|', 'pricing', 'invoice_due_days');
        $d['settings.design'] = array('design', '|', 'templates');
        $d['settings.mail'] = array('mailcontent','|','mail');
        $d['settings.refnumbers'] = array('refnumber_offers', '|', 'refnumber_contracts', '|', 'refnumber_acceptances', '|', 'refnumber_invoices', '|', 'refnumber_reminders', '|', 'refnumber_customers' );
        $d['settings.server'] = array('baseurl','secureurl','appsecret','sessiontimeout','|', 'debug', 'errorlogging', 'errorlogpath', '|', 'lang', '|', 'path', '|', 'db');

        /* create the groups groups*/
        $out = array();
        foreach($d as $groupname => $keys)
        {
            $out[$groupname] = array();
            foreach($keys as $key)
            {
                if($key == '|')
                {
                    $out[$groupname]['spacer'.count($out[$groupname])] = '%spacer%';
                }
                else
                {
                    $out[$groupname][$key] = $array[$key];
                    unset($array[$key]);
                }
            }
        };
        if(count($array) > 0)
        {
            $out['settings.other'] = $array;
        }

        /* Change the type of some */
        $types = array();
        foreach($conf->get as $key=>$value)
        {
            if(!is_array($value))
            {
                $types[$key] = 'text';
            }
            else
            {
                foreach($value as $subkey=>$subvalue)
                {
                    $types[$key.'.'.$subkey] = 'text';
                }
            }
        }

        /* Define the types */
        $number = 'number';
        $bool = 'bool';
        $price = 'price';
        $mail = 'email';

        $types['sessiontimeout'] = $number;
        $types['mail.sender'] = $mail;
        $types['mail.replyto'] = $mail;
        $types['mail.archive'] = $mail;
        $types['mail.admin'] = $mail;
        $types['mail.usesmtp'] = $bool;
        $types['mail.smtpauth'] = $bool;
        $types['mail.port'] = $number;
        $types['debug'] = $bool;
        $types['errorlogging'] = $bool;
        $types['pricing.dailyrate'] = $price;
        $types['pricing.hourlyrate'] = $price;
        $types['pricing.calc_tax'] = $bool;
        $types['pricing.tax'] = $number;
        $types['pricing.hint_kleinunternehmerregelung'] = $bool;
        $types['pricing.hint_agb'] = $bool;
        $types['invoice_due_days'] = $number;
        $types['refnumber_offers.idminlength'] = $number;
        $types['refnumber_contracts.idminlength'] = $number;
        $types['refnumber_acceptances.idminlength'] = $number;
        $types['refnumber_invoices.idminlength'] = $number;
        $types['refnumber_reminders.idminlength'] = $number;
        $types['refnumber_customers.idminlength'] = $number;


        /* Output that stuff */
        json_response(array(
            'settings' => $out,
            'types' => $types
        ));
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        Authenticator::onlyFor(0);

        if(isset($_POST["key"]) && $_POST["key"] != "" && isset($_POST["value"]))
        {
            $conf = Config::getInstance();

            /* check if key is first-level or second-level*/
            if (strpos($_POST["key"],'.') !== false)
            {
                //true, second-level
                $keylevel = explode('.', $_POST["key"]);

                if( isset($conf->get[ $keylevel[0] ]) &&
                    is_array($conf->get[ $keylevel[0] ]) &&
                    isset($conf->get[ $keylevel[0] ][ $keylevel[1] ]))
                {
                    $conf->get[ $keylevel[0] ][ $keylevel[1] ] = $_POST["value"];
                    $conf->save();
                }
                else
                {
                    // key is not valid
                    $error = new amaException(NULL, 400, "Invalid key.");
                    $error->renderJSONerror();
                    $error->setHeaders();
                }

            }
            else
            {
                //false, first-level
                if(isset($conf->get[$_POST["key"]]))
                {
                    $conf->get[$_POST["key"]] = $_POST["value"];
                    $conf->save();
                }
                else
                {
                    // key is not valid
                    $error = new amaException(NULL, 400, "Invalid key.");
                    $error->renderJSONerror();
                    $error->setHeaders();
                }
            }

        }
        else
        {
            $error = new amaException(NULL, 400, "Not all required parameters given.");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        self::get();
    }
}