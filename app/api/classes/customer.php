<?php
/**
 * This class allows to get a list of customers, a specific customer
 * create a new customer and update an existing customer
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

class customer {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getCustomer($_GET['id']);
        }
        else
        {
            self::getCustomerList();
        }
    }

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        if(isset($_POST['id']) && $_POST['id'] != '')
        {
            self::updateCustomer($_POST['id']);
        }
        else
        {
            self::addCustomer();
        }
    }

    /**
     * This method outputs a list of all customers
     */
    private static function getCustomerList()
    {

    }

    /**
     * This method outputs the data of a specific customer
     * @param $id
     */
    private static function getCustomer($id)
    {

    }

    /**
     * This method adds a customer
     */
    private static function addCustomer()
    {

    }

    /**
     * This method updates an existing customer
     * @param $id
     */
    private static function updateCustomer($id)
    {

    }

}