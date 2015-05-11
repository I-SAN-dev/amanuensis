<?php
/**
 * This represents a list of Items matching given criteria
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

class AmaItemList {

    /**
     * @param $column - offer, contract, todo, acceptance or invoice
     * @param $id - the id of the above mentioned thing
     * @throws Exception
     */
    public function __construct($column, $id)
    {
        if(in_array($column, array('offer', 'contract', 'todo', 'acceptance', 'invoice')))
        {
            $dbal = DBAL::getInstance();
            $conf = Config::getInstance();

            $this->total = 0.0;

            /* Fetch client */
            $table = $column.'s';
            $query = "
                SELECT customers.hourlyrate, customers.dailyrate
                FROM customers
                LEFT JOIN projects ON projects.client = customers.id
                LEFT JOIN ".$table." ON ".$table.".project = projects.id
                WHERE ".$table.".id = :id
                LIMIT 1
            ";
            $q = $dbal->prepare($query);
            $q->bindParam(':id', $id);
            $q->execute();
            if(!$client = $q->fetch(PDO::FETCH_ASSOC))
            {
                throw new Exception('No client found', 404);
            }

            if($column == 'todo')
            {
                $orderBy = 'todo_order ASC';
            }
            else
            {
                $orderBy = 'global_order ASC';
            }



            $this->entries = $dbal->simpleSelect(
                'items',
                array(
                    'id',
                    'name',
                    'description',
                    'fixedrate',
                    'hourlyrate',
                    'hourlyrates',
                    'dailyrate',
                    'dailyrates',
                    'userate',
                    'offer',
                    'contract',
                    'todo',
                    'acceptance',
                    'invoice',
                    'todo_done',
                    'todo_order',
                    'global_order'
                ),
                array($column, $id),
                0,
                $orderBy
            );

            /* The & creates a reference, so we can edit the entry! */
            foreach($this->entries as &$entry)
            {
                /*
                 * use hourly rate
                 */
                if($entry['userate'] == 1)
                {
                    /* check hourlyrates */
                    if(!isset($entry['hourlyrates']) || $entry['hourlyrates'] == '')
                    {
                        $entry['hourlyrates'] = 0;
                    }
                    /* get hourlyrate - from item, client or config */
                    if(isset($entry['hourlyrate']) && $entry['hourlyrate'] != '' && $entry['hourlyrate'] != 0)
                    {
                        $hourlyrate = $entry['hourlyrate'];
                    }
                    else if(isset($client['hourlyrate']) && $client['hourlyrate'] != '' && $client['hourlyrate'] != 0)
                    {
                        $hourlyrate = $client['hourlyrate'];
                    }
                    else
                    {
                        $hourlyrate = $conf->get['pricing']['hourlyrate'];
                    }

                    /* set total value */
                    $entry['total'] = $entry['hourlyrates'] * $hourlyrate;

                }
                /*
                 * use daily rate
                 */
                else if($entry['usertate'] == 2)
                {
                    /* check hourlyrates */
                    if(!isset($entry['dailyrates']) || $entry['dailyrates'] == '')
                    {
                        $entry['dailyrates'] = 0;
                    }
                    /* get hourlyrate - from item, client or config */
                    if(isset($entry['dailyrate']) && $entry['dailyrate'] != '' && $entry['dailyrate'] != 0)
                    {
                        $dailyrate = $entry['dailyrate'];
                    }
                    else if(isset($client['dailyrate']) && $client['dailyrate'] != '' && $client['dailyrate'] != 0)
                    {
                        $dailyrate = $client['dailyrate'];
                    }
                    else
                    {
                        $dailyrate = $conf->get['pricing']['dailyrate'];
                    }

                    /* set total value */
                    $entry['total'] = $entry['dailyates'] * $dailyrate;

                }
                /*
                 * use fixed rate
                 */
                else
                {
                    if(!isset($entry['fixedrate']) || $entry['fixedrate'] == '' )
                    {
                        $entry['fixedrate'] = 0;
                    }
                    $entry['total'] = $entry['fixedrate'];
                }

                $this->total = $this->total + $entry['total'];

            }
        }
        else
        {
            throw new Exception('"'.$column.'" is no possible value as "for"', 400);
        }
    }

}