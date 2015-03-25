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

class client {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getClient($_GET['id']);
        }
        else
        {
            self::getClientList();
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
            self::updateClient($_POST['id']);
        }
        else
        {
            self::addClient();
        }
    }

    /**
     * This method outputs a list of all customers
     */
    private static function getClientList()
    {
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("
            SELECT
              customers.id,
              customers.companyname,
              customers.contact_firstname,
              customers.contact_lastname,
              customers.city,
              customers.refnumber,
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


            /* Add the object */
            $list[$row['id']] = array(
                'name' => $displayname,
                'city' => $row['city'],
                'refnumber' => $row['refnumber'],
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
    private static function getClient($id)
    {
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("
            SELECT
              customers.id,
              customers.companyname,
              customers.contact_gender,
              customers.contact_firstname,
              customers.contact_lastname,
              customers.street_no,
              customers.additional,
              customers.zip,
              customers.city,
              customers.country,
              customers.comment,
              customers.refnumber,
              GROUP_CONCAT(customer_category.id ORDER BY customer_category.id SEPARATOR ',') AS ids_categories,
              GROUP_CONCAT(customer_category.name ORDER BY customer_category.id SEPARATOR ',') AS names_categories
            FROM customers
            LEFT JOIN customers_customer_category_mm ON customers.id = customers_customer_category_mm.customer_id
            LEFT JOIN customer_category ON customers_customer_category_mm.category_id = customer_category.id
            WHERE customers.id = :id
            GROUP BY customers.id
            "
        );

        $q->bindParam(':id', $id);
        $q->execute();

        if($row = $q->fetch())
        {
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


            /* fetch additional data */
            $x = $dbal->prepare("
            SELECT
              id,
              datatype,
              name,
              value
            FROM customer_data
            WHERE customer = :id
            "
            );
            $x->bindParam(':id', $id);
            $x->execute();

            /* process additional data */
            $additionalData = array();
            while($entry = $x->fetch())
            {
                $type = $entry['datatype'];
                $data = array(
                    'id' => $entry['id'],
                    'name' => $entry['name'],
                    'value' => $entry['value']
                );

                if(!isset($additionalData[$type]))
                {
                    $additionalData[$type] = array();
                }
                array_push($additionalData[$type], $data);
            }

            /* Build the response*/
            $response = array(
                'id' => $row['id'],
                'companyname' => $row['companyname'],
                'contact_gender' => $row['contact_gender'],
                'contact_firstname' => $row['contact_firstname'],
                'contact_lastname' => $row['contact_lastname'],
                'street_no' => $row['street_no'],
                'street_additional' => $row['additional'],
                'zip' => $row['zip'],
                'city' => $row['city'],
                'country' => $row['country'],
                'comment' => $row['comment'],
                'refnumber' => $row['refnumber'],
                /* If the array is empty, use an empty object instead!!! */
                'categories' => count($categories) > 0 ? $categories : new stdClass(),
                'data' =>  count($additionalData) > 0 ? $additionalData : new stdClass()
            );

            json_response($response);

        }
        else
        {
            $error = new amaException(NULL, 404, 'Cannot find user with ID '.$id);
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }
    }

    /**
     * This method adds a customer
     */
    private static function addClient()
    {

    }

    /**
     * This method updates an existing customer
     * @param $id
     */
    private static function updateClient($id)
    {

    }

}