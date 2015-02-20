<?php
    /**
     * Static class that will output all necessary script tags and will optionally concatenate and compress them
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
require_once 'classes/scripthandling/scripts.php';
require_once 'classes/scripthandling/scriptByTemplate.php';

class ScriptLoader
{
    /**
     * This static function will generate an html output
     * making sure all needed scripts will be included in the head
     * @param bool $debug - whether or not the scripts should be concatenated and compressed, default = false
     * @return string - html which makes sure all scripts will be loaded
     */
    public static function echoScripts($debug = false)
    {
        if($debug)
        {
            $result = self::echoAllScripts();
        }
        else
        {
            $result = self::echoCompressedScripts();
        }
        return $result;
    }

    /**
     * Echoes HTML tags to include all needed scripts
     * @return string - the HTML that includes all single scripts
     */
    private static function echoAllScripts()
    {
        $result = "\n";

        /* Generate css file link tags */
        $cssfiles = Scripts::$css;
        foreach ($cssfiles as $path)
        {
            $result = $result.'<link rel="stylesheet" type="text/css" href="'.$path.'">'."\n";
        }


        //TODO check if the rendered js already exists
        $jsfiles = array_merge(Scripts::$libs, self::getScriptsByTemplate(), Scripts::$scripts);


        foreach ($jsfiles as $path)
        {
            $result = $result.'<script src="'.$path.'"></script>'."\n";
        }
        return $result;
    }

    /**
     * Echoes HTML tags to include all compressed and concatenated scripts
     * @return string - the HTML that includes all concatenated and compressed scripts
     */
    private static function echoCompressedScripts()
    {
        $result = '';

        return $result;
    }


    /**
     * Renders the scriptsByTemplate
     */
    public static function renderScriptsByTemplate()
    {
        $templates = Scripts::$byTemplate;
        foreach($templates as $file)
        {
            $sbt = new ScriptByTemplate($file);
            try
            {
                $sbt->render();
            }
            catch(Exception $e)
            {
                //TODO: Something intelligent here! I think we need a logging mechanism or similar
                echo "\n".$e->getMessage()."\n";
            }

        }
    }

    /**
     * Gets an array with paths to rendered scriptsByTemplate
     * @return array - an array of paths to rendered scripts by template
     */
    private static function getScriptsByTemplate()
    {
        $conf = Config::getInstance();
        $scriptsdir = $conf->get['path']['generated'];
        $templates = Scripts::$byTemplate;

        $paths = array();

        foreach($templates as $file)
        {
            $renderedfile = $scriptsdir.'/'.str_replace('.jst', '.js', $file);
            /* Check if the file is rendered */
            if(!file_exists($renderedfile))
            {
                /* If not, render it */
                $sbt = new ScriptByTemplate($file);
                try
                {
                    $renderedfile = $sbt->render();
                }
                catch(Exception $e)
                {
                    //TODO: Something intelligent here! I think we need a logging mechanism or similar
                    echo "\n".$e->getMessage()."\n";
                }
            }
            array_push($paths, $renderedfile);
        }
        return $paths;
    }



}


?>