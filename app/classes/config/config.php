<?php
/**
 * Loads the config json and grants access to it.
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

require_once 'classes/scripthandling/scriptLoader.php';
require_once 'classes/errorhandling/amaException.php';

final class Config {

    protected static $instance;
    private static $filename = 'classes/config/config.json';

    /**
     * Will return the instance of the config
     * @return Config - a config object
     */
    public static function getInstance()
    {
        if(self::$instance == NULL)
        {
            self::$instance = new Config();
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
            $errorjson = '{ "code": 500, "message": "Error reading config file: '.$e->getMessage().'" }';
            echo "<script>pageErrors.push(JSON.parse('".$errorjson."'))</script>";

            return array();
        }
    }

    /**
     * Saves the current config back to the file
     */
    public function save()
    {
        try
        {
            /* If JSON PRETTY PRINT is available, use it (PHP 5.4+) */
            if(defined('JSON_PRETTY_PRINT')&&(version_compare(PHP_VERSION, '5.4', '>=')))
            {
                $jsonstring = json_encode($this->get, JSON_PRETTY_PRINT);
            }
            else
            {
                $jsonstring = json_encode($this->get);
            }

            if(!file_put_contents(self::$filename, $jsonstring, LOCK_EX))
            {
                throw new Exception("Error writing config: ".self::$filename);
            }

            /* Rerender the .jst-Templates with updated values */
            ScriptLoader::renderScriptsByTemplate();
        }
        catch(Exception $e)
        {
            $error = new amaException($e, 500);
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

    /**
     * Gets either the secure url if set
     * otherwise the base url or the request url.
     * This is needed for popups and previews (->Stuff that requires login but is not loaded via API)
     * @param boolean $includeSecure - default true - if the secure url shall be used if set
     * @return String - the url
     */
    public function getUrl($includeSecure = true)
    {

        if($includeSecure && isset($this->get['secureurl']) && $this->get['secureurl'] != '')
        {
            return $this->get['secureurl'].'/';
        }
        if(isset($this->get['baseurl']) && $this->get['baseurl'] != '')
        {
            return $this->get['baseurl'].'/';
        }
        $protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"],0,5))=='https'? 'https://' : 'http://';
        return $protocol.$_SERVER['HTTP_HOST'].'/';
    }
}