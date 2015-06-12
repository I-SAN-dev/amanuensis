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
require_once('classes/pdf/amaTemplate.php');
require_once('classes/project/amaItemList.php');
require_once('classes/project/amaProject.php');

class PdfDoc {

    /**
     * Constructs a new PDF Doc
     * @param $type - the document type (e.g. offer, invoice...)
     * @param $id - the id of the document
     */
    public function __construct($type, $id)
    {
        if(!in_array($type, array('offer','contract','todo','acceptance','invoice','reminder')))
        {
            $error = new amaException(NULL, 400, '"'.$type.'" is no possible value for "for"');
            $error->renderJSONerror();
            $error->setHeaders();
        }

        $this->type = $type;
        $this->id = $id;

        /* Gather document info */
        $this->info = $this->getInfo();
        $this->info['type'] = $this->type;

        $this->refnumber = $this->info["refnumber"];
        $this->date = $this->info['date'];

        /* Gather associated items */
        if($this->type != 'reminder')
        {
            $this->info['items'] = $this->getItems();
        }

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
        if($this->type == 'reminder')
        {
            $fields = array('name','description','invoice','refnumber','date');
        }
        else
        {
            $fields = array('name','description','project','refnumber','date');
        }

        $dbal = DBAL::getInstance();
        $info = $dbal->simpleSelect($this->type.'s', $fields, array('id', $this->id), 1);
        if(count($info) < 1)
        {
            throw new Exception('Document "'.$this->type.'" "'.$this->id.'" not found', 404);
        }

        /* Add project and client data */
        if($this->type == 'reminder')
        {
            $invoice = $dbal->simpleSelect(
                'invoices',
                array('id','name','description','refnumber','date','project'),
                array('id', $info['invoice']), 1);

            /* calc invoice duedate */
            $invoice['items'] = new AmaItemList('invoice', $invoice['id']);
            $invoice['duedate'] = $this->calcDueDate($invoice['date']);

            $info['invoice'] = $invoice;
            $project = new AmaProject($invoice['project']);
        }
        else
        {
            $project = new AmaProject($info['project']);
            if($this->type == 'invoice')
            {
                $info['duedate'] = $this->calcDueDate($info['date']);
            }
        }
        $info['project'] = $project->getProjectData();

        /* Add current date as date, if not existent (acceptance) */
        $info['date'] = isset($info["date"]) ? date_create($info["date"]) : date('Y-m-d');

        return $info;
    }

    /**
     * Gathers the associated items
     */
    private function getItems()
    {
        $itemList = new AmaItemList($this->type, $this->id);
        return array('list' => $itemList->entries, 'costs' => $itemList->costs);
    }

    /**
     * Will update the database state and path of the document
     * @param $path
     */
    private function updateState($path)
    {
        $dbal = DBAL::getInstance();

        if(in_array($this->type, array('offer', 'acceptance', 'invoice', 'reminder')))
        {
            $dbal->dynamicUpdate(   $this->type.'s',
                                    array('id', $this->id),
                                    array('path', 'state'),
                                    array('path' => $path, 'state' => PDF_GENERATED));
        }
        else
        {
            $dbal->dynamicUpdate(   $this->type.'s',
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
        return $this->date->format('Y-m-d').'__'.$this->refnumber.'.pdf';
    }

    /**
     * Generates the HTML for the doc
     * @return string
     */
    private function generateHTML()
    {
        $conf = Config::getInstance();

        $this->info['conf'] = $conf->get;

        $path = $conf->get['templates'][$this->type];
        $innertemplate = new amaTemplate($path, $this->info);
        $inner = $innertemplate->getHTML();

        $this->info['content'] = $inner;
        $outerpath = $conf->get['templates']['paper'];
        $outertemplate = new amaTemplate($outerpath, $this->info);

        $html = $outertemplate->getHTML();

        return $outertemplate->getHTML();
    }

    /**
     * Calcs a due date for a date
     * @param $date - the invoice date
     * @return bool|string
     */
    private function calcDueDate($date)
    {
        $conf = Config::getInstance();
        $days = $conf->get['invoice_due_days'];
        $seconds = $days*24*60*60;
        return date('Y-m-d',(strtotime($date) + $seconds));
    }

}