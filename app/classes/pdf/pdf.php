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
     * @throws Exception
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
            throw new Exception("File '".$path."' not found!", 404);
        }
    }

    /**
     * Directly renders and outputs the PDF
     */
    public function stream()
    {
        $dompdf = new DOMPDF();
        $dompdf->set_base_path(getcwd());
        $dompdf->load_html($this->html, 'UTF-8');
        $dompdf->render();
        $dompdf->stream($this->name, array('Attachment' => false));
    }


    /**
     * Saves the PDF to disc to the given path
     * @param string $path
     * @throws Exception
     */
    public function saveToDisk($path)
    {
        $dompdf = new DOMPDF();
        $dompdf->set_base_path(getcwd());
        $dompdf->load_html($this->html, 'UTF-8');
        $dompdf->render();
        $content = $dompdf->output();

        if(!file_put_contents($path, $content))
        {
            throw new Exception("Error writing PDF to path '".$path."'!", 500);
        }
    }



}