<?php
/**
 * Generates a Chrome Extension for the Webapp
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */
if(!$thisisamanu)die('Direct access restricted');

require_once('classes/database/dbal.php');
require_once('classes/errorhandling/amaException.php');
require_once('classes/authentication/authenticator.php');
require_once('classes/crxgen/CrxBuild.php');

class crx {

    /**
     * Reacts to get requests
     */
    public static function get()
    {

        $outputdir = 'classes/crxgen/outputdir';
        $builddir = 'classes/crxgen/builddir';
        $manifest = $builddir.'/manifest.json';

        $conf = Config::getInstance();

        /* read manifest file */
        try
        {
            if(!file_exists($manifest))
            {
                throw new Exception('File '.$manifest.' does not exist');
            }
            $file = file_get_contents($manifest);
            $manifest_array = json_decode($file, true);
        }
        catch(Exception $e)
        {
            $error = new amaException($e, 500);
            $error->renderJSONerror();
            $error->setHeaders();
        }

        /* update manifest data */
        $manifest_array['app']['urls'][0] = $conf->get['baseurl'];
        if(isset($conf->get['secureurl']) && $conf->get['secureurl'] != '')
        {
            $manifest_array['app']['urls'][1] = $conf->get['secureurl'];
        }
        else
        {
            unset($manifest_array['app']['urls'][1]);
        }

        $manifest_array['app']['launch']['web_url'] = $conf->get['baseurl'];

        /* write manifest data */
        try
        {
            /* If JSON PRETTY PRINT is available, use it (PHP 5.4+) */
            if(defined('JSON_PRETTY_PRINT')&&(version_compare(PHP_VERSION, '5.4', '>=')))
            {
                $jsonstring = json_encode($manifest_array, JSON_PRETTY_PRINT);
            }
            else
            {
                $jsonstring = json_encode($manifest_array);
            }

            if(!file_put_contents($manifest, $jsonstring, LOCK_EX))
            {
                throw new Exception("Error writing config: ".$manifest);
            }
        }
        catch(Exception $e)
        {
            $error = new amaException($e, 500);
            $error->renderJSONerror();
            $error->setHeaders();
        }

        /* Build the crx */
        try
        {
            $crxBuild = new CrxBuild(array(
                'extension_dir' => $builddir,
                'key_file' => 'classes/crxgen/key/amanu.pem',
                'output_dir' => $outputdir
            ));
            $crxBuild->build();
        }
        catch(Exception $e)
        {
            $error = new amaException($e);
            $error->renderJSONerror();
            $error->setHeaders();
        }


        /* Download the crx */

        //header('Content-Type: application/x-chrome-extension');
        // if we send this header, chrome tries directly to install the file, which is not allowed... therefore we serve it without that header
        header("Content-Disposition: attachment; filename=\"amanu.crx\"");

        $file = $outputdir.'/builddir.crx';

        if(file_exists($file))
        {
            echo(file_get_contents($file));
        }
        else
        {
            $error = new amaException(NULL, 500, 'Something went wrong. Really wrong. This is strange...');
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}