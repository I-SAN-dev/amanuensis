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
require_once('classes/project/amaItem.php');

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

            $this->costs = array('total' => 0.00);

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
                $e = new AmaItem(NULL, $entry);
                $entry = $e->get();

                $this->costs['total'] = $this->costs['total'] + $entry['total'];
            }

            /* Calculate the tax */
            if($conf->get['pricing']['calc_tax'] && $conf->get['pricing']['tax'] != '' && $conf->get['pricing']['tax'] > 0 )
            {
                $taxrate = 1 + $conf->get['pricing']['tax']/100;
                $beforetax = floor($this->costs['total'] * 100 / $taxrate) / 100; // We round the tax up to please the state

                $this->costs['beforetax'] = $beforetax;
                $this->costs['tax'] = $this->costs['total'] - $this->costs['beforetax'];
                $this->costs['taxlabel'] = $conf->get['pricing']['tax'].'% '.$conf->get['pricing']['tax_label'];
            }
        }
        else
        {
            throw new Exception('"'.$column.'" is no possible value as "for"', 400);
        }
    }

}