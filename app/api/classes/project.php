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
require_once('classes/database/state_constants.php');
require_once('classes/errorhandling/amaException.php');
require_once('classes/project/amaProject.php');
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
        $dbal = DBAL::getInstance();

        if(isset($_GET["client"]) && $_GET["client"] != '')
        {
            /* List of all projects of given client */
            $result = $dbal->simpleSelect(
                'projects',
                array(
                    'id',
                    'name',
                    'description',
                    'client',
                    'state'
                ),
                array('client', $_GET["client"]),
                0,
                'state ASC'
            );
            json_response($result);
        }
        else
        {
            $where = '';
            if(isset($_GET["current"]) && $_GET["current"] != '')
            {
                $where = ' WHERE state < '.PROJECT_FINISHED;
            }
            if(isset($_GET["archive"]) && $_GET["archive"] != '')
            {
                $where = ' WHERE state >= '.PROJECT_FINISHED;
            }

            /* List of all projects */
            $q = $dbal->prepare("
                SELECT projects.id, projects.name, projects.description, projects.client, projects.state, customers.companyname, customers.contact_firstname, customers.contact_lastname
                FROM projects LEFT JOIN customers ON projects.client = customers.id ".$where." ORDER BY state ASC ");

            $q->execute();
            json_response($q->fetchAll(PDO::FETCH_ASSOC));
        }


    }

    /**
     * Gets a single Project
     * @param $id - the id of the Project to get
     */
    private static function getProject($id)
    {
        $project = new AmaProject($id);
        json_response($project->getProjectData());
    }

    /**
     * creates a new Project
     */
    private static function createProject()
    {
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
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'projects',
            array('id', $_POST["id"]),
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