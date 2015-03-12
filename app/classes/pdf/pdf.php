<?php
/**
 * This is a wrapper for the DOMPDF library
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */
require_once('classes/pdf/dompdf/dompdf_config.inc.php');
require_once('classes/errorhandling/amaException.php');

class PDF {

    /**
     * Constructs a new PDF instance
     * @param string $name - the name of the PDF file
     */
    public function __construct($name)
    {
        $this->html = '';
        $this->name = $name;
    }

    /**
     * Set the HTML that should be rendered
     * @param string $html
     */
    public function setHTML($html)
    {
        $this->html = $html;
    }

    /**
     * Loads a html file that should be converted - PHP will also work (thanks to include)
     * @param string $path
     */
    public function loadFile($path)
    {
        if(file_exists($path))
        {
            ob_start();
            include($path);
            $this->html = ob_get_clean();
        }
        else
        {
            $error = new amaException(NULL, 404, "File '".$path."' not found!");
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }
    }

    /**
     * Directly renders and outputs the PDF
     */
    public function stream()
    {
        $dompdf = new DOMPDF();
        $dompdf->load_html($this->html);
        $dompdf->render();
        $dompdf->stream($this->name);
    }


    /**
     * Saves the PDF to disc to the given path
     * @param string $path
     */
    public function saveToDisk($path)
    {
        $dompdf = new DOMPDF();
        $dompdf->load_html($this->html);
        $dompdf->render();
        $content = $dompdf->output();

        if(!file_put_contents($path, $content))
        {
            $error = new amaException(NULL, 500, "Error writing PDF to path '".$path."'!");
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }
    }



}