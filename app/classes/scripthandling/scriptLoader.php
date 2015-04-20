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
        $result = "\n";

        /* CSS */
        $result = $result.'<link rel="stylesheet" type="text/css" href="'.self::cacheCompressCss().'">'."\n";

        /* JS */
        $result = $result.'<script src="'.self::cacheCompressJs().'"></script>'."\n";

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
                $error = new amaException($e);
                $error->renderScripttag();
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
        $headers = getallheaders();
        $hardrefresh = ($headers['Cache-Control'] == "no-cache" || $headers["Pragma"] == "no-cache");

        $paths = array();

        foreach($templates as $file)
        {
            $renderedfile = $scriptsdir.'/'.str_replace('.jst', '.js', $file);
            /* Check if the file is rendered */
            if(!file_exists($renderedfile) || $hardrefresh)
            {
                /* If not, render it */
                $sbt = new ScriptByTemplate($file);
                try
                {
                    $renderedfile = $sbt->render();
                }
                catch(Exception $e)
                {
                    $error = new amaException($e);
                    $error->renderScripttag();
                }
            }
            array_push($paths, $renderedfile);
        }
        return $paths;
    }

    /**
     * merges, caches and compresses all css files if necessary
     * @return String - the path to the generated css file
     */
    private static function cacheCompressCss()
    {
        $path = 'css/ama.all.min.css';

        /* get youngest css file */
        $youngest = 0;
        foreach(Scripts::$css as $file)
        {
            if(file_exists($file) && filemtime($file) > $youngest)
            {
                $youngest = filemtime($file);
            }
        }

        /* Check if file is not existent or older than youngest css */
        /* (re)generate it!!! */
        if(!file_exists($path) || (file_exists($path) && $youngest > filemtime($path)))
        {
            /* Start output buffer */
            ob_start();

            /* load every css file */
            foreach(Scripts::$css as $file)
            {
                try
                {
                    include($file);
                }
                catch (Exception $e)
                {
                    $error = new amaException($e);
                }
            }
            $filecontents = ob_get_clean();


            /* compress css */
            /* remove comments */
            $filecontents = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $filecontents);
            /* remove tabs, spaces, newlines, etc. */
            $filecontents = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $filecontents);


            /* write the cached version back to disc */
            file_put_contents($path, $filecontents);
        }
        return $path;
    }

    /**
     * merges, caches and compresses all js files if necessary
     * @return String - the path to the generated js file
     */
    private static function cacheCompressJs()
    {
        $path = 'js/ama.all.min.js';
        $jsfiles = array_merge(Scripts::$libs, self::getScriptsByTemplate(), Scripts::$scripts);

        /* get youngest css file */
        $youngest = 0;
        foreach($jsfiles as $file)
        {
            if(file_exists($file) && filemtime($file) > $youngest)
            {
                $youngest = filemtime($file);
            }
        }

        /* Check if file is not existent or older than youngest css */
        /* (re)generate it!!! */
        if(!file_exists($path) || (file_exists($path) && $youngest > filemtime($path)))
        {
            /* Start output buffer */
            ob_start();

            /* load every css file */
            foreach($jsfiles as $file)
            {
                try
                {
                    echo "/* File: ".$file." */\n";
                    include($file);
                    echo "\n\n";
                }
                catch (Exception $e)
                {
                    $error = new amaException($e);
                }
            }
            $filecontents = ob_get_clean();


            /* compress js */
            /* well, actually that is not so easy as css minification... i think we go with concatenation for the moment */


            /* write the cached version back to disc */
            file_put_contents($path, $filecontents);
        }
        return $path;
    }



}


?>