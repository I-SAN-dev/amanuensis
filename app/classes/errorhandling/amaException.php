<?php
/**
 * This error takes an Exception and processes it, allows JSON exception output
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

require_once 'classes/config/config.php';

class amaException {


    /**
     * When the Error is constructed, it will process the exception
     * @param Exception $e - an Exception that shall be processed, optional if $message and $code are given
     * @param int $code - an error code, can override the one from the exception
     * @param string $message - an Error Message, can override the one from the exception
     */
    public function __construct(Exception $e = NULL, $code = NULL, $message = NULL, $languagestring = NULL)
    {
        $this->errormessage = '';
        $this->errorcode = '';
        $this->file = '';
        $this->line = '';
        $this->languagestring = '';
        $this->trace = '';

        /* Get values from the exception */
        if($e != NULL)
        {
            $this->errormessage = $e->getMessage();
            $this->errorcode = $e->getCode();
            $this->file = $e->getFile();
            $this->line = $e->getLine();
            $this->trace = $e->getTraceAsString();
        }

        /* Override the Errorcode */
        if($code != NULL)
        {
            $this->errorcode = $code;
        }


        /* Override the Errormessage */
        if($message != NULL)
        {
            $this->errormessage = $message;
        }

        /* Override the languagestring */
        if($languagestring != NULL)
        {
            $this->languagestring = $languagestring;
        }


        /* Logging */
        $conf = Config::getInstance();
        if($conf->get['errorlogging'])
        {
            $logentry = array(
                'timestamp' => time(),
                'time' => date('d.m.Y - H:i:s'),
                'code' => $this->errorcode,
                'message' => $this->errormessage,
                'file' => $this->file,
                'line' => $this->line
            );

            $logfile = $conf->get['errorlogpath'];
            if(!file_exists($logfile))
            {
                file_put_contents($logfile, "timestamp,time,code,message,file,line\n");
            }
            file_put_contents($logfile, implode(',', $logentry)."\n", FILE_APPEND);
        }
    }

    /**
     * Renders the Errordata in a script tag for index.php output
     */
    public function renderScripttag()
    {
        echo "<script>pageErrors.push(JSON.parse('".$this->getJSON()."'))</script>";
    }

    /**
     * Renders an API Response with the error
     * @return string - a json object containing an error
     */
    public function renderJSONerror()
    {
        header('Content-Type: application/json');
        $obj = array("error" => $this->getData());
        /* If JSON PRETTY PRINT is available, use it (PHP 5.4+) */
        if(defined('JSON_PRETTY_PRINT')&&(version_compare(PHP_VERSION, '5.4', '>=')))
        {
            echo json_encode($obj, JSON_PRETTY_PRINT);
        }
        else
        {
            echo json_encode($obj);
        }

    }

    /**
     * Gets the json enocdet data of the error
     * @return string - JSON representation of the error
     */
    public function getJSON()
    {
        return json_encode($this->getData());
    }


    /**
     * Gets an array containing the data
     * @return array - the object representationg the error
     */
    private function getData()
    {
        $debug = Config::getInstance()->get['debug'];
        $error = array(
            "code" => $this->errorcode,
            "message" => $this->errormessage,
            "languagestring" => $this->languagestring
        );
        if($debug)
        {
            $error["file"] = $this->file;
            $error["line"] = $this->line;
            $error["trace"] = $this->trace;
        }
        /* echo only supported types, so the frontend can display it nicely */
        if(!in_array($error['code'], array(401,403,404,400,405,500)))
        {
            $error['code'] = 500;
            if(!$debug)
            {
                $error['message'] = "An error occured";
            }
        }

        return $error;
    }

    /**
     * Sets HTTP error headers
     * @param boolean $dontdie - most of the time we want to finish after an error. If we don't, pass true
     */
    public function setHeaders($dontdie = false)
    {
        /* Only allow HTTP statuscodes, alternatively 500 */
        $c = $this->errorcode;

        if($c == 401)
        {
            header($_SERVER["SERVER_PROTOCOL"]." 401 Unauthorized", true, 401);
        }
        else if($c == 403)
        {
            header($_SERVER["SERVER_PROTOCOL"]." 403 Forbidden", true, 403);
        }
        else if($c == 404)
        {
            header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
        }
        else if($c == 400)
        {
            header($_SERVER["SERVER_PROTOCOL"]." 400 Bad Request", true, 400);
        }
        else if($c == 405)
        {
            header($_SERVER["SERVER_PROTOCOL"]." 405 Method Not Allowed", true, 405);
        }
        else
        {
            header($_SERVER["SERVER_PROTOCOL"]." 500 Internal Server Error", true, 500);
        }

        if(!$dontdie)
        {
            die();
        }

    }


}