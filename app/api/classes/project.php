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
require_once('classes/project/amaStream.php');

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
            $projects = $q->fetchAll(PDO::FETCH_ASSOC);

            /* postprocess the projects */
            $response = self::process($projects);

            json_response($response);
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

        $stream = AmaStream::getInstance();
        $stream->addItem('create','project', $id);

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
            $stream = AmaStream::getInstance();
            $stream->addItem('delete','project', $_DELETE["id"]);

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

    /**
     * Processes a list of projects and is adding total costs/worth information
     * @param $projects - an array with projects data
     * @return array - an array with more projects data
     */
    private static function process($projects)
    {
        $response = array(
            'list' => array(),
            'info' => array()
        );

        $overdues = array();
        $overdue_total = 0.0;
        $to_pay = array();
        $to_pay_total = 0.0;
        $day_xs = array();
        $day_x_total = 0.0;


        /* Attach stats to projects */
        foreach($projects as $project)
        {
            $projectObj = new AmaProject($project['id']);
            $pstats = $projectObj->getEstimatedProjectWorths();
            $project['stats'] = $pstats;
            array_push($response['list'], $project);

            /* Total overdue */
            if($pstats['overdue'] > 0)
            {
                array_push($overdues, array('sum'=> $pstats['overdue'], 'project'=> $project['id']));
                $overdue_total = $overdue_total + $pstats['overdue'];
            }

            /* Total to pay */
            foreach($pstats['toPay'] as $payEvent)
            {
                $payEvent['project_id'] = $project['id'];
                array_push($to_pay, $payEvent);
                $to_pay_total = $to_pay_total + $payEvent['sum'];
            }

            /* Total day x */
            if($pstats['toPayDayX'] > 0)
            {
                array_push($day_xs, array('sum'=> $pstats['toPayDayX'], 'project'=> $project['id']));
                $day_x_total = $day_x_total + $pstats['toPayDayX'];
            }

        }

        $response['info']['overdue'] = $overdues;
        $response['info']['overdue_total'] = $overdue_total;
        $response['info']['to_pay'] = $to_pay;
        $response['info']['to_pay_total'] = $to_pay_total;
        $response['info']['day_x'] = $day_xs;
        $response['info']['day_x_total'] = $day_x_total;

        return $response;
    }

}