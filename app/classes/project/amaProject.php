<?php
/**
 * Holds functions for Project Handling
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
require_once('classes/errorhandling/amaException.php');
require_once('classes/config/config.php');
require_once('classes/project/amaClient.php');
require_once('classes/project/amaItemList.php');

class AmaProject {

    public function __construct($id)
    {
        $this->id = $id;
        $this->dbal = DBAL::getInstance();
        $data = $this->dbal->simpleSelect(
            'projects',
            array('name', 'description', 'client', 'state'),
            array('id', $this->id),
            1);
        $this->name = $data['name'];
        $this->description = $data['description'];
        $this->clientid = $data['client'];
        $this->state = $data['state'];
    }

    /**
     * Returns an array with basic project data, including the client
     * @return array
     */
    public function getProjectData()
    {
        return array(
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'state' => $this->state,
            'client' => $this->getClient(),
            'offers' => $this->getOffers(),
            'contracts' => $this->getContracts(),
            'fileContracts' => $this->getFileContracts(),
            'todos' => $this->getTodos(),
            'acceptances' => $this->getAcceptances(),
            'invoices' => $this->getInvoices(),
            'stats' => $this->getEstimatedProjectWorths()
        );
    }

    /**
     * Returns an array that represents the associated client
     * @return array
     */
    public function getClient()
    {
        if(!isset($this->client))
        {
            $client = new AmaClient($this->clientid);
            $this->client = $client->get();
        }
        return $this->client;
    }

    /**
     * Returns an array that represents all offers associated with this project
     * @return array
     */
    public function getOffers()
    {
        if(!isset($this->offers))
        {
            $this->offers = $this->dbal->simpleSelect(
                'offers',
                array('id', 'refnumber', 'name', 'date', 'state', 'path'),
                array('project', $this->id)
                );
        }
        return $this->offers;
    }

    /**
     * Returns an array that represents all contracts associated with this project
     * @return array
     */
    public function getContracts()
    {
        if(!isset($this->contracts))
        {
            $this->contracts = $this->dbal->simpleSelect(
                'contracts',
                array('id', 'refnumber', 'name', 'date', 'path'),
                array('project', $this->id)
            );
        }
        return $this->contracts;
    }

    /**
     * Returns an array that represents all fileContracts associated with this project
     * @return array
     */
    public function getFileContracts()
    {
        if(!isset($this->fileContracts))
        {
            $this->fileContracts = $this->dbal->simpleSelect(
                'fileContracts',
                array('id', 'name', 'path'),
                array('project', $this->id)
            );
        }
        return $this->fileContracts;
    }

    /**
     * Returns an array that represents all Todos associated with this project
     * @return array
     */
    public function getTodos()
    {
        if(!isset($this->todos))
        {
            $this->todos = $this->dbal->simpleSelect(
                'todos',
                array('id', 'name', 'due'),
                array('project', $this->id),
                0,
                'due ASC'
            );
            /* Count items and done items*/
            foreach($this->todos AS &$todo)
            {
                $q = $this->dbal->prepare('
                    SELECT COUNT(*) AS items  FROM items WHERE todo = :todo GROUP BY todo_done ORDER BY todo_done ASC
                ');
                $q->bindParam(':todo', $todo['id']);
                $q->execute();
                /* items not done */
                $undone = $q->fetch(PDO::FETCH_ASSOC);
                /* items done */
                $done = $q->fetch(PDO::FETCH_ASSOC);

                $todo['items_total'] = $undone['items'] + $done['items'];
                $todo['items_done'] = $done['items'];
            }
        }
        return $this->todos;
    }

    /**
     * Returns an array that represents all acceptances associated with this project
     * @return array
     */
    public function getAcceptances()
    {
        if(!isset($this->acceptances))
        {
            $this->acceptances = $this->dbal->simpleSelect(
                'acceptances',
                array('id', 'refnumber', 'name', 'state', 'path'),
                array('project', $this->id)
            );
        }
        return $this->acceptances;
    }

    /**
     * Returns an array that represents all invoices associated with this project
     * @return array
     */
    public function getInvoices()
    {
        if(!isset($this->invoices))
        {
            $this->invoices = $this->dbal->simpleSelect(
                'invoices',
                array('id', 'refnumber', 'name', 'date', 'path', 'state'),
                array('project', $this->id)
            );
            $conf = Config::getInstance();
            foreach($this->invoices as &$invoice)
            {
                /* Add due date */
                $date = new DateTime($invoice['date']);
                $date->add(date_interval_create_from_date_string($conf->get['invoice_due_days'].' days'));
                $invoice['due'] = $date->format("Y-m-d");


                /* Add reminders */
                $invoice['reminders'] = $this->dbal->simpleSelect(
                    'reminders',
                    array(
                        'id',
                        'name',
                        'refnumber',
                        'date',
                        'state'
                    ),
                    array('invoice', $invoice['id']),
                    0,
                    'date ASC'
                );

            }
        }
        return $this->invoices;
    }


    /**
     * Calculates a number of project payment and cashflow overviews
     */
    public function getEstimatedProjectWorths()
    {
        if(!isset($this->stats))
        {
            $invoices = $this->getInvoices();
            $offers = $this->getOffers();

            /* Get total offered and accepted sum */
            $offeredSum = 0.0;
            foreach($offers as $offer)
            {
                if($offer['state'] == 3)
                {
                    $itemList = new AmaItemList('offer',$offer['id']);
                    $offeredSum = $offeredSum + $itemList['costs']['total'];
                }
            }

            /* Get invoiced sum */
            $invoicedTotal = 0.0;
            $overdueSum = 0.0;
            $paidSum = 0.0;
            $toPay = array();
            foreach($invoices as $invoice)
            {
                $itemList = new AmaItemList('invoice',$invoice['id']);
                $invoicedTotal = $invoicedTotal + $itemList->costs['total'];

                /* check if overdue */
                if($invoice['state'] >= 4)
                {
                    $overdueSum = $overdueSum + $itemList->costs['total'];
                }
                /* check if paid */
                else if($invoice['state'] == 3)
                {
                    $paidSum = $paidSum + $itemList->costs['total'];
                }
                /* check if open */
                else if($invoice['state'] <= 2)
                {
                    $payEvent = array();
                    $payEvent['sum'] = $itemList->costs['total'];
                    $payEvent['date'] = $invoice['date'];
                    $payEvent['invoice_id'] = $invoice['id'];

                    array_push($toPay, $payEvent);
                }
            }

            /* Calc the results */
            if($invoicedTotal >= $offeredSum)
            {
                $total_day_x = 0;
                $total_project = $invoicedTotal;
            }
            else
            {
                $total_day_x = $offeredSum - $invoicedTotal;
                $total_project = $offeredSum;
            }

            $result = array(
                'paid' => $paidSum,
                'overdue' => $overdueSum,
                'toPay' => $toPay,
                'toPayDayX' => $total_day_x,
                'totalProjectWorth' => $total_project
            );

            $this->stats = $result;
        }
        return $this->stats;
    }

}