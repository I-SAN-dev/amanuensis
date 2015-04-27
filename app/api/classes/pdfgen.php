<?php
/**
 * Handles PDF generation
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
require_once('classes/pdf/pdfDoc.php');



class pdfgen {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if((!isset($_GET["for"]) || $_GET["for"] == '')||(!isset($_GET["forid"]) || $_GET["forid"] == '' ))
        {
            $error = new amaException(NULL, 400, "for and forid need to be specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        try
        {
            $pdfdoc = new PdfDoc($_GET["for"], $_GET["forid"]);
            $pdfdoc->streamPreview();
        }
        catch(Exception $e)
        {
            $error = new amaException($e);
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        echo 'Hello World: that was a post!';
    }

}