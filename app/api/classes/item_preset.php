<?php
/**
 * Handles the ItemPresets
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
require_once('classes/project/amaItem.php');

class item_preset {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getItemPreset($_GET["id"]);
        }
        else
        {
            self::getItemPresetList();
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
            self::createItemPreset();
        }
        else
        {
            self::modifyItemPreset();
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
            self::deleteItemPreset($_DELETE);
        }
    }

    /**
     * Gets a list of all ItemPresets
     */
    private static function getItemPresetList()
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'item_presets',
            array(
                'id',
                'name',
                'description',
                'fixedrate',
                'hourlyrates',
                'hourlyrate',
                'dailyrates',
                'dailyrate',
                'userate'
            )
        );
        /* postprocess the items */
        foreach($result as &$entry)
        {
            try{
                $e = new AmaItem(NULL, $entry, NULL, true);
                $entry = $e->get();
            }
            catch(Exception $e)
            {
                /* Just ignore them, better raw data than nothing here */
            }
        }
        json_response($result);
    }

    /**
     * Gets a single ItemPreset
     * @param $id - the id of the ItemPreset to get
     */
    private static function getItemPreset($id)
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'item_presets',
            array(
                'id',
                'name',
                'description',
                'fixedrate',
                'hourlyrates',
                'hourlyrate',
                'dailyrates',
                'dailyrate',
                'userate'
            ),
            array('id', $id),
            1
        );
        try {
            $item = new AmaItem(NULL, $result, NULL, true);
            $result = $item->get();
        }
        catch(Exception $e)
        {
            /* Just ignore them, better raw data than nothing */
        }
        json_response($result);
    }

    /**
     * creates a new ItemPreset
     */
    private static function createItemPreset()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'item_presets',
            array(
                'name',
                'description',
                'fixedrate',
                'hourlyrates',
                'hourlyrate',
                'dailyrates',
                'dailyrate',
                'userate'
            ),
            $_POST
        );
        self::getItemPreset($id);
    }

    /**
     * modifies a ItemPreset
     */
    private static function modifyItemPreset()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'item_presets',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'fixedrate',
                'hourlyrates',
                'hourlyrate',
                'dailyrates',
                'dailyrate',
                'userate'
            ),
            $_POST);
        self::getItemPreset($affectedid);
    }

    /**
     * deletes a ItemPreset
     * @param $_DELETE
     */
    private static function deleteItemPreset($_DELETE)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('item_presets', array('id', $_DELETE['id']));
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
            self::getItemPresetList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no ItemPreset matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}