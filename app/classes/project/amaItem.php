<?php
/**
 * Gets data of an item with a given id and/or does some nice item calculationr egarding price and time, if data is alreaddy present
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

class AmaItem {

    /**
     * @param mixed $id - the id of the item to get, if NULL, an $entry must be given
     * @param mixed $entry - optional, if no $id is passed, an entry can be passed directly
     * @throws Exception
     */
    public function __construct($id = NULL, $entry = NULL)
    {
        /* check $entry validity */
        if(
            isset($entry)
            && is_array($entry)
            && isset($entry['id'])
            && isset($entry['userate'])
            && isset($entry['name'])
            && (
                isset($entry['offer'])
                || isset($entry['contract'])
                || isset($entry['todo'])
                || isset($entry['acceptance'])
                || isset($entry['invoice'])
            )
        )
        {
            $this->entry = $entry;
        }
        /* If $entry is crap, check if we can get nice data from the db */
        else if (isset($id))
        {
            $dbal = DBAL::getInstance();
            $this->entry = $dbal->simpleSelect(
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
                array('id', $id),
                1
            );

            if(!$this->entry)
            {
                throw new Exception('No item found with id '.$id , 404);
            }
        }
        else
        {
            throw new Exception('No usable Data given', 500);
        }

        $this->entry = $this->calcPrizes($this->entry);
        $this->entry['used_time'] = $this->calcTimeFor($this->entry['id']);
    }

    /**
     * @param $entry - the array representing the item entry
     * @return array updated $entry
     */
    private function calcPrizes($entry)
    {
        $conf = Config::getInstance();

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
        else if($entry['userate'] == 2)
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
            $entry['total'] = $entry['dailyrates'] * $dailyrate;

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

        return $entry;
    }

    /**
     * Calculates the complete time spent on the item
     * @param $id - the id of the entry
     * @return float decimal time
     */
    private function calcTimeFor($id)
    {
        /* Fetch all times */
        $dbal = DBAL::getInstance();
        $times = $dbal->simpleSelect(
            'time',
            array(
                'start',
                'end'
            ),
            array('item', $id)
        );

        /* calc total time */
        $totaltime = 0;

        foreach($times as $time)
        {
            if(
                isset($time['start']) && $time['start'] != ''
                && isset($time['end']) && $time['end'] != ''
            )
            {
                $start = StrToTime($time['start']);
                $end = StrToTime($time['end']);
                $intervallInSeconds = $end - $start;
                $totaltime = $totaltime + $intervallInSeconds;
            }
        }

        /* convert totaltime to hours */
        $totaltime = $totaltime / 3600;

        /* Format to 2 decimals */
        return round($totaltime, 2);
    }

    /**
     * Returns the associative array representing the updated item
     * @return array
     */
    public function get()
    {
        return $this->entry;
    }

}