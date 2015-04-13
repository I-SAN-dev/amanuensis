<?php
/**
 * Handles the Contracts
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

class contract {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getContract($_GET["id"]);
        }
        else
        {
            self::getContractList();
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
            self::createContract();
        }
        else
        {
            self::modifyContract();
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
            self::deleteContract($_DELETE);
        }
    }

    /**
     * Gets a list of all Contracts
     */
    private static function getContractList()
    {
        //TODO add project+client name
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'contracts',
            array(
                'id',
                'name',
                'description',
                'project',
                'refnumber',
                'date',
                'path'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single Contract
     * @param $id - the id of the Contract to get
     */
    private static function getContract($id)
    {
        //TODO add project+client name
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'contracts',
            array(
                'id',
                'name',
                'description',
                'project',
                'refnumber',
                'date',
                'path'
            ),
            array('id', $id),
            1
        );
        json_response($result);
    }

    /**
     * creates a new Contract
     */
    private static function createContract()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'contracts',
            array(
                'name',
                'description',
                'project',
                'refnumber',
                'date',
                'path'
            ),
            $_POST
        );
        self::getContract($id);
    }

    /**
     * modifies a Contract
     */
    private static function modifyContract()
    {
        //TODO select table and fields
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'contracts',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'refnumber',
                'date',
                'path'
            ),
            $_POST);
        self::getContract($affectedid);
    }

    /**
     * deletes a Contract
     * @param $_DELETE
     */
    private static function deleteContract($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            //TODO select table!
            $count = $dbal->deleteRow('contracts', array('id', $_DELETE['id']));
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
            self::getContractList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Contract matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}