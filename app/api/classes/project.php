<?php
/**
 * Handles the Projects
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

class project {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getProject($_GET["id"]);
        }
        else
        {
            self::getProjectList();
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
            self::createProject();
        }
        else
        {
            self::modifyProject();
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
            self::deleteProject($_DELETE);
        }
    }

    /**
     * Gets a list of all Projects
     */
    private static function getProjectList()
    {
        //TODO select table and fields
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'projects',
            array(
                'id',
                'name',
                'client',
                'state'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single Project
     * @param $id - the id of the Project to get
     */
    private static function getProject($id)
    {
        //TODO select table and fields
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'projects',
            array(
                'id',
                'name',
                'description',
                'client',
                'state'
            ),
            array('id', $id),
            1
        );
        json_response($result);
    }

    /**
     * creates a new Project
     */
    private static function createProject()
    {
        //TODO select table and fields
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'projects',
            array(
                'name',
                'description',
                'state',
                'client'
            ),
            $_POST
        );
        self::getProject($id);
    }

    /**
     * modifies a Project
     */
    private static function modifyProject()
    {
        //TODO select table and fields
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'projects',
            array('id', $id),
            array(
                'name',
                'description',
                'state'
            ),
            $_POST);

        self::getProject($affectedid);
    }

    /**
     * deletes a Project
     * @param $_DELETE
     */
    private static function deleteProject($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            //TODO select table!
            $count = $dbal->deleteRow('projects', array('id', $_DELETE['id']));
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
            self::getProjectList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Project matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}