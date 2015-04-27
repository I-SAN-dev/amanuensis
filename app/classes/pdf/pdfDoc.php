<?php
/**
 * Represents a PDF Document, for example an offer or an invoice.
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

require_once('classes/database/dbal.php');
require_once('classes/database/state_constants.php');
require_once('classes/pdf/pdf.php');
require_once('classes/project/amaItemList.php');

class PdfDoc {

    /**
     * Constructs a new PDF Doc
     * @param $type - the document type (e.g. offer, invoice...)
     * @param $id - the id of the document
     */
    public function __construct($type, $id)
    {
        $this->type = $type;
        $this->id = $id;

        /* Gather document info */
        $this->info = $this->getInfo();

        $this->refnumber = $this->info["refnumber"];
        $this->date = isset($this->info["date"]) ? date_create($this->info["date"]) : date('Y-m-d');

        /* Gather associated items */
        $this->items = $this->getItems();

        $this->pdf = new PDF($this->generateFilename());
        $this->pdf->setHTML($this->generateHTML());
    }

    /**
     * Will stream a preview for this document
     */
    public function streamPreview()
    {
        $this->pdf->stream();
    }

    /**
     * Will render the doc and save it to disk at the proper location
     * @return String - the path the PDF was saved
     */
    public function saveToDisk()
    {
        $path = $this->generatePath();

        $this->pdf->saveToDisk($path);

        $this->updateState($path);
        return $path;
    }

    /**
     * Gathers the document info
     * @return array
     * @throws Exception - if the thing is not found
     */
    private function getInfo()
    {
        //TODO
        $info = array();
        return $info;
    }

    /**
     * Gathers the associated items
     */
    private function getItems()
    {
        $itemList = new AmaItemList($this->type, $this->id);
        return $itemList->entries;
    }

    /**
     * Will update the database state and path of the document
     * @param $path
     */
    private function updateState($path)
    {
        $dbal = DBAL::getInstance();

        if(in_array($this->$type, array('offer', 'acceptance', 'invoice', 'reminder')))
        {
            $dbal->dynamicUpdate(   $type,
                                    array('id', $this->id),
                                    array('path', 'state'),
                                    array('path' => $path, 'state' => PDF_GENERATED));
        }
        else
        {
            $dbal->dynamicUpdate(   $type,
                                    array('id', $this->id),
                                    array('path'),
                                    array('path' => $path));
        }
    }

    /**
     * generates desired path and filename for the document, and ensures it is existent
     * @return String
     * @throws Exception
     */
    private function generatePath()
    {
        $year = $this->date->format('Y');
        $month = $this->date->format('m');

        $path = 'archive/'.$year.'/'.$month.'/'.$this->type;

        /* Check if path is existent, if not, generate it */
        if(!file_exists($path))
        {
            if(!mkdir($path, 0777, true))
            {
                throw new Exception('Path "'.$path.'" cannot be generated', 500);
            }
        }

        return $path.'/'.$this->generateFilename();
    }

    /**
     * generates an appropriate filename
     * @return String
     */
    private function generateFilename()
    {
        return $this->date.'__'.$this->refnumber;
    }

    /**
     * Generates the HTML for the doc
     * @return string
     */
    private function generateHTML()
    {
        //TODO
        $html = '';
        return $html;
    }

}