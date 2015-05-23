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
            'invoices' => $this->getInvoices()
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
            $this->client = $this->dbal->simpleSelect(
                'customers',
                array('id', 'refnumber', 'companyname', 'contact_gender', 'contact_firstname', 'contact_lastname', 'street_no', 'additional', 'zip', 'city', 'country','dailyrate', 'hourlyrate'),
                array('id', $this->clientid),
                1);
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

}