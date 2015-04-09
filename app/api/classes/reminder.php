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
        //TODO add client name
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
        //TODO add client name
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