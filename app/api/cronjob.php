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
require_once('classes/project/amaStream.php');
require_once('classes/mail/amaMail.php');


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

/**
 * Returns a name of a state
 * @param $type
 * @param $id
 */
function getState($type, $id)
{
    $states = array(
        "project" => array(
            0 => "erstellt",
            1 => "wartend",
            2 => "offene Aufgaben",
            3 => "überfällig wartend",
            4 => "überfällige Aufgaben",
            7 => "abgeschlossen",
            8 => "archiviert"
        ),
        "global" => array(
            0 => "erstellt",
            1 => "PDF generiert",
            2 => "PDF verschickt",
            3 => "angenommen",
            -1 => "abgelehnt"
        ),
        "todo" => array(
            0 => "offene Aufgaben",
            1 => "abgeschlossen",
            2 => "überfällige Aufgaben"
        )
    );
    $states['offer'] = $states['global'];
    $states['acceptance'] = $states['global'];
    $states['invoice'] = $states['global'];
    $states['reminder'] = $states['global'];
    $states['invoice'][3] = "bezahlt";
    $states['invoice'][4] = "überfällig";
    $states['invoice'][5] = "überfällig, Zahlungserinnerung erstellt";

    return isset($states[$type][$id]) ? $states[$type][$id] : $id;
}

/**
 * Returns a linked name and declaration
 * @param $event - the event
 * @return string $html
 */
function getLink($event)
{
    $conf = Config::getInstance();
    $data = array(
        "project" => array('/project/:id', 'Das Projekt'),
        "offer" => array('/offers/:id', 'Das Angebot'),
        "todo" => array('/todos/:id', 'Die Aufgabenliste'),
        "acceptance" => array('/acceptances/:id', 'Die Abnahme'),
        "invoice" => array('/invoices/:id', 'Die Rechnung'),
        "reminder" => array('/reminders/:id', 'Die Zahlungserinnerung'),
    );

    $typestring = $data[$event['type']][1];
    $url = $conf->get['baseurl'].str_replace(':id', $event['id'], $data[$event['type']][0]);
    $name = $event['name'];

    $html = '
        '.$typestring.' <a href="'.$url.'">'.$name.'</a>
    ';

    return $html;
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
        if($state == PROJECT_CREATED && $offer['state'] == PDF_SENT)
        {
            $state = PROJECT_WAITING;
        }
    }
    /* acceptance */
    foreach($projectdata['acceptances'] as $acceptance)
    {
        if($state == PROJECT_CREATED && $acceptance['state'] == PDF_SENT)
        {
            $state = PROJECT_WAITING;
        }
    }
    /* invoices */
    foreach($projectdata['invoices'] as $invoice)
    {
        if($state == PROJECT_CREATED && $invoice['state'] == PDF_SENT)
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
        if($invoice['state'] >= PDF_SENT && isPast($invoice['date'], true))
        {
            $state = PROJECT_WAITING_OVERDUE;
        }
        if($invoice['state'] == PDF_SENT && isPast($invoice['date'], true))
        {
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

/*
 * add all events to stream
 */
$stream = AmaStream::getInstance();
foreach($events as $event)
{
    $stream->addItem('changestate.'.$event['type'].'.'.$event['state'], $event['type'], $event['id'], true);
}

/*
 * send a report via mail
 */
if(count($events) > 0)
{
    $conf = Config::getInstance();
    $mail = new AmaMail($conf->get['company'], $conf->get['mail']['admin'], count($events)." neue Benachrichtigungen von amanu");

    $html = '
Hallo,<br/>
<br/>
es gibt Neuigkeiten von <a href="'.$conf->get['baseurl'].'">amanu</a>!<br/>
<ul>
';

    foreach($events as $event)
    {
        $html = $html.'
            <li>
                '.getLink($event).' hat jetzt den Status "'.getState($event['type'], $event['state']).'"
            </li>
        ';
    }

    $html = $html.'
</ul>
<br/>

Gehe jetzt zu <a href="'.$conf->get['baseurl'].'">amanu</a>
';

    $mail->setContent($html);
    $mail->send();
}

/*
 * clean up the database
 */

/* stream */
$stream->cleanUpOld();

/* unused items */
$x = $dbal->prepare('
       DELETE FROM items
       WHERE offer IS NULL
       AND contract IS NULL
       AND todo IS NULL
       AND acceptance IS NULL
       AND invoice IS NULL
');
$x->execute();

/* echo execution time */
echo('Processed in '.(microtime(true) - $start).' seconds!');




