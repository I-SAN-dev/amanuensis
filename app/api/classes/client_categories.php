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

class client_categories {

    /**
    * This method reacts to GET Requests,
    * It serves all client categories
    */
    public static function get()
    {
        $dbal = DBAL::getInstance();

        $where = (isset($_GET["id"])&&$_GET["id"]!='') ? array('id', $_GET["id"]) : NULL;

        $result = $dbal->simpleSelect(
            'customer_category',
            array(
                'id',
                'name',
                'description'
                ),
            $where
            );
        json_response($result);
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        echo 'Hello World: that was a post!';
    }

    /**
     * This methods reacts to DELETE Requests
     */
    public static function delete()
    {
        echo 'Hello World: that was a delete!';
    }

}