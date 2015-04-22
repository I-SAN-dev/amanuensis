<?php
/**
 * Handles the Items
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

class item {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getItem($_GET["id"]);
        }
        else if((isset($_GET['for']) && $_GET['for'] != '')&&(isset($_GET['forid']) && $_GET['forid'] != ''))
        {
            self::getItemsOf($_GET["for"], $_GET["forid"]);
        }
        else
        {
            self::getItemList();
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
            self::createItem();
        }
        else
        {
            self::modifyItem();
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
            self::deleteItem($_DELETE);
        }
    }

    /**
     * Gets a list of all Items
     */
    private static function getItemList()
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'items',
            array(
                'id',
                'name',
                'fixedrate',
                'hourlyrates',
                'dailyrates',
                'userate',
                'offer',
                'contract',
                'todo',
                'acceptance',
                'invoice',
                'todo_done',
                'todo_order',
                'global_order'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single Item
     * @param $id - the id of the Item to get
     */
    private static function getItem($id)
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'items',
            array(
                'id',
                'name',
                'description',
                'fixedrate',
                'hourlyrates',
                'dailyrates',
                'userate',
                'offer',
                'contract',
                'todo',
                'acceptance',
                'invoice',
                'todo_done',
                'todo_order',
                'global_order'
            ),
            array('id', $id),
            1
        );
        json_response($result);
    }

    /**
     * creates a new Item
     */
    private static function createItem()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'items',
            array(
                'name',
                'description',
                'fixedrate',
                'hourlyrates',
                'dailyrates',
                'userate',
                'offer',
                'contract',
                'todo',
                'acceptance',
                'invoice',
                'todo_done',
                'todo_order',
                'global_order'
            ),
            $_POST
        );
        self::getItem($id);
    }

    /**
     * modifies a Item
     */
    private static function modifyItem()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'items',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'fixedrate',
                'hourlyrates',
                'dailyrates',
                'userate',
                'offer',
                'contract',
                'todo',
                'acceptance',
                'invoice',
                'todo_done',
                'todo_order',
                'global_order'
            ),
            $_POST);
        self::getItem($affectedid);
    }

    /**
     * deletes a Item
     * @param $_DELETE
     */
    private static function deleteItem($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('items', array('id', $_DELETE['id']));
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
            if((isset($_DELETE['for']) && $_DELETE['for'] != '')&&(isset($_DELETE['forid']) && $_DELETE['forid'] != ''))
            {
                self::getItemsOf($_DELETE["for"], $_DELETE["forid"]);
            }
            else
            {
                self::getItemList();
            }
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Item matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }



    /**
     * returns an item list of items associated with a given thing
     * @param String $column - the type of thing which the items are associated with
     * @param Int $id - the id of the column the items are associated with
     */
    private static function getItemsOf($column, $id)
    {
        $itemlist = new AmaItemList($column, $id);
        json_response($itemlist->entries);
    }

}