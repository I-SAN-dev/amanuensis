<?php
/**
 * This file will install amanu on your server
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 *
 * Inspired & based on the ownCloud Setup Wizard
 * @author Frank Karlitschek
 * @copyright 2012 Frank Karlitschek frank@owncloud.org
 * @author Lukas Reschke
 * @copyright 2013-2015 Lukas Reschke lukas@owncloud.com
 * @license AGPL
 *
 * Thank you very much!
 *
 *
 */


// init
ob_start();
@set_time_limit(0);
ini_set('display_errors', 1);

/**
 * Setup class with a few helper functions
 */
class AmanuSetup {

    private static $reqs = array(
            'classes' => array(
                'ZipArchive' => 'zip',
                'DOMDocument' => 'dom',
            ),
            'functions' => array(
                'json_encode' => 'JSON',
                'gd_info' => 'GD',
                'gzencode' => 'zlib',
                'hash' => 'HASH Message Digest Framework',
                'curl_init' => 'curl',
            ),
            'defined' => array(
                'PDO::ATTR_DRIVER_NAME' => 'PDO'
            )
    );


    /**
     * Checks requirements
     * @return string with error messages
     */
    static public function checkDependencies() {
        $error = '';
        $missingDependencies = array();

        // do we have PHP 5.4.0 or newer?
        if(version_compare(PHP_VERSION, '5.4.0', '<')) {
            $error.='PHP 5.4.0 is required. Please ask your server administrator to update PHP to version 5.4.0 or higher.<br/>';
        }

        foreach (self::$reqs['classes'] as $class => $module) {
            if (!class_exists($class)) {
                $missingDependencies[] = array($module);
            }
        }
        foreach (self::$reqs['functions'] as $function => $module) {
            if (!function_exists($function)) {
                $missingDependencies[] = array($module);
            }
        }
        foreach (self::$reqs['defined'] as $defined => $module) {
            if (!defined($defined)) {
                $missingDependencies[] = $module;
            }
        }

        if(!empty($missingDependencies)) {
            $error .= 'The following PHP modules are required to use amanu:<br/>';
        }
        foreach($missingDependencies as $missingDependency) {
            $error .= '<li>'.$missingDependency[0].'</li>';
        }
        if(!empty($missingDependencies)) {
            $error .= '</ul><p>Please contact your server administrator to install the missing modules.</p>';
        }

        // do we have write permission?
        if(!is_writable('.')) {
            $error.='Can\'t write to the current directory. Please fix this by giving the webserver user write access to the directory.<br/>';
        }

        return($error);
    }


    /**
     * Check the cURL version
     * @return bool status of CURLOPT_CERTINFO implementation
     */
    static public function isCertInfoAvailable() {
        $curlDetails =  curl_version();
        return version_compare($curlDetails['version'], '7.19.1') != -1;
    }

    /**
     * Performs the amanu install.
     * @return string with error messages
     */
    static public function install() {
        $error = '';
        $directory = $_GET['directory'];

        // Test if folder already exists
        if(file_exists('./'.$directory.'/status.php')) {
            return 'The selected folder seems to already contain a ownCloud installation. - You cannot use this script to update existing installations.';
        }

        // downloading latest release
        if (!file_exists('amanu-current.zip')) {
            $error .= AmanuSetup::getFile('http://deploy.amanu-app.de/download/amanu-current.zip','amanu-current.zip');
        }

        // unpacking into owncloud folder
        $zip = new ZipArchive;
        $res = $zip->open('amanu-current.zip');
        if ($res==true) {
            $zip->extractTo('.');
            $zip->close();
        } else {
            $error.='unzip failed.<br />';
        }

        // deleting zip file
        $result=@unlink('amanu-current.zip');
        if($result==false) $error.='deleting of amanu-current.zip failed.<br />';
        return($error);
    }


    /**
     * Downloads a file and stores it in the local filesystem
     * @param string $url
     * @param string$path
     * @return string with error messages
     */
    static public function getFile($url,$path) {
        $error='';

        $fp = fopen ($path, 'w+');
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 0);
        curl_setopt($ch, CURLOPT_FILE, $fp);
        curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        if (AmanuSetup::isCertInfoAvailable()){
            curl_setopt($ch, CURLOPT_CERTINFO, TRUE);
        }
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE);
        $data=curl_exec($ch);
        $curlError=curl_error($ch);
        curl_close($ch);
        fclose($fp);

        if($data==false){
            $error.='download of amanu source file failed.<br />'.$curlError;
        }
        return($error.$curlError);

    }


    /**
     * Shows the html header of the setup page
     */
    static public function showHeader() {
        echo('<!DOCTYPE html>
		<html>
			<head>
				<title>ownCloud Setup</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
				<link rel="icon" type="image/png" href="http://amanu-app.de/favicon.ico" />
				<link rel="stylesheet" href="http://deploy.amanu-app.de/assets/style.css" type="text/css"/>
				<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:400,700" type="text/css">
				<script type="text/javascript" src="http://deploy.amanu-app.de/assets/script.js"></script>
			</head>
			<body>
			    <div class="header">
                    <img src="http://deploy.amanu-app.de/assets/logo.png" alt="amanu" />
			    </div>
		');
    }


    /**
     * Shows the html footer of the setup page
     */
    static public function showFooter() {
        echo('
		<div class="footer">
		    <a href="http://amanu-app.de" target="_blank">amanu - Projektmanagement für Selbstständige und Freelancer</a> - <a href="http://wiki.amanu-app.de" target="_blank">Wiki</a>
        </div>
		</body>
		</html>
		');
    }


    /**
     * Shows the html content part of the setup page
     * @param string $title
     * @param string $content
     * @param string $nextpage
     */
    static public function showContent($title, $content, $nextpage=''){
        echo('
            <div class="box">
                <h2>'.$title.'</h2>
                <div class="content">'.$content.'</div>
                <form method="get">
                    <input type="hidden" name="step" value="'.$nextpage.'" />
		');

        if($nextpage<>'') echo('<input type="submit" id="submit" class="button" value="Next" />');

        echo('
		        </form>
		    </div>


		');
    }


    /**
     * Shows the welcome screen of the setup wizard
     */
    static public function showWelcome() {
        $txt='Welcome to the ownCloud Setup Wizard.<br />This wizard will check the ownCloud dependencies, download the newest version of ownCloud and install it in a few simple steps.';
        AmanuSetup::showContent('Setup Wizard',$txt,1);
    }


    /**
     * Shows the check dependencies screen
     */
    static public function showCheckDependencies() {
        $error=AmanuSetup::checkDependencies();
        if($error=='') {
            $txt='All ownCloud dependencies found';
            AmanuSetup::showContent('Dependency check',$txt,2);
        }else{
            $txt='Dependencies not found.<br />'.$error;
            AmanuSetup::showContent('Dependency check',$txt);
        }
    }


    /**
     * Shows the install screen
     */
    static public function showInstall() {
        $error=AmanuSetup::install();

        if($error=='') {
            $txt='ownCloud is now installed';
            AmanuSetup::showContent('Success',$txt,3);
        }else{
            $txt='amanu is NOT installed<br />'.$error;
            AmanuSetup::showContent('Error',$txt);
        }
    }

    /**
     * Shows the redirect screen
     */
    static public function showRedirect() {
        // delete own file
        @unlink($_SERVER['SCRIPT_FILENAME']);

        // redirect to ownCloud
        header("Location: ".$_GET['directory']);
    }

}


// read the step get variable
if(isset($_GET['step'])) $step=$_GET['step']; else $step=0;

// show the header
AmanuSetup::showHeader();

// show the right step
if     ($step==0) AmanuSetup::showWelcome();
elseif ($step==1) AmanuSetup::showCheckDependencies();
elseif ($step==2) AmanuSetup::showInstall();
elseif ($step==3) AmanuSetup::showRedirect();
else  echo('Internal error. Please try again.');

// show the footer
AmanuSetup::showFooter();
