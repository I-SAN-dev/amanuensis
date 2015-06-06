<?php
/**
 * Updates a list of item, so they can be connected to a new thing at once
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


class bulk {

    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        Authenticator::onlyFor(0,1);


        if(isset($_POST["ids"]) && $_POST["ids"]!='' && isset($_POST["for"]) && $_POST["for"]!='' && isset($_POST["forid"]) && $_POST["forid"]!='')
        {
            self::bulkUpdate($_POST["ids"], $_POST["for"], $_POST["forid"]);
        }
        else if (isset($_POST["setorder"]) && $_POST["setorder"] != '' && isset($_POST["order"]) && $_POST["order"] != '')
        {
            self::bulkOrder($_POST["setorder"], $_POST["order"]);
        }
        else
        {
            $error = new amaException(NULL, 400, "Not all needed parameters specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

    /**
     * Associates items in a given list with a given thing
     * @param string $ids - comma separated list of ids that shall be updated
     * @param string $for - the type of the thing they shall be conencted with
     * @param int $forid - the id of the thing
     */
    static function bulkUpdate($ids, $for, $forid)
    {
        if(!in_array($for, array('offer','contract','todo','acceptance','invoice')))
        {
            $error = new amaException(NULL, 400, "Invalid parameter for");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        $dbal = DBAL::getInstance();

        $idarray = explode(',', $ids);

        $query = "
            UPDATE items SET ".$for." = ?
            WHERE ".$for." IS NULL AND id IN (".str_repeat('?,', count($idarray) - 1)."?)
        ";

        $q = $dbal->prepare($query);
        array_unshift($idarray, $forid);
        $q->execute($idarray);

        json_response(array('items_linked' => $q->rowCount()));
    }

    /**
     * Sets the global_order or todo_order for multiple items
     * @param String $setorder - 'global' or 'todo'
     * @param $order - a string, containing item-ids and their new order, format: 'id:ordering,id:ordering,...'
     */
    static function bulkOrder($setorder, $order)
    {
        if(in_array($setorder, array('global','todo')))
        {
            $toUpdate = explode(',',$order);

            $query = '
                UPDATE items SET '.$setorder.'_order = ? WHERE id = ?;
            ';

            $dbal = DBAL::getInstance();
            $q = $dbal->prepare($query);

            foreach($toUpdate as $update)
            {
                $a = explode(':', $update);
                if(count($a) == 2 && ctype_digit((String)$a[0]) && ctype_digit((String)$a[1]))
                {
                    try
                    {
                        $q->execute(array($a[1], $a[0]));
                    }
                    catch(Exception $e)
                    {
                        /* log the error, but don't die... the rest of the loop may be successful */
                        $error = new amaException($e);
                        $error->renderJSONerror();
                        $error->setHeaders(true);
                    }
                }
                else
                {
                    $error = new amaException(NULL, 400, "Wrong format in order: '".$update."' is invalid");
                    $error->renderJSONerror();
                    $error->setHeaders(true);
                }
            }
            json_response(array('success' => true));
        }
        else
        {
            $error = new amaException(NULL, 400, "Invalid parameter setorder");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}