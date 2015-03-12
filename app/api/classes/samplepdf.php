<?php
/**
 * This will output a sample PDF file
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

require_once('classes/pdf/pdf.php');


class samplepdf {


    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {

        $pdf = new PDF('test.pdf');
        $pdf->loadFile('pdftemplates/invoice.html');
        $pdf->stream();

    }

}