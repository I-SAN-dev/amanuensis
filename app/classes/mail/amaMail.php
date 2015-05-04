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
        if($this->options['usesmtp'] == 1 )
        {
            $this->mail->isSMTP();
            $this->mail->Host = $this->options['smtphost'];
            $this->mail->SMTPAuth = $this->options['smtpauth']==1 ? true : false;
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
     * @param $html - the html body of the mail
     * @param null $plaintext - alternative plaintext body
     */
    public function setContent($html, $plaintext = NULL)
    {
        $this->mail->Body = $html;

        if(isset($plaintext))
        {
            $this->mail->AltBody = $plaintext;
        }
        else
        {
            /* automatically convert HTML to Text... a bit...*/
            $this->mail->AltBody = $this->html2text($html);
        }

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
     * Converts html to Text
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

        /* remove all tags except newlines */
        $html = strip_tags($html, '<br><br/><br />');

        /* convert all new lines to brs so we can better singlify them */
        $html = nl2br($html);

        /* convert multiple brs to one br and multiple whitespaces to one whitespace */
        $html = preg_replace('#(<br */?>\s*)+#i', '<br />', $html);
        $html = preg_replace('/\s+/', ' ', $html);

        /* change brs to standard newline \r\n */
        $breaks = array("<br />","<br>","<br/>");
        $html = str_ireplace($breaks, "\r\n", $html);

        return $html;

    }

}