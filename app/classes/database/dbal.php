<?php
/**
 * Database Abstraction Layer, uses PDO, implements Singleton pattern (we only want ONE DB conenction)
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

require_once('classes/config/config.php');
require_once('classes/errorhandling/amaException.php');

final class DBAL {

    protected static $instance;

    /**
     * Will return the instance of the DBAL
     * @return DBAL- a DBAL object
     */
    public static function getInstance()
    {
        if(self::$instance == NULL)
        {
            self::$instance = new DBAL();
        }
        return self::$instance;
    }

    /**
     * Manage proper cloning
     * @return DBAL - a DBAL instance
     */

    private function __clone(){
        return self::getInstance();
    }

    /**
     * Constructor will create the Database connection
     */
    private function __construct()
    {
        try
        {
            $conf = Config::getInstance();

            $dbhost = $conf->get["db"]["host"];
            $dbport = $conf->get["db"]["port"];
            $dbname = $conf->get["db"]["database"];

            $this->connection = new PDO("mysql:host=".$dbhost.";port=".$dbport.";dbname=".$dbname."", $conf->get["db"]["user"], $conf->get["db"]["password"]);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(Exception $e)
        {
            $error = new amaException($e);
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }
    }

    /**
     * Returns a PDO prepared statement
     * @param String $query - the query to be prepared
     * @return PDOstatement
     */
    public function prepare($query)
    {
        return $this->connection->prepare($query);
    }


}