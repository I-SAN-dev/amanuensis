<?php
/**
 * Outputs a protected PDF to a loggedin user
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

class protectedpdf {

    /**
     * Outputs a pdf for logged in users
     * This method reacts to GET Requests
     */
    public static function get()
    {

        Authenticator::onlyFor(0,1);

        if(!isset($_GET["path"]) || $_GET["path"] == '')
        {
           $error = new amaException(NULL, 500, "There was no path given");
           $error->renderJSONerror();
           $error->setHeaders();
        }


        $path = $_GET["path"];
        /* only allow for pdfs in archive */
        if(!self::startsWith($path, 'archive/') && !self::endsWith($path, '.pdf'))
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


        $content = file_get_contents($path);
        /* Set headers */

        header("Content-type:application/pdf");
        header('Content-Length: '.strlen( $content ));
        if(isset($_GET["download"]) && $_GET["download"] != '')
        {
            header('Content-disposition: attachment; filename="' . basename($path) . '"');
        }
        else
        {
            header('Content-disposition: inline; filename="' . basename($path) . '"');
        }
        echo $content;

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