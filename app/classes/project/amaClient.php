<?php
/**
 * Gathers all info representing a client
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

require_once('classes/database/dbal.php');

class AmaClient {

    /**
     * Gathers the info for the client with the given id
     * @param $id - the id of the client to get
     * @throws Exception
     */
    public function __construct($id)
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
              customers.hourlyrate,
              customers.dailyrate,
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

        if($row = $q->fetch(PDO::FETCH_ASSOC))
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
              value,
              isdefault
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
                    'value' => $entry['value'],
                    'isdefault' => $entry['isdefault']
                );

                if(!isset($additionalData[$type]))
                {
                    $additionalData[$type] = array();
                }
                array_push($additionalData[$type], $data);
            }



            /* Build the response*/
            $this->data = array(
                'id' => $row['id'],
                'companyname' => $row['companyname'],
                'contact_gender' => $row['contact_gender'],
                'contact_firstname' => $row['contact_firstname'],
                'contact_lastname' => $row['contact_lastname'],
                'street_no' => $row["street_no"],
                'street_additional' => $row['additional'],
                'zip' => $row['zip'],
                'city' => $row['city'],
                'country' => $row['country'],
                'comment' => $row['comment'],
                'refnumber' => $row['refnumber'],
                'hourlyrate' => $row['hourlyrate'],
                'dailyrate' => $row['dailyrate'],
                /* If the array is empty, use an empty object instead!!! */
                'categories' => count($categories) > 0 ? $categories : new stdClass(),
                'data' =>  count($additionalData) > 0 ? $additionalData : new stdClass()
            );


        }
        else
        {
            throw new Exception('No client with id '.$id.' was found', 404);
        }
    }

    /**
     * Gets the array representation of the Client
     * @return array
     */
    public function get()
    {
        return $this->data;
    }

}