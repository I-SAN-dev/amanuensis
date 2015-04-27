<?php
/**
 * This class handles our PDF Templates.
 * Due to this extra class we can keep our variable scope clean
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

class PdfTemplate {

    /**
     * Constructor
     * @param string $path - the path of the template to load
     * @param array $data - an array with variables that shall be accessible
     * @throws Exception
     */
    public function __construct($path, array $data)
    {
        if(is_file($path))
        {
            $this->path = $path;
            $this->data = $data;
        }
        else
        {
            throw new Exception('Template "'.$path.'" cannot be found', 404);
        }
    }

    /**
     * Renders a template
     * @return string - the readymade html code
     */
    public function getHTML()
    {
        /* Start output buffering */
        ob_start();

        /* extract the variables array to the scope*/
        extract($this->data);

        /* include the template file */
        include($this->$path);

        /* Stop output buffering and return the data */
        return ob_get_clean();
    }

}