<?php
/**
 * Can return the connections of one item or can return a list of all unbound items in a project
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
require_once('classes/project/amaProject.php');
require_once('classes/project/amaItemList.php');
require_once('classes/project/amaItem.php');

class item_connection {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getItemConnection($_GET["id"]);
        }
        else if((isset($_GET['for']) && $_GET['for'] != '')&&(isset($_GET['forid']) && $_GET['forid'] != ''))
        {
            self::getAvailableItems($_GET["for"], $_GET["forid"]);
        }
        else
        {
            $error = new amaException(NULL, 400, "No id specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

    /**
     * Gets all set connections
     * @param $id - the id of the item
     */
    private static function getItemConnection($id)
    {
        $dbal = DBAL::getInstance();

        /* Get the item */
        $item = $dbal->simpleSelect(
            'items',
            array('offer','contract','todo','acceptance','invoice'),
            array('id', $id),
            1
        );

        if(!$item)
        {
            $error = new amaException(NULL, 404, "No item with id ".$id." found");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        $result = array();

        /* Get the data */
        foreach(array('offer', 'todo', 'acceptance', 'invoice') as $type)
        {
            if(isset($item[$type]))
            {
                $result[$type] = $dbal->simpleSelect(
                    $type.'s',
                    array('id','name','refnumber','state'),
                    array('id', $item[$type]),
                    1
                );
            }
            else
            {
                $result[$type] = new stdClass;
            }

        }
        /* Get the contract data */
        if(isset($item['contract']))
        {
            $result['contract'] = $dbal->simpleSelect(
                'contracts',
                array('id','name','refnumber'),
                array('id', $item['contract']),
                1
            );
        }
        else
        {
            $result['contract'] = new stdClass;
        }

        json_response($result);

    }

    /**
     * Gets a list of all items which belong to the project of the given thing,
     * which are not yet connected to a thing of the same class as the given one
     * @param $for
     * @param $forid
     */
    private static function getAvailableItems($for, $forid)
    {
        if(!in_array($for, array('offer','contract','todo','acceptance','invoice')))
        {
            $error = new amaException(NULL, 400, "Invalid parameter 'for'");
            $error->renderJSONerror();
            $error->setHeaders();
        }

        /* get the project id */
        $dbal = DBAL::getInstance();
        /* Get the thing */
        $thing = $dbal->simpleSelect(
            $for.'s',
            array('project'),
            array('id', $forid),
            1
        );

        $project = new AmaProject($thing['project']);
        $client = $project->getClient();

        /* Here comes the sick sql shit */

        $query = '
            SELECT DISTINCT
              items.id, items.name, items.fixedrate, items.hourlyrates, items.hourlyrate, items.dailyrates, items.dailyrate, items.userate, items.todo_done, items.global_order,
              items.offer, items.contract, items.todo, items.acceptance, items.invoice
            FROM items
                  LEFT JOIN offers ON (items.offer = offers.id)
                  LEFT JOIN contracts ON (items.contract = contracts.id)
                  LEFT JOIN todos ON (items.todo = todos.id)
                  LEFT JOIN acceptances ON (items.acceptance = acceptances.id)
                  LEFT JOIN invoices ON (items.invoice = invoices.id)
            WHERE (offers.project = :projectid OR contracts.project = :projectid OR todos.project = :projectid OR acceptances.project = :projectid OR invoices.project = :projectid)
            AND items.'.$for.' IS NULL ORDER BY items.global_order ASC
        ';

        $q = $dbal->prepare($query);
        $q->bindParam(':projectid', $project->id);
        $q->execute();

        $result = $q->fetchAll(PDO::FETCH_ASSOC);

        /* Postprocess the result */
        $response = array();
        foreach($result as $entry)
        {
            try
            {
                $item = new AmaItem(NULL, $entry, $client);
                array_push($response, $item->get());
            }
            catch(Exception $e)
            {
                /* Use raw data instead */
                $entry['error'] = 'failed to process';
                array_push($response, $entry);
            }

        }

        json_response($response);
    }




}