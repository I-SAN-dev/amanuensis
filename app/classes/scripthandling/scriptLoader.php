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

require_once 'scripts.php';

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
        $result = '';

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
        //TODO: This has to render the scripts-by-template from a configuration file
    }

    /**
     * Gets an array with paths to rendered scriptsByTemplate
     * @return array - an array of paths to rendered scripts by template
     */
    private static function getScriptsByTemplate()
    {
        //TODO: Check if the scriptsByTemplate are existent, if not, call self::renderScriptsByTemplate()
        //TODO: Return an array with paths to the rendered scriptsByTemplate
        return array();
    }



}


?>