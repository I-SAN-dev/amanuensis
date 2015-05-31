<?php
/**
 * Wrapper for PHPMailer and sending Emails from the App
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */
require_once('classes/config/config.php');
require_once('classes/pdf/amaTemplate.php');
require_once('classes/mail/phpmailer/PHPMailerAutoload.php');


class AmaMail {

    /**
     * create a new mail to a recipient
     * @param String $receivername - the name of the receiver
     * @param String $receivermail - the mail adress of the receiver
     * @param String $subject - the subject of the email
     */
    public function __construct($receivername, $receivermail, $subject)
    {
        $conf = Config::getInstance();
        $this->options = $conf->get['mail'];


        $this->mail = new PHPMailer(true);

        /* SMTP config */
        if($this->options['usesmtp'])
        {
            $this->mail->isSMTP();
            $this->mail->Host = $this->options['smtphost'];
            $this->mail->SMTPAuth = $this->options['smtpauth'];
            $this->mail->Username = $this->options['username'];
            $this->mail->Password = $this->options['password'];

            $smtpsecure = strtolower($this->options['secure']);
            if( $smtpsecure == 'tls' || $smtpsecure == 'ssl' )
            {
                $this->mail->SMTPSecure = $smtpsecure;
            }

            $this->mail->Port = $this->options['port'];
        }

        /* Mail config */
        $this->mail->From = $this->options['sender'];
        $this->mail->FromName = $conf->get['company'];
        $this->mail->addAddress($receivermail, $receivername);
        /* optional reply to address */
        if(isset($this->options['replyto']) && $this->options['replyto'] != '')
        {
            $this->mail->addReplyTo($this->options['replyto']);
        }
        /* optional archive address */
        if(isset($this->options['archive']) && $this->options['archive'] != '')
        {
            $this->mail->addBCC($this->options['archive']);
        }

        $this->mail->Subject = $subject;
        $this->mail->isHTML(true);

        $this->contentSet = false;
    }

    /**
     * Sets the content of the mail
     * @param $html - the html body of the mail - only the part inside the outer
     */
    public function setContent($html)
    {
        $conf = Config::getInstance();
        $values = $conf->get;
        $values['content'] = $html;
        $template = new amaTemplate($values['mailcontent']['template'], $values);

        $messageHtml = $template->getHTML();
        $this->previewHtml = $messageHtml;
        $this->mail->Body = $this->charset_decode_utf_8($messageHtml);

        /* automatically convert HTML to Text... a bit...*/
        $this->mail->AltBody = $this->html2text($messageHtml);

        $this->mail->CharSet = "ISO-8859-1";
        $this->contentSet = true;
    }

    /**
     * Adds an attachment to the mail
     * @param $path - the path to the attchement
     * @param null $name - an optional new name for the attachment
     */
    public function addAttachment($path, $name = '')
    {
        $this->mail->addAttachment($path, $name);
    }

    /**
     * Returns the complete generated Mail Markup
     * @return string
     * @throws Exception
     */
    public function getPreview()
    {
        if($this->contentSet && isset($this->previewHtml))
        {
            return $this->previewHtml;
        }
        else
        {
            throw new Exception('No mail content set.', 404);
        }
    }

    /**
     * Finally sends the mail
     * @throws Exception
     */
    public function send()
    {
        if($this->contentSet)
        {
            if(!$this->mail->send())
            {
                throw new Exception($this->mail->ErrorInfo, 500);
            }
        }
        else
        {
            throw new Exception('No mail content set.', 404);
        }
    }

    /**
     * Converts html to Text and encodes it in ISO-8859-1
     * Looks like reeeeaaally fucked up shit, but this works actually quite well!
     * @param $html - the html that should be textified
     * @return String
     */
    private function html2text($html)
    {
        $doc = new DOMDocument();
        $doc->preserveWhiteSpace = false;
        @$doc->loadHTML($html);

        /* remove style and script tags */
        $remove = array();
        $script = $doc->getElementsByTagName('script');
        $style = $doc->getElementsByTagName('style');
        foreach($script as $item)
        {
            $remove[] = $item;
        }
        foreach($style as $item)
        {
            $remove[] = $item;
        }
        foreach ($remove as $item)
        {
            $item->parentNode->removeChild($item);
        }

        /* write link to the linktext */
        foreach($doc->getElementsByTagName('a') as $anchor)
        {
            /* This works, also if PHPStorm tries to tell me it won't */
            $link = $anchor->getAttribute('href');
            $text = new DOMText(' - '.$link.' ');
            $anchor->appendChild($text);
        }
        $html = $doc->saveHTML();

        /* Converts html entities back to chars */
        $html = html_entity_decode($html);
        $html = utf8_decode($html);

        /* remove all tags except newlines */
        $html = strip_tags($html, '<br><br/><br />');

        /* convert all new lines to brs so we can better singlify them */
        $html = nl2br($html);

        /* convert multiple brs to one br and multiple whitespaces to one whitespace */
        $html = str_replace("?<br />",'<br />', $html);
        $html = preg_replace('#(<br */?>\s*)+#i', '<br />', $html);

        /* Remove multiple whitespaces */
        $html = preg_replace('/\s+/', ' ', $html);

        /* change brs to standard newline \r\n */
        $breaks = array("<br />","<br>","<br/>");
        $html = str_ireplace($breaks, "\r\n", $html);

        return $html;
    }

    /**
     * Decodes unicode/utf8 to ansi/ISO-8859-1 and replaces unsupported chars with entities
     * @author okx.oliver.koenig@gmail.com - http://php.net/manual/de/function.utf8-decode.php#116671
     * @param $string
     * @return mixed
     */
    private function charset_decode_utf_8 ($string) {
        /* Only do the slow convert if there are 8-bit characters */
        /* avoid using 0xA0 (\240) in ereg ranges. RH73 does not like that */
        if (!preg_match("/[\200-\237]/", $string)
            && !preg_match("/[\241-\377]/", $string)
        ) {
            return $string;
        }

        // decode three byte unicode characters
        $string = preg_replace("/([\340-\357])([\200-\277])([\200-\277])/e",
            "'&#'.((ord('\\1')-224)*4096 + (ord('\\2')-128)*64 + (ord('\\3')-128)).';'",
            $string
        );

        // decode two byte unicode characters
        $string = preg_replace("/([\300-\337])([\200-\277])/e",
            "'&#'.((ord('\\1')-192)*64+(ord('\\2')-128)).';'",
            $string
        );
        return $string;
    }

}