<?php
/**
 * Outputs a protected mail preview to a loggedin user
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
require_once('classes/mail/amaMailDoc.php');

class mail {

    /**
     * Outputs a mail preview for a loggedin user
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0);


        if(!isset($_GET["path"]) || $_GET["path"] == '')
        {
           $error = new amaException(NULL, 500, "There was no path given");
           $error->renderJSONerror();
           $error->setHeaders();
        }


        $path = $_GET["path"];
        /* only allow for htmls in tmp */
        if(!self::startsWith($path, 'tmp/') && !self::endsWith($path, '.html'))
        {
            $error = new amaException(NULL, 400, "Bad path given");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        /* check if file exists */
        if(!file_exists($path))
        {
            $error = new amaException(NULL, 404, "File not found");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        echo(utf8_decode(file_get_contents($path)));
    }



    /**
     * Sends a mail or generates a preview
     * Reacts to POST Requests
     */
    public static function post()
    {
        Authenticator::onlyFor(0);

        if(
            (!isset($_POST["type"]) || $_POST["type"] == '')||
            (!in_array($_POST["type"], array('offer', 'acceptance', 'invoice', 'reminder')))|
            (!isset($_POST["id"]) || $_POST["id"] == '')
        )
        {
            $error = new amaException(NULL, 400, "type or id not set, or type is wrong");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        $mail = new AmaMailDoc($_POST["type"], $_POST["id"], $_POST["additional"]);

        if(isset($_POST["send"]) && $_POST["send"] != '')
        {
            try
            {
                $mail->send();
                json_response(array(
                    'success' => true
                ));
            }
            catch(Exception $e)
            {
                $error = new amaException($e);
                $error->renderJSONerror();
                $error->setHeaders();
            }
        }
        else
        {
            json_response(array(
                'previewpath' => $mail->getPreview()
            ));
        }
    }

    /**
     * Tests if a string starts with a given string
     * @param $haystack - the string to test
     * @param $needle - the string that $haystack should start with
     * @return bool
     */
    private static function startsWith($haystack, $needle) {
        // search backwards starting from haystack length characters from the end
        return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
    }
    /**
     * Tests if a string ends with a given string
     * @param $haystack - the string to test
     * @param $needle - the string that $haystack should end with
     * @return bool
     */
    private static function endsWith($haystack, $needle) {
        // search forward starting from end minus needle length characters
        return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
    }

}