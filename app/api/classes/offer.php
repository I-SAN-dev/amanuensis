<?php
/**
 * Handles the Offers
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

class offer {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getOffer($_GET["id"]);
        }
        else
        {
            self::getOfferList();
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
            self::createOffer();
        }
        else
        {
            self::modifyOffer();
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
            self::deleteOffer($_DELETE);
        }
    }

    /**
     * Gets a list of all Offers
     */
    private static function getOfferList()
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'offers',
            array(
                'id',
                'name',
                'refnumber',
                'project',
                'date',
                'state',
                'path'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single Offer
     * @param $id - the id of the Offer to get
     */
    private static function getOffer($id)
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'offers',
            array(
                'id',
                'name',
                'refnumber',
                'description',
                'project',
                'date',
                'state',
                'path'
            ),
            array('id', $id),
            1
        );


        /* Add items */
        $itemlist = new AmaItemList('offer', $id);
        $result["items"] = $itemlist->entries;
        $result["costs"] = $itemlist->costs;

        /* Add project data */
        $project = new AmaProject($result['project']);
        $result['project'] = $project->getProjectData();

        json_response($result);
    }

    /**
     * creates a new Offer
     */
    private static function createOffer()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'offers',
            array(
                'name',
                'description',
                'refnumber',
                'project',
                'date',
                'state',
                'path'
            ),
            $_POST
        );

        $stream = AmaStream::getInstance();
        $stream->addItem('create','offer', $id);

        self::getOffer($id);
    }

    /**
     * modifies a Offer
     */
    private static function modifyOffer()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'offers',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'refnumber',
                'date',
                'state',
                'path'
            ),
            $_POST);
        self::getOffer($affectedid);
    }

    /**
     * deletes a Offer
     * @param $_DELETE
     */
    private static function deleteOffer($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $stream = AmaStream::getInstance();
            $stream->addItem('delete','offer', $_DELETE["id"]);

            $count = $dbal->deleteRow('offers', array('id', $_DELETE['id']));
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
            self::getOfferList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Offer matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}