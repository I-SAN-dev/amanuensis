<?php
/**
 * Database Abstraction Layer, uses PDO, implements Singleton pattern (we only want ONE DB connection)
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

            $this->connection = new PDO(
                "mysql:host=".$dbhost.";port=".$dbport.";dbname=".$dbname."",
                $conf->get["db"]["user"],
                $conf->get["db"]["password"],
                array(
                    PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, sql_mode="STRICT_ALL_TABLES"'
                )
            );
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

    /**
     * Takes a tablename, a list of column names to be inserted and and array of data containing the data that should be inserted
     * @param string $table - the name of the table to insert into,
     * @param array $columns - the column names that should be inserted
     * @param array $data - an array that holds the data that should be inserted
     * @return int - the id of the inserted row
     */
    public function dynamicInsert($table, array $columns, array $data)
    {
        /* Check if is set */
        $realcolumns = array();
        foreach($columns as $column)
        {
            if(isset($data[$column]) && $data[$column] != '')
            {
                array_push($realcolumns, $column);
            }
        }

        if(count($realcolumns))
        {
            /* Build query */
            $query = "  INSERT INTO ".$table." (".implode(',',$realcolumns).")
                        VALUES (".implode(',', array_map(function($x){return ':'.$x;},$realcolumns)).")";

            $q = $this->prepare($query);

            /* Bind data */
            foreach($realcolumns as $column)
            {
                $q->bindParam(':'.$column, $data[$column]);
            }

            $q->execute();

            return $this->connection->lastInsertId();

        }
        else
        {
            $error = new amaException(NULL, 400, 'Not a single usable param was sent!');
            $error->renderJSONerror();
            $error->setHeaders();
        }


    }


    /**
     * Takes a tablename, a list of column names to be inserted and and array of data containing the data that should be inserted
     * @param string $table - the name of the table to insert into,
     * @param array $where - column:value for the where clause
     * @param array $columns - the column names that should be inserted
     * @param array $data - an array that holds the data that should be inserted
     * @return int - the id of the inserted row
     */
    public function dynamicUpdate($table, array $where, array $columns, array $data)
    {
        /* Check if is set */
        $realcolumns = array();
        foreach($columns as $column)
        {
            if(isset($data[$column]))
            {
                array_push($realcolumns, $column);
            }
        }

        if(count($realcolumns))
        {
            /* Build query */
            $query = "  UPDATE ".$table."
                        SET ".implode(',', array_map(function($x){return $x.' = :'.$x;},$realcolumns))."
                        WHERE ".$where[0]." = :".$where[0];


            $q = $this->prepare($query);

            /* Bind data */
            foreach($realcolumns as $column)
            {
                $q->bindParam(':'.$column, $data[$column]);
            }
            /* Bind where statement */
            $q->bindParam(':'.$where[0], $where[1]);

            $q->execute();

            /* return the id of the updated row */
            if($where[0]=='id')
            {
                return $where[1];
            }
            else
            {
                $idarray = $this->simpleSelect($table, array('id'), $where, 1);
                return $idarray['id'];
            }
        }
        else
        {
            $error = new amaException(NULL, 400, 'Not a single usable param was sent!');
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

    /**
     * Takes a tablename and a where representation that should be deleted
     * @param string $table - the name of the table to insert into,
     * @param array $where - column:value for the where clause
     * @param boolean $cascade - whether or not the delete shall cascade
     * @throws Exception
     * @return int rowCount - the number of rows deleted
     */
    public function deleteRow($table, array $where, $cascade = false)
    {
        if(!isset($where) || !isset($where[0]) || !isset($where[1]))
        {
            throw new Exception('Unusable where statement', 400);
        }
        else
        {
            $query = " DELETE FROM ".$table."
                       WHERE ".$where[0]." = :".$where[0];

            $q = $this->prepare($query);

            /* Bind where statement */
            $q->bindParam(':'.$where[0], $where[1]);

            $q->execute();

            return $q->rowCount();
        }
    }


    /**
     * Takes a tablename and a where representation and a set of columnnames and performs a simple SELECT
     * @param string $table - the name of the table to insert into,
     * @param array $columns - the columns to be responded
     * @param array $where - column:value for the where clause
     * @param int $limit - limits the select to X, 0 = no limit
     * @param string $orderBy - an optional order by statement
     * @throws Exception
     * @return array - (2-dimensional)
     */
    public function simpleSelect($table, array $columns, array $where = NULL, $limit = 0, $orderBy = NULL)
    {
        if(isset($where) && ( !isset($where[0]) || !isset($where[1])))
        {
            throw new Exception('Unusable where statement', 400);
        }
        else
        {
            $query = "  SELECT ".implode(',',$columns)."
                        FROM ".$table;

            /* add where statement */
            if(isset($where))
            {
                $query = $query." WHERE ".$where[0]." = :".$where[0];
            }

            /* add orderBy statement */
            if(isset($orderBy))
            {
                $query = $query. " ORDER BY ".$orderBy;
            }

            /* add limit statement */
            if($limit > 0)
            {
                $query = $query." LIMIT ".$limit;
            }
            $q = $this->prepare($query);

            if(isset($where))
            {
                /* Bind where statement */
                $q->bindParam(':'.$where[0], $where[1]);
            }



            $q->execute();

            /* creating the result array */
            $result = array();

            /* object for limited = 1 result, array of objects for set of results */
            if($limit == 1)
            {
                if($entry = $q->fetch())
                {
                    foreach($columns as $column)
                    {
                        $result[$column] = $entry[$column];
                    }
                }
                else
                {
                    $result = NULL;
                }

            }
            else
            {
                while ($entry = $q->fetch())
                {
                    $row = array();
                    foreach($columns as $column)
                    {
                        $row[$column] = $entry[$column];
                    }
                    array_push($result, $row);
                }
            }
            return $result;
        }
    }


}