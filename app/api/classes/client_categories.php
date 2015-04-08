<?php
/**
 * Handle user categories
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

class client_categories {

    /**
     * This method reacts to GET Requests,
     * It serves all client categories
     * @param $id - an optional id to filter
     */
    public static function get($id = NULL)
    {
        //Authenticator::onlyFor(0, 1);

        $dbal = DBAL::getInstance();

        /* where from get */
        $where = (isset($_GET["id"])&&$_GET["id"]!='') ? array('id', $_GET["id"]) : NULL;
        $limit = ((isset($_GET["id"])&&$_GET["id"]!='')||isset($id)) ? 1 : 0;
        /* optional override of where */
        if(isset($id))
        {
            $where = array('id', $id);
        }
        $result = $dbal->simpleSelect(
            'customer_category',
            array(
                'id',
                'name',
                'description'
                ),
            $where,
            $limit
            );
        json_response($result);
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        Authenticator::onlyFor(0);

        if(!isset($_POST["id"]) || $_POST["id"]=='')
        {
            self::createCategory();
        }
        else if(!isset($_POST["clientid"]) || $_POST["clientid"]=='')
        {
            self::updateCategory();
        }
        else
        {
            self::createCategoryLink();
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
            $error = new amaException(NULL, 400, 'No ID was specified!');
            $error->renderJSONerror();
            $error->setHeaders();
        }
        else if(!isset($_DELETE["clientid"]) || $_DELETE["clientid"]=='')
        {
            self::deleteCategory($_DELETE['id']);
        }
        else
        {
            self::deleteCategoryLink($_DELETE['id'], $_DELETE['clientid']);
        }
    }

    /**
     * Creates a new category
     * outputs it when successfull
     */
    private static function createCategory()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'customer_category',
            array(
                'name',
                'description'
            ),
            $_POST
        );
        self::get($id);
    }

    /**
     * Updates an existing category
     * outputs it when successfull
     */
    private static function updateCategory()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicUpdate(
            'customer_category',
            array('id', $_POST['id']),
            array(
                'name',
                'description'
            ),
            $_POST
        );
        self::get($id);
    }

    /**
     * Creates the link between a category and a client
     */
    private static function createCategoryLink()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'customers_customer_category_mm',
            array(
                'customer_id',
                'category_id'
            ),
            array(
                'customer_id' => $_POST['clientid'],
                'category_id' => $_POST['id']
            )
        );
        json_response(array(
            'success' => true,
            'relationid' => $id
            ));
    }

    /**
     * Deletes a category
     * @param $id - the id of the category that should be deleted
     */
    private static function deleteCategory($id)
    {
        $dbal = DBAL::getInstance();
        $dbal->deleteRow(
            'customer_category',
            array('id', $id)
        );
        self::get();
    }

    /**
     * Deletes the link between a customer and a category
     * @param $id - the id of the category
     * @param $clientid - the id of the client
     */
    private static function deleteCategoryLink($id, $clientid)
    {
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("
            DELETE FROM customers_customer_category_mm
            WHERE customer_id = :customer_id AND category_id = :category_id
        ");

        $q->bindParam(':customer_id', $clientid);
        $q->bindParam(':category_id', $id);
        $q->execute();

        json_response(array(
            'success' => true
        ));
    }

}