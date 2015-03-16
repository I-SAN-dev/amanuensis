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
        //Authenticator::onlyFor(0, 1);

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
        Authenticator::onlyFor(0);

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
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("
            SELECT
              customers.id,
              customers.companyname,
              customers.contact_firstname,
              customers.contact_lastname,
              customers.city,
              GROUP_CONCAT(customer_category.id ORDER BY customer_category.id SEPARATOR ',') AS ids_categories,
              GROUP_CONCAT(customer_category.name ORDER BY customer_category.id SEPARATOR ',') AS names_categories
            FROM customers
            LEFT JOIN customers_customer_category_mm ON customers.id = customers_customer_category_mm.customer_id
            LEFT JOIN customer_category ON customers_customer_category_mm.category_id = customer_category.id
            GROUP BY customers.id
            "
        );
        $q->execute();

        $list = array();

        while($row = $q->fetch())
        {
            /* Build the display name */
            if(isset($row['companyname']) && $row['companyname'] != '')
            {
                $displayname = $row['companyname'];
            }
            else
            {
                $displayname = $row['contact_lastname'].' '.$row['contact_firstname'];
            }

            /* Build the categories */
            $categories = array();
            $catids = explode(',', $row['ids_categories']);
            $catnames = explode(',', $row['names_categories']);

            for($i = 0; $i< count($catids); $i++)
            {
                if($catids[$i] != '')
                {
                    $categories[$catids[$i]] = $catnames[$i];
                }
            }

            /* Build the city */
            $city = $row['city'] ? $row['city'] : '';

            /* Add the object */
            $list[$row['id']] = array(
                'name' => $displayname,
                'city' => $city,
                /* If the array is empty, use an empty object instead!!! */
                'categories' => count($categories) > 0 ? $categories : new stdClass()
            );
        }
        json_response($list);
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