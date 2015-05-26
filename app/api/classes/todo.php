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
require_once('classes/project/amaItemList.php');
require_once('classes/project/amaProject.php');
require_once('classes/project/amaStream.php');

class todo {

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
        /* Count items and done items*/
        foreach($result AS &$todo)
        {
            $q = $dbal->prepare('
                    SELECT COUNT(*) AS items  FROM items WHERE todo = :todo GROUP BY todo_done ORDER BY todo_done ASC
                ');
            $q->bindParam(':todo', $todo['id']);
            $q->execute();
            /* items not done */
            $undone = $q->fetch(PDO::FETCH_ASSOC);
            /* items done */
            $done = $q->fetch(PDO::FETCH_ASSOC);

            $todo['items_total'] = $undone['items'] + $done['items'];
            $todo['items_done'] = $done['items'];
        }
        json_response($result);
    }

    /**
     * Gets a single Todo
     * @param $id - the id of the Todo to get
     */
    private static function getTodo($id)
    {
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
        /* Count items and done items*/
        $q = $dbal->prepare('
                SELECT COUNT(*) AS items  FROM items WHERE todo = :todo GROUP BY todo_done ORDER BY todo_done ASC
            ');
        $q->bindParam(':todo', $result['id']);
        $q->execute();
        /* items not done */
        $undone = $q->fetch(PDO::FETCH_ASSOC);
        /* items done */
        $done = $q->fetch(PDO::FETCH_ASSOC);

        $result['items_total'] = $undone['items'] + $done['items'];
        $result['items_done'] = $done['items'];


        /* Add items */
        $itemlist = new AmaItemList('todo', $id);
        $result["items"] = $itemlist->entries;

        /* Add project data */
        $project = new AmaProject($result['project']);
        $result['project'] = $project->getProjectData();

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

        $stream = AmaStream::getInstance();
        $stream->addItem('create','todo', $id);

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
            $stream = AmaStream::getInstance();
            $stream->addItem('delete','todo', $_DELETE["id"]);

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