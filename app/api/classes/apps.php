<?php
/**
 * Gathers infos for the extensions
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

require_once 'classes/config/config.php';

class apps {

    /**
     * This method reacts to GET Requests
     */
    public static function get()
    {
        $conf = Config::getInstance();

        $browser = self::getBrowser();

        /* Decide which link & which hint to show */
        if($browser['name'] == "Mozilla Firefox")
        {
            $displaylink = 'firefoxapp';
            $message = 'app.installffapp';
        }
        elseif ($browser['name'] == 'Google Chrome' && $browser['platform'] != 'android')
        {
            $displaylink = 'chromeapp';
            $message = 'app.installchromeapp';
        }
        else
        {
            $displaylink = NULL;
            if($browser['platform'] == 'android')
            {
                $message = 'app.android';
            }
            elseif($browser['platform'] == 'linux' || $browser['platform'] == 'mac' || $browser['platform'] == 'windows')
            {
                $message = 'app.availabelextensions';
            }
            else
            {
                $message = 'app.notavailable';
            }
        }



        $response = array(
            "chromeapp" => $conf->get['baseurl'].'/api/?action=crx',
            "firefoxapp" => $conf->get['baseurl'].'/manifest.webapp',
            "browser" => $browser['name'],
            "os" => $browser['platform'],
            'displaylink' => $displaylink,
            'message' => $message
        );
        json_response($response);
        //echo($browser['userAgent']);
        //var_dump($response);
    }

    /**
     * Function for identifying browser
     * @author: ruudrp@live.nl - http://php.net/manual/de/function.get-browser.php#101125
     * Extended by SA for mobile platform support (ipad/iphone/ipod/android/Safari for iOs)
     * @return array
     */
    private static function getBrowser()
    {
        $u_agent = $_SERVER['HTTP_USER_AGENT'];
        $bname = 'Unknown';
        $platform = 'Unknown';
        $version= "";

        //First get the platform?
        if (preg_match('/linux/i', $u_agent) && !preg_match('/android/i',$u_agent) ) {
            $platform = 'linux';
        }
        elseif (preg_match('/iPad|iPhone|iPod/i', $u_agent)) {
            $platform = 'iOS';
        }
        elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
            $platform = 'mac';
        }
        elseif (preg_match('/windows|win32/i', $u_agent)) {
            $platform = 'windows';
        }
        elseif (preg_match('/android/i', $u_agent)) {
            $platform = 'android';
        }


        // Next get the name of the useragent yes seperately and for good reason
        if(preg_match('/MSIE|Trident/i',$u_agent) && !preg_match('/Opera/i',$u_agent))
        {
            $bname = 'Internet Explorer';
            $ub = "MSIE";
        }
        elseif(preg_match('/Firefox/i',$u_agent))
        {
            $bname = 'Mozilla Firefox';
            $ub = "Firefox";
        }
        elseif(preg_match('/Chrome/i',$u_agent))
        {
            $bname = 'Google Chrome';
            $ub = "Chrome";
        }
        elseif (preg_match('/iPad|iPhone|iPod/i', $u_agent)) {
            $bname = 'Apple Safari for iOS';
            $ub = 'Safari';
        }
        elseif(preg_match('/Safari/i',$u_agent))
        {
            $bname = 'Apple Safari';
            $ub = "Safari";
        }
        elseif(preg_match('/Opera/i',$u_agent))
        {
            $bname = 'Opera';
            $ub = "Opera";
        }
        elseif(preg_match('/Netscape/i',$u_agent))
        {
            $bname = 'Netscape';
            $ub = "Netscape";
        }


        // finally get the correct version number
        $known = array('Version', $ub, 'other');
        $pattern = '#(?<browser>' . join('|', $known) .
            ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
        if (!preg_match_all($pattern, $u_agent, $matches)) {
            // we have no matching number just continue
        }

        // see how many we have
        $i = count($matches['browser']);
        if ($i != 1) {
            //we will have two since we are not using 'other' argument yet
            //see if version is before or after the name
            if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
                $version= $matches['version'][0];
            }
            else {
                $version= $matches['version'][1];
            }
        }
        else {
            $version= $matches['version'][0];
        }

        // check if we have a number
        if ($version==null || $version=="") {$version="?";}

        return array(
            'userAgent' => $u_agent,
            'name'      => $bname,
            'version'   => $version,
            'platform'  => $platform,
            'pattern'    => $pattern
        );
    }

}