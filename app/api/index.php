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

/* Enable CORS if a secureurl is set  */
$conf = Config::getInstance();
if(isset($conf->get['secureurl']) && $conf->get['secureurl'] != '')
{
    header("Access-Control-Allow-Origin: ".$conf->get['baseurl']);
    /* Firefox needs this! */
    header("Vary: Origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 86400");
header("Access-Control-Allow-Headers: X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");


/* Enable output buffer */
ob_start();

/**
 * This function catches all uncaught Exceptions!
 * @param Exception $e
 */
function catchAll($e)
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
    $error->renderJSONerror();
    $error->setHeaders();
    die();
}
set_exception_handler('catchAll');

/*
 *  Check the request method
 */
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'OPTIONS')
{
    header($_SERVER["SERVER_PROTOCOL"]." 200 Ok", true, 200);
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Allow: GET, POST, DELETE, OPTIONS");
    header("Content-Type: application/json");
    ob_end_flush();
    die();
}

if ($method != 'GET' && $method != 'POST' && $method != 'DELETE')
{
    $error = new amaException(NULL, 405, "Request Method '".$method."' not allowed! (only GET and POST and DELETE)");
    $error->renderJSONerror();
    $error->setHeaders();
    die();
}

/*
 * Decode JSON Post requests
 */
if($method == 'POST')
{
    if($_SERVER["CONTENT_TYPE"] == "application/json;charset=utf-8" || $_SERVER["CONTENT_TYPE"] == "application/json" || !isset($_POST['action']))
    {
        $_POST = json_decode(file_get_contents('php://input'), true);
    }
}

/*
 * Process DELETE requests
 */
if($method == 'DELETE')
{
    $_DELETE = json_decode(file_get_contents('php://input'), true);
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
else if ($method === 'DELETE' && isset($_DELETE['action']))
{
    $action = $_DELETE['action'];
}
/* neded for combined get/post requests when file uploading */
else if($method === 'POST' && isset($_GET["uploadfor"]))
{
    $action = 'fileContract';
}
else
{
    $error = new amaException(NULL, 400, "Action not defined");
    $error->renderJSONerror();
    $error->setHeaders();
    die();
}

/*
 * Sanitize the Action
 */
if (!preg_match("/^[_a-zA-Z][_a-zA-Z0-9]*$/", $action))
{
    $error = new amaException(NULL, 400, "Invalid action");
    $error->renderJSONerror();
    $error->setHeaders();
    die();
}


/*
 *  Check if a class for this action is existent, then include it
 */
$includefile = 'api/classes/'.$action.'.php';
if(!file_exists($includefile))
{
    $error = new amaException(NULL, 400, "Unsupported action");
    $error->renderJSONerror();
    $error->setHeaders();
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
/*
 * add some parameters for the DELETE action (because $_DELETE is not global)
 */
$arguments = array();
if($method == 'DELETE')
{
    array_push($arguments, $_DELETE);
}


if(is_callable($callarray))
{
    try
    {
        //call_user_func($callarray);
        call_user_func_array($callarray, $arguments);
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
        $error->renderJSONerror();
        $error->setHeaders();
        die();
    }
}
else
{
    $error = new amaException(NULL, 405, "Request Method '".$method."' not allowed for action '".$action."'!");
    $error->renderJSONerror();
    $error->setHeaders();
    die();
}





/* End output buffering */
ob_end_flush();



