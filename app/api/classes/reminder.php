<?php
/**
 * Handles the Reminders
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
require_once('classes/project/amaStream.php');
require_once('classes/project/amaClient.php');
require_once('classes/config/config.php');

class reminder {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getReminder($_GET["id"]);
        }
        else
        {
            self::getReminderList();
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
            self::createReminder();
        }
        else
        {
            self::modifyReminder();
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
            self::deleteReminder($_DELETE);
        }
    }

    /**
     * Gets a list of all Reminders
     */
    private static function getReminderList()
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'reminders',
            array(
                'id',
                'name',
                'refnumber',
                'state',
                'date',
                'invoice',
                'path'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single Reminder
     * @param $id - the id of the Reminder to get
     */
    private static function getReminder($id)
    {
        $conf = Config::getInstance();
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'reminders',
            array(
                'id',
                'name',
                'description',
                'refnumber',
                'state',
                'date',
                'invoice',
                'path'
            ),
            array('id', $id),
            1
        );

        $invoice = $dbal->simpleSelect(
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
            array('id', $result['invoice']),
            1
        );

        /* Add items */
        $itemlist = new AmaItemList('invoice', $id);
        $invoice["items"] = $itemlist->entries;
        $invoice["costs"] = $itemlist->costs;

        /* Add due date */
        $date = new DateTime($result['date']);
        $date->add(date_interval_create_from_date_string($conf->get['invoice_due_days'].' days'));
        $invoice['due'] = $date->format("Y-m-d");

        /* Add project data */
        $project = new AmaProject($invoice['project']);
        $result['project'] = array("name"=>$project->name, "id"=>$project->id);
        $result['client'] = $project->getClient();
        $result['invoice'] = $invoice;

        json_response($result);
    }

    /**
     * creates a new Reminder
     */
    private static function createReminder()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'reminders',
            array(
                'name',
                'description',
                'refnumber',
                'state',
                'date',
                'invoice',
                'path'
            ),
            $_POST
        );

        $stream = AmaStream::getInstance();
        $stream->addItem('create','reminder', $id);

        self::getReminder($id);
    }

    /**
     * modifies a Reminder
     */
    private static function modifyReminder()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'reminders',
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
        self::getReminder($affectedid);
    }

    /**
     * deletes a Reminder
     * @param $_DELETE
     */
    private static function deleteReminder($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $stream = AmaStream::getInstance();
            $stream->addItem('delete','reminder', $_DELETE["id"]);

            $count = $dbal->deleteRow('reminders', array('id', $_DELETE['id']));
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
            self::getReminderList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Reminder matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}