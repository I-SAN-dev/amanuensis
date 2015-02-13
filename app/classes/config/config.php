<?php
/**
 * Loads the config ini and grants access to it.
 * Implements the singleton pattern (h8ters gonna h8..),
 * but therefore we ensure that the config file is only loaded ONCE
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

final class Config {

    protected static $instance;
    private static $filename = 'classes/config/config.json';

    /**
     * Will return the instance of the config
     * @return Config - a config object
     */
    public static function getInstance()
    {
        if(self::$instance == null)
        {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Manage proper cloning
     * @return Config - a config instance
     */
    private function __clone(){
        return self::getInstance();
    }

    /**
     * Constructor will read and parse the config file
     */
    private function __construct()
    {
        $this->get = $this->readConfigFile();
    }


    /**
     * Reads the config .json file and returns an array
     * @return array - an array with config data
     */
    private function readConfigFile()
    {
        try
        {
            if(!file_exists(self::$filename))
            {
                throw new Exception('File '.self::$filename.' does not exist');
            }
            $file = file_get_contents(self::$filename);
            return json_decode($file, true);
        }
        catch(Exception $e)
        {
            echo "Error reading config file:\n".$e->getMessage();
            die();
        }
    }

    /**
     * Saves the current config back to the file
     * @return boolean - true for success/false for failure
     */
    public function save()
    {
        try
        {
            $jsonstring = json_encode($this->get);
            if(!file_put_contents(self::$filename, $jsonstring, LOCK_EX))
            {
                throw new Exception("Error writing config: ".self::$filename);
            }
            return true;
        }
        catch(Exception $e)
        {
            if($this->get['debug']==1)
            {
                echo "\n".$e->getMessage()."\n";
            }
            return false;
        }
    }
}