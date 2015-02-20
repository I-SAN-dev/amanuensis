<?php
/**
 * Class, that reads .jst files, compiles them to js and writes them back to disc
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

class ScriptByTemplate
{

    /**
     * Creates an instance of the class referenzing a .jst file
     * @param $filename - the filename of the .jst file in the scriptybytemplate directory
     */
    public function __construct($filename)
    {
        $this->filename = $filename;
        $this->conf = Config::getInstance();
    }

    /**
     * Reads the .jst file, replaces the marker with the values from the config file
     */
    public function render()
    {
        $tmpldir = $this->conf->get['path']['scriptsbytemplate'];
        $scriptsdir = $this->conf->get['path']['generated'];
        $file = $tmpldir.'/'.$this->filename;
        $destinationFile = $scriptsdir.'/'.str_replace('.jst', '.js', $this->filename);

        /* Check if file exists */
        if(file_exists($file))
        {
            /* get template file contents */
            $filecont = file_get_contents($file);
            if($filecont == false)
            {
                throw new Exception('Unable to read file: '.$file);
            }

            /* Replace the markers */
            $filecont = $this->replaceMarkers($filecont);

            /* write the file back to disc */
            if(!file_put_contents($destinationFile, $filecont))
            {
                throw new Exception('Unable to write file: '.$destinationFile);
            }
        }
        else
        {
            throw new Exception('File not found: '.$file);
        }
    }

    /**
     * Fills a template with strings from the config
     * @param $filecont - The template string that contains the markers that should be repalced
     * @return String - the parsed file content
     */
    private function replaceMarkers($filecont)
    {

        $startDelimiter = '[@';
        $endDelimiter = '@]';

        foreach($this->conf->get as $k1 => $value)
        {
            if(is_array($value))
            {
                foreach($value as $k2 => $value)
                {
                    $tagToReplace = $startDelimiter.$k1.'.'.$k2.$endDelimiter;
                    $filecont = str_replace($tagToReplace, $value, $filecont);
                }
            }
            else
            {
                $tagToReplace = $startDelimiter.$k1.$endDelimiter;
                $filecont = str_replace($tagToReplace, $value, $filecont);
            }
        }
        return $filecont;
    }
}
?>