<?php
/**
 * Handles the Acceptances
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
require_once('classes/project/amaProject.php');

class acceptance {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getAcceptance($_GET["id"]);
        }
        else
        {
            self::getAcceptanceList();
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
            self::createAcceptance();
        }
        else
        {
            self::modifyAcceptance();
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
            self::deleteAcceptance($_DELETE);
        }
    }

    /**
     * Gets a list of all Acceptances
     */
    private static function getAcceptanceList()
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'acceptances',
            array(
                'id',
                'name',
                'project',
                'state',
                'path'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single Acceptance
     * @param $id - the id of the Acceptance to get
     */
    private static function getAcceptance($id)
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'acceptances',
            array(
                'id',
                'name',
                'description',
                'project',
                'state',
                'path'
            ),
            array('id', $id),
            1
        );

        /* Add items */
        $itemlist = new AmaItemList('acceptance', $id);
        $result["items"] = $itemlist->entries;
        $result["total"] = $itemlist->total;

        /* Add project data */
        $project = new AmaProject($result['project']);
        $result['project'] = $project->getProjectData();

        json_response($result);
    }

    /**
     * creates a new Acceptance
     */
    private static function createAcceptance()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'acceptances',
            array(
                'name',
                'description',
                'project',
                'state',
                'path'
            ),
            $_POST
        );
        self::getAcceptance($id);
    }

    /**
     * modifies a Acceptance
     */
    private static function modifyAcceptance()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'acceptances',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'state',
                'path'
            ),
            $_POST);
        self::getAcceptance($affectedid);
    }

    /**
     * deletes a Acceptance
     * @param $_DELETE
     */
    private static function deleteAcceptance($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('acceptances', array('id', $_DELETE['id']));
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
            self::getAcceptanceList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Acceptance matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}