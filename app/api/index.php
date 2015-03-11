<?php
/**
 * This is the entry point for all api calls
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

chdir('..');
set_include_path(getcwd());

require_once 'classes/config/config.php';
require_once 'classes/errorhandling/amaException.php';

/* Enable output buffer */
ob_start();

/*
 *  Check the request method
 */
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && $method !== 'POST')
{
    $error = new amaException(NULL, 405, "Request Method '".$method."' not allowed! (only GET and POST)");
    $error->setHeaders();
    $error->renderJSONerror();
    die();
}

/*
 * Decode JSON Post requests
 */
if($method == 'POST')
{
    if($_SERVER["CONTENT_TYPE"] == "application/json;charset=utf-8" || $_SERVER["CONTENT_TYPE"] == "application/json")
    {
        $_POST = json_decode(file_get_contents('php://input'), true);
    }
}

/*
 *  Get the action
 */
if($method === 'GET' && isset($_GET['action']))
{
    $action = $_GET['action'];
}
else if ($method === 'POST' && isset($_POST['action']))
{
    $action = $_POST['action'];
}
else
{
    $error = new amaException(NULL, 400, "Action not defined");
    $error->setHeaders();
    $error->renderJSONerror();
    die();
}

/*
 * Sanitize the Action
 */
if (!preg_match("/^[_a-zA-Z][_a-zA-Z0-9]*$/", $action))
{
    $error = new amaException(NULL, 400, "Invalid action");
    $error->setHeaders();
    $error->renderJSONerror();
    die();
}


/*
 *  Check if a class for this action is existent, then include it
 */
$includefile = 'api/classes/'.$action.'.php';
if(!file_exists($includefile))
{
    $error = new amaException(NULL, 400, "Unsupported action");
    $error->setHeaders();
    $error->renderJSONerror();
    die();
}
$thisisamanu = true;
require_once($includefile);

/*
 * Define a method that can be used to output JSON
 */
/**
 * Echoes a given array as JSON
 */
function json_response($array)
{
    header('Content-Type: application/json');
    /* If JSON PRETTY PRINT is available, use it (PHP 5.4+) */
    if(defined('JSON_PRETTY_PRINT')&&(version_compare(PHP_VERSION, '5.4', '>=')))
    {
        echo json_encode($array, JSON_PRETTY_PRINT);
    }
    else
    {
        echo json_encode($array);
    }
}

/*
 * Call the appropriate method
 */
$callarray = array($action, strtolower($method));
if(is_callable($callarray))
{
    try
    {
        call_user_func($callarray);
    }
    catch (Exception $e)
    {
        $conf = Config::getInstance();
        if($conf->get["debug"])
        {
            $error = new amaException($e);
        }
        else
        {
            $error = new amaException(NULL, 500, "An error occurred");
        }
        $error->setHeaders();
        $error->renderJSONerror();
        die();
    }
}
else
{
    $error = new amaException(NULL, 405, "Request Method '".$method."' not allowed for action '".$action."'!");
    $error->setHeaders();
    $error->renderJSONerror();
    die();
}





/* End output buffering */
ob_end_flush();



