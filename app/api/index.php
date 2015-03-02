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
 * Call the appropriate method
 */
$callarray = array($action, strtolower($method));
call_user_func($callarray);




/* End output buffering */
ob_end_flush();
