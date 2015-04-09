<?php
/**
 * Handles the FileContracts
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

class fileContract {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getFileContract($_GET["id"]);
        }
        else
        {
            self::getFileContractList();
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
            self::createFileContract();
        }
        else
        {
            self::modifyFileContract();
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
            self::deleteFileContract($_DELETE);
        }
    }

    /**
     * Gets a list of all FileContracts
     */
    private static function getFileContractList()
    {
        //TODO add client name
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'fileContracts',
            array(
                'id',
                'name',
                'description',
                'project',
                'path'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single FileContract
     * @param $id - the id of the FileContract to get
     */
    private static function getFileContract($id)
    {
        //TODO add client name
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'fileContracts',
            array(
                'id',
                'name',
                'description',
                'project',
                'path'
            ),
            array('id', $id),
            1
        );
        json_response($result);
    }

    /**
     * creates a new FileContract
     */
    private static function createFileContract()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'fileContracts',
            array(
                'name',
                'description',
                'project',
                'path'
            ),
            $_POST
        );
        self::getFileContract($id);
    }

    /**
     * modifies a FileContract
     */
    private static function modifyFileContract()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'fileContracts',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'path'
            ),
            $_POST);
        self::getFileContract($affectedid);
    }

    /**
     * deletes a FileContract
     * @param $_DELETE
     */
    private static function deleteFileContract($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('fileContracts', array('id', $_DELETE['id']));
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
            self::getFileContractList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no FileContract matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}