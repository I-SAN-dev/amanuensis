<?php
/**
 * This class handles our PDF Templates.
 * Due to this extra class we can keep our variable scope clean
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

class amaTemplate {

    /**
     * Constructor
     * @param string $path - the path of the template to load
     * @param array $data - an array with variables that shall be accessible
     * @throws Exception
     */
    public function __construct($path, array $data)
    {
        if(is_file($path))
        {
            $this->path = $path;
            $this->data = $data;
        }
        else
        {
            throw new Exception('Template "'.$path.'" cannot be found', 404);
        }
    }


    /**
     * Renders a template
     * @return string - the readymade html code
     */
    public function getHTML()
    {
        /**
         * Echoes an expression if a var is present
         * @param $var
         * @param $expression - optional, %v will be replaced by var
         */
        if(!function_exists('echoIf'))
        {
            /**
             * Outputs something if it is existent, with a wrapper
             * @param $var - the variable
             * @param null $expression - an expression to output, %v will be replaced with the var
             */
            function echoIf($var, $expression = NULL)
            {
                if(isset($var) && $var != '')
                {
                    if(isset($expression) && $expression != '')
                    {
                        echo str_replace('%v', $var, $expression);
                    }
                    else
                    {
                        echo $var;
                    }
                }
            }
        }
        if(!function_exists('exists'))
        {
            /**
             * Checks if an input is existent
             * @param $var - the variable
             * @return bool
             */
            function exists($var)
            {
                return (
                    isset($var)
                    && (!is_string($var) || strlen($var) > 0)
                    && $var != ''
                );
            }
        }
        if(!function_exists('formatDate'))
        {
            /**
             * Formats a date in format yyyy-MM-dd to dd.MM.yyyy
             * @param string $date - the date
             * @return string
             */
            function formatDate($date)
            {
                $dateTime = DateTime::createFromFormat('Y-m-d', $date);
                return $dateTime->format('m/d/Y');
            }
        }


        /* Start output buffering */
        ob_start();

        /* extract the variables array to the scope*/
        extract($this->data);

        /* include the template file */
        include($this->path);

        /* Stop output buffering and return the data */
        return ob_get_clean();
    }




}