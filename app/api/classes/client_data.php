<?php
/**
 * Modify additional client data
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

class client_data {

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        Authenticator::onlyFor(0);

        if(( !isset($_POST["id"]) || $_POST["id"]=='') && (isset($_POST["clientid"]) && $_POST["clientid"] != ''))
        {
            self::createData();
        }
        else if((!isset($_POST["clientid"]) || $_POST["clientid"] =='') && (isset($_POST["id"]) || $_POST["id"]!=''))
        {
            self::modifyData();
        }
        else
        {
            $error = new amaException(NULL, 400, "No id or clientid specified");
            $error->renderJSONerror();
            $error->setHeaders();
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
            self::deleteData($_DELETE);
        }
    }

    /**
     * Creates a new data entry for a given user
     */
    private static function createData()
    {
        $_POST["customer"] = $_POST["clientid"];

        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'customer_data',
            array(
                'datatype',
                'name',
                'value',
                'customer',
                'isdefault'
            ),
            $_POST
        );
        json_response(array('success' => true, 'id' => $id));
    }

    /**
     * modifys data with the given id
     */
    private static function modifyData()
    {
        $dbal = DBAL::getInstance();
        $dbal->dynamicUpdate(
            'customer_data',
            array('id', $_POST["id"]),
            array(
                'datatype',
                'name',
                'value',
                'isdefault'
            ),
            $_POST);
        json_response(array('success' => true));
    }

    /**
     * Deletes a given data entry
     * @param $_DELETE
     */
    private static function deleteData($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('customer_data', array('id', $_DELETE['id']));
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
            json_response(array('success' => true));
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no data matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }



}