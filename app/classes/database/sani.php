<?php
/**
 * Has some nice sanitation functions
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */

class Sani {

    /**
     * Checks an Email
     * @param string $email
     * @return string
     * @throws Exception
     */
    public static function email($email)
    {
        if(
            !isset($email)
            || !is_string($email)
            || strlen($email) < 5
            || !filter_var($email, FILTER_VALIDATE_EMAIL)
        )
        {
            throw new Exception('Invalid email', 400);
        }
        return $email;
    }

    /**
     * Check a string
     * @param string $string - a string to validate
     * @param array $options - some options, can include minlength, maxlength, onlyletters
     * @return string
     * @throws Exception
     */
    public static function validString($string, $options = array())
    {
        if($options['required'] && (!isset($string) || $string == ''))
        {
            throw new Exception('Empty input', 400);
        }
        else if(!$options['required'] && (!isset($string) || $string == ''))
        {
            return '';
        }
        else if(!is_string($string))
        {
            throw new Exception('Input not string', 400);
        }
        else if($options['minlength'] && $options['minlength'] > strlen($string))
        {
            throw new Exception('Input to short', 400);
        }
        else if($options['maxlength'] && $options['maxlength'] < strlen($string))
        {
            throw new Exception('Input to long', 400);
        }
        else if($options['safe_chars'] && !preg_match("/^[a-z0-9 .\-]+$/i",$string))
        {
            throw new Exception('Invalid chars in input', 400);
        }

        return $string;
    }

    /**
     * check if input is in allowed set
     * @param mixed $input
     * @param array $options
     * @return mixed
     * @throws Exception
     */
    public static function options($input, $options)
    {
        if(!in_array($input, $options))
        {
            throw new Exception('Input option not allowed', 400);
        }
        return $input;
    }

}