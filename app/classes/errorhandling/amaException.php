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
    public function __construct(Exception $e = NULL, $code = NULL, $message = NULL)
    {
        $this->errormessage = '';
        $this->errorcode = '';
        $this->file = '';
        $this->line = '';

        /* Get values from the exception */
        if($e != NULL)
        {
            $this->errormessage = $e->getMessage();
            $this->errorcode = $e->getCode();
            $this->file = $e->getCode();
            $this->line = $e->getLine();
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
        $obj = array("error" => $this->getData());
        echo json_encode($obj);
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
        $error = array(
            "code" => $this->errorcode,
            "message" => $this->errormessage
        );
        if(Config::getInstance()->get['debug'])
        {
            $error["file"] = $this->file;
            $error["line"] = $this->line;
        }
        return $error;
    }

    /**
     * Sets HTTP error headers
     */
    public function setHeaders()
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
        else
        {
            header($_SERVER["SERVER_PROTOCOL"]." 500 Internal Server Error", true, 500);
        }



    }


}