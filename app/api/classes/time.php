<?php
/**
 * Handles the Item times
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
require_once('classes/authentication/user.php');


class time {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getTime($_GET["id"]);
        }
        else if(isset($_GET["forid"]) && $_GET["forid"] != '')
        {
            self::getTimeFor($_GET["forid"]);
        }
        else
        {
            self::getTimeList();
        }
    }


    /**
     * This methods reacts to POST Requests
     */
    public static function post()
    {
        Authenticator::onlyFor(0);

        if( !isset($_POST["id"]) || $_POST["id"]=='')
        {
            self::createTime();
        }
        else
        {
            self::modifyTime();
        }
    }

    /**
     * This methods reacts to DELETE Requests
     */
    public static function delete($_DELETE)
    {
        Authenticator::onlyFor(0);

        if(!isset($_DELETE["id"]) || $_DELETE["id"]=='')
        {
            $error = new amaException(NULL, 400, "No id specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        else
        {
            self::deleteTime($_DELETE);
        }
    }

    /**
     * Gets a list of all Times
     */
    private static function getTimeList()
    {
        $dbal = DBAL::getInstance();

        $q = $dbal->prepare('
            SELECT time.id, time.item, time.start, time.end, time.user, users.email AS useremail, users.username
            FROM time LEFT JOIN users ON time.user = users.id ORDER BY time.start ASC
        ');
        $q->execute();
        $result = $q->fetchAll(PDO::FETCH_ASSOC);

        json_response($result);
    }

    /**
     * Gets a list of all Times for a specific item
     * @param $id - the id of the item
     */
    private static function getTimeFor($id)
    {
        $dbal = DBAL::getInstance();

        $q = $dbal->prepare('
            SELECT time.id, time.item, time.start, time.end, time.user, users.email AS useremail, users.username
            FROM time LEFT JOIN users ON time.user = users.id
            WHERE time.item = :id ORDER BY time.start ASC
        ');
        $q->bindParam(':id', $id);
        $q->execute();
        $result = $q->fetchAll(PDO::FETCH_ASSOC);

        /* calc total time */
        $totaltime = 0;

        foreach($result as $time)
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

        json_response(array(
            "times" => $result,
            "totaltime" => round($totaltime, 2)
        ));
    }

    /**
     * Gets a single Time
     * @param $id - the id of the Time to get
     */
    private static function getTime($id)
    {
        $dbal = DBAL::getInstance();

        $q = $dbal->prepare('
            SELECT time.id, time.item, time.start, time.end, time.user, users.email AS useremail, users.username
            FROM time LEFT JOIN users ON time.user = users.id
            WHERE time.id = :id
            LIMIT 1
        ');
        $q->bindParam(':id', $id);
        $q->execute();
        if($result = $q->fetch(PDO::FETCH_ASSOC))
        {
            json_response($result);
        }
        else
        {
            $error = new amaException(NULL, 404, "Time with id ".$id." not found");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

    /**
     * creates a new Time
     */
    private static function createTime()
    {
        $dbal = DBAL::getInstance();

        /* Add current logged in user */
        $user = Authenticator::getUser();
        $_POST['user'] = $user->id;

        /* use current time if not specifically set */
        if(!isset($_POST["start"]) || $_POST["start"] == '')
        {
            $_POST["start"] = date("Y-m-d H:i:s");
        }

        $id = $dbal->dynamicInsert(
            'time',
            array(
                'user',
                'start',
                'end',
                'item'
            ),
            $_POST
        );
        self::getTime($id);
    }

    /**
     * modifies a Time
     */
    private static function modifyTime()
    {
        $dbal = DBAL::getInstance();

        /* end now if endnow is set */
        if(isset($_POST["endnow"])  && $_POST["endnow"] != '')
        {
            $_POST["end"] = date("Y-m-d H:i:s");
        }

        $affectedid = $dbal->dynamicUpdate(
            'time',
            array('id', $_POST["id"]),
            array(
                'start',
                'end'
            ),
            $_POST);
        self::getTime($affectedid);
    }

    /**
     * deletes a Time
     * @param $_DELETE
     */
    private static function deleteTime($_DELETE, $forid = NULL)
    {
        $dbal = DBAL::getInstance();
        try
        {
            $count = $dbal->deleteRow('time', array('id', $_DELETE['id']));
        }
        catch(Exception $e)
        {
            $error = new amaException($e);
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }

        if($count)
        {
            if(isset($forid))
            {
                self::getTimeFor($forid);
            }
            else
            {
                self::getTimeList();
            }
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no Time matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}