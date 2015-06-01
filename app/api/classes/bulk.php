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

        if( !isset($_POST["ids"]) || $_POST["ids"]=='' || !isset($_POST["for"]) || $_POST["for"]=='' || !isset($_POST["forid"]) || $_POST["forid"]=='')
        {
            $error = new amaException(NULL, 400, "Not all needed parameters specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        else
        {
            self::bulkUpdate($_POST["ids"], $_POST["for"], $_POST["forid"]);
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

}