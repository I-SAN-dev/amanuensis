<?php
/**
 * This will execute some checks on time limits etc.
 * Execute it via cronjob
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

chdir('..');
set_include_path(getcwd());

require_once('classes/config/config.php');
require_once('classes/errorhandling/amaException.php');
require_once('classes/database/dbal.php');
require_once('classes/database/state_constants.php');
require_once('classes/project/amaProject.php');


/**
 * This function catches all uncaught Exceptions!
 * @param Exception $e
 */
function catchAll($e)
{
    $error = new amaException($e);
    $error->renderJSONerror();
    $error->setHeaders();
}
set_exception_handler('catchAll');

/* execution time */
$start = microtime(true);

$events = array();
/**
 * Adds an event to the event array
 * @param $type - the type of the thing
 * @param $id - the id of the thing
 * @param $name - the display name
 * @param $state - the state of the thing
 */
function pushEvent($type, $id, $name, $state)
{
    global $events;
    array_push($events, array(
        'type' =>  $type,
        'id' => $id,
        'name' => $name,
        'state' => $state
    ));
}


/**
 * @param String $date - a date in format yyy-MM-dd
 * @param boolean $offset - if the invoice-due-days offset should be calculated
 * @return boolean
 */
function isPast($date, $offset = false)
{
    if($offset)
    {
        $conf = Config::getInstance();
        $days = $conf->get['invoice_due_days'];
        $seconds = $days*24*60*60;
        return (strtotime($date) + $seconds) < time();
    }
    return strtotime($date) < time();
}

/* Check all project states */
$dbal = DBAL::getInstance();
$q= $dbal->prepare('
    SELECT id FROM projects WHERE state < :archived
');
$projectArchived = PROJECT_ARCHIVED;
$q->bindParam(':archived', $projectArchived);
$q->execute();

$projectids = $q->fetchAll(PDO::FETCH_ASSOC);



foreach($projectids as $projectid)
{
    $state = PROJECT_CREATED;

    $project = new AmaProject($projectid['id']);
    $projectdata = $project->getProjectData();

    /*
     *  check if we are waiting for something
     */

    /* offer */
    foreach($projectdata['offers'] as $offer)
    {
        if($state == PROJECT_CREATED && $offer['state'] = PDF_SENT)
        {
            $state = PROJECT_WAITING;
        }
    }
    /* acceptance */
    foreach($projectdata['acceptances'] as $acceptance)
    {
        if($state == PROJECT_CREATED && $acceptance['state'] = PDF_SENT)
        {
            $state = PROJECT_WAITING;
        }
    }
    /* invoices */
    foreach($projectdata['invoices'] as $invoice)
    {
        if($state == PROJECT_CREATED && $invoice['state'] = PDF_SENT)
        {
            $state = PROJECT_WAITING;
        }
    }

    /*
     * Check if we need to do something
     */
    /* offers that have to be sent */
    foreach($projectdata['offers'] as $offer)
    {
        if($state <= PROJECT_WAITING && $offer['state'] < PDF_SENT && isPast($offer['date']))
        {
            $state = PROJECT_TODO;
        }
    }
    /* Todos that need to be done */
    foreach($projectdata['todos'] as &$todo)
    {
        if($state <= PROJECT_WAITING && ($todo['items_done'] < $todo['items_total']))
        {
            $state = PROJECT_TODO;
        }
        /* Update the todo list state */
        if(($todo['items_done'] == $todo['items_total']) && $todo['items_total'] > 0 && ($todo['state'] == TODO_TODO || $todo['state'] == TODO_OVERDUE))
        {
            $dbal->dynamicUpdate('todos',array('id', $todo['id']), array('state'), array('state' => TODO_FINISHED));
            pushEvent('todo', $todo['id'], $todo['name'], TODO_FINISHED);
            $todo['state'] = TODO_FINISHED;
        }
        if((($todo['items_done'] < $todo['items_total']) || $todo['items_total'] == 0 ) && $todo['state'] == TODO_FINISHED)
        {
            $dbal->dynamicUpdate('todos',array('id', $todo['id']), array('state'), array('state' => TODO_TODO));
            pushEvent('todo', $todo['id'], $todo['name'], TODO_TODO);
            $todo['state'] = TODO_TODO;
        }
    }
    /* acceptances that have to be sent */
    foreach($projectdata['acceptances'] as $acceptance)
    {
        if($state <= PROJECT_WAITING && $acceptance['state'] < PDF_SENT && isPast($acceptance['date']))
        {
            $state = PROJECT_TODO;
        }
    }
    /* invoices that have to be sent */
    foreach($projectdata['invoices'] as $invoice)
    {
        if($state <= PROJECT_WAITING && $invoice['state'] < PDF_SENT && isPast($invoice['date']))
        {
            $state = PROJECT_TODO;
        }
    }


    /*
     * Check if we are overdue waiting somewhere
     */
    /* Check if an invoice is overdue */
    foreach($projectdata['invoices'] as $invoice)
    {
        if($invoice['state'] == PDF_SENT && isPast($invoice['date'], true))
        {
            $state = PROJECT_WAITING_OVERDUE;
            //set invoice to overdue
            $dbal->dynamicUpdate('invoices', array('id', $invoice['id']), array('state'), array('state'=> INVOICE_OVERDUE));
            pushEvent('invoice', $invoice['id'], $invoice['name'], INVOICE_OVERDUE);
        }
    }

    /*
     * Check if we have overdue todos
     */
    /* Todos that need to be done */
    foreach($projectdata['todos'] as $todo)
    {
        if(($todo['items_done'] < $todo['items_total']) && isset($todo['due']) && isPast($todo['due']))
        {
            $state = PROJECT_TODO_OVERDUE;
        }

        if(($todo['items_done'] < $todo['items_total']) && isset($todo['due']) && isPast($todo['due']) && $todo['state'] == TODO_TODO)
        {
            $dbal->dynamicUpdate('todos',array('id', $todo['id']), array('state'), array('state' => TODO_OVERDUE));
            pushEvent('todo', $todo['id'], $todo['name'], TODO_OVERDUE);
        }
    }


    /*
     * Check if the project is finished
     * we consider it as finished when all offers are accepted or declined,
     * all invoices are paid,
     * there is at least one invoice
     * and there are at least as many invoices as accepted offers
     */
    if($state == PROJECT_CREATED)
    {
        $totalOffers = count($projectdata['offers']);
        $acceptedOffers = 0;
        $declinedOffers = 0;
        $totalInvoices = count($projectdata['invoices']);
        $paidInvoices = 0;

        foreach($projectdata['offers'] as $offer)
        {
            if($offer['state'] == CLIENT_ACCEPTED)
            {
                $acceptedOffers = $acceptedOffers +1;
            }
            else if($offer['state'] == CLIENT_DECLINED)
            {
                $declinedOffers = $declinedOffers +1;
            }
        }
        foreach($projectdata['invoices'] as $invoice)
        {
            if($invoice['state'] == INVOICE_PAID)
            {
                $paidInvoices = $paidInvoices +1;
            }
        }
        if(
            $totalOffers == $acceptedOffers + $declinedOffers
            && $totalInvoices == $paidInvoices
            && $totalInvoices > 0
            && $totalInvoices >= $totalOffers
        )
        {
            $state = PROJECT_FINISHED;
        }
    }

    /**
     * Change project state if necessary
     */
    if($projectdata['state'] != $state)
    {
        pushEvent('project', $projectdata['id'], $projectdata['name'], $state);
        $dbal->dynamicUpdate('projects', array('id', $projectdata['id']), array('state'), array('state' => $state));
    }

}

/**
 * TODO
 * add all events to stream
 */

/**
 * TODO
 * send a report via mail
 */

/* echo execution time */
echo('Processed in '.(microtime(true) - $start).' seconds!');




