<?php
/**
 * Handles the Todos
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
            self::getTodo($_GET["id"]);
        }
        else
        {
            self::getTodoList();
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
            self::createTodo();
        }
        else
        {
            self::modifyTodo();
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
            self::deleteTodo($_DELETE);
        }
    }

    /**
     * Gets a list of all Todos
     */
    private static function getTodoList()
    {
        //TODO add client name
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'todos',
            array(
                'id',
                'name',
                'due',
                'project'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single Todo
     * @param $id - the id of the Todo to get
     */
    private static function getTodo($id)
    {
        //TODO add client name
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'todos',
            array(
                'id',
                'name',
                'due',
                'project'
            ),
            array('id', $id),
            1
        );
        json_response($result);
    }

    /**
     * creates a new Todo
     */
    private static function createTodo()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'todos',
            array(
                'name',
                'due',
                'project'
            ),
            $_POST
        );
        self::getTodo($id);
    }

    /**
     * modifies a Todo
     */
    private static function modifyTodo()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'todos',
            array('id', $_POST["id"]),
            array(
                'name',
                'due'
            ),
            $_POST);
        self::getTodo($affectedid);
    }

    /**
     * deletes a Todo
     * @param $_DELETE
     */
    private static function deleteTodo($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('todos', array('id', $_DELETE['id']));
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
            self::getTodoList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Todo matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}