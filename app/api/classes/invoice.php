<?php
/**
 * Handles the Invoices
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

require_once('classes/database/dbal.php');
require_once('classes/errorhandling/amaException.php');
require_once('classes/authentication/authenticator.php');
require_once('classes/project/amaItemList.php');
require_once('classes/project/amaProject.php');

class invoice {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getInvoice($_GET["id"]);
        }
        else
        {
            self::getInvoiceList();
        }
    }


    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        Authenticator::onlyFor(0);

        if( !isset($_POST["id"]) || $_POST["id"]=='')
        {
            self::createInvoice();
        }
        else
        {
            self::modifyInvoice();
        }
    }

    /**
     * This methods reacts to DELETE Requests
     */
    public static function delete($_DELETE)
    {
        Authenticator::onlyFor(0);

        if(!isset($_DELETE["id"]) || $_DELETE["id"]=='')
        {
            $error = new amaException(NULL, 400, "No id specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        else
        {
            self::deleteInvoice($_DELETE);
        }
    }

    /**
     * Gets a list of all Invoices
     */
    private static function getInvoiceList()
    {
        $conf = Config::getInstance();
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'invoices',
            array(
                'id',
                'name',
                'refnumber',
                'state',
                'project',
                'date',
                'path'
            )
        );

        /* Add due dates */
        foreach($result as &$invoice)
        {
            $date = new DateTime($invoice['date']);
            $date->add(date_interval_create_from_date_string($conf->get['invoice_due_days'].' days'));
            $invoice['due'] = $date->format("Y-m-d");
        }

        json_response($result);
    }

    /**
     * Gets a single Invoice
     * @param $id - the id of the Invoice to get
     */
    private static function getInvoice($id)
    {
        $conf = Config::getInstance();
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'invoices',
            array(
                'id',
                'name',
                'description',
                'refnumber',
                'state',
                'project',
                'date',
                'path'
            ),
            array('id', $id),
            1
        );
        
        /* Add items */
        $itemlist = new AmaItemList('invoice', $id);
        $result["items"] = $itemlist->entries;
        $result["costs"] = $itemlist->costs;

        /* Add project data */
        $project = new AmaProject($result['project']);
        $result['project'] = $project->getProjectData();

        /* Add due date */
        $date = new DateTime($result['date']);
        $date->add(date_interval_create_from_date_string($conf->get['invoice_due_days'].' days'));
        $result['due'] = $date->format("Y-m-d");

        /* Add reminders */
        $result['reminders'] = $dbal->simpleSelect(
            'reminders',
            array(
                'id',
                'name',
                'refnumber',
                'date',
                'state'
            ),
            array('invoice', $result['id']),
            0,
            'date ASC'
        );

        json_response($result);
    }

    /**
     * creates a new Invoice
     */
    private static function createInvoice()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'invoices',
            array(
                'name',
                'description',
                'refnumber',
                'state',
                'project',
                'date',
                'path'
            ),
            $_POST
        );
        self::getInvoice($id);
    }

    /**
     * modifies a Invoice
     */
    private static function modifyInvoice()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'invoices',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'refnumber',
                'state',
                'date',
                'path'
            ),
            $_POST);
        self::getInvoice($affectedid);
    }

    /**
     * deletes a Invoice
     * @param $_DELETE
     */
    private static function deleteInvoice($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('invoices', array('id', $_DELETE['id']));
        }
        catch(Exception $e)
        {
            $error = new amaException($e);
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }

        if($count)
        {
            self::getInvoiceList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Invoice matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}