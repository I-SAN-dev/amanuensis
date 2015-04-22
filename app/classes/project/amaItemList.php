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

    public function __construct($column, $id)
    {
        if(in_array($column, array('offer', 'contract', 'todo', 'acceptance', 'invoice')))
        {
            if($column == 'todo')
            {
                $orderBy = 'todo_order ASC';
            }
            else
            {
                $orderBy = 'global_order ASC';
            }


            $dbal = DBAL::getInstance();
            $this->entries = $dbal->simpleSelect(
                'items',
                array(
                    'id',
                    'name',
                    'description',
                    'fixedrate',
                    'hourlyrates',
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
        }
        else
        {
            $error = new amaException(NULL, 400, '"'.$column.'" is no possible value as "for"');
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}