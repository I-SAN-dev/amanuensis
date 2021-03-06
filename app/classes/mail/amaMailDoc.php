<?php
/**
 * This class generates an amaMail with specific content and attachement based on a thing that should be sent
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */
require_once('classes/database/dbal.php');
require_once('classes/database/state_constants.php');
require_once('classes/pdf/amaTemplate.php');
require_once('classes/pdf/pdfDoc.php');
require_once('classes/mail/amaMail.php');
require_once('classes/project/amaProject.php');
require_once('classes/authentication/authenticator.php');
require_once('classes/authentication/user.php');
require_once('classes/config/config.php');

class AmaMailDoc {

    /**
     * Constructs a new AmaMailDoc
     * @param $type - the type of the thing that should be send, e.g. offer
     * @param $id - the id of the thing
     * @param $additional - some additional text that can be added to the mail
     */
    public function __construct($type, $id, $additional = NULL)
    {
        $conf = Config::getInstance();
        $this->type = $type;
        $this->id = $id;

        /* Gather document info */
        $this->info = $this->getInfo();
        if(isset($additional) && $additional != '')
        {
            $this->info['additional'] = $additional;
        }
        $this->info['company'] = $conf->get['company'];
        $this->info['company_addition'] = $conf->get['company_addition'];


        /* Gather mail recipients */
        $this->recipient = $this->getRecipient();

        /* Gather attachment */
        $this->attachments = $this->getAttachments();

        /* Gather Mail content */
        $this->content = $this->getContent();

        /* generate subject */
        $this->subject = $this->getSubject();

        $this->mail = new AmaMail($this->recipient['name'], $this->recipient['mail'], $this->subject);
        $this->mail->setContent($this->content);
        foreach($this->attachments as $attachment)
        {
            $this->mail->addAttachment($attachment);
        }

    }

    /**
     * Returns a preview path
     * @return string
     */
    public function getPreview()
    {
        $conf = Config::getInstance();
        $mailhtml = $this->mail->getPreview();
        $userid = Authenticator::getUser()->id;
        $path = 'tmp/'.$userid.'-mail.html';
        file_put_contents($path, $mailhtml);


        $template = new amaTemplate('templates/server/preview.phtml', array(
            'subject' => $this->subject,
            'recipient' => $this->recipient,
            'attachments' => $this->attachments,
            'mailpreviewpath' => $conf->getUrl().'api/?action=mail&path='.$path,
            'linkurl' => $conf->getUrl()
        ));

        $previewpath = 'tmp/'.$userid.'-preview.html';
        file_put_contents($previewpath, $template->getHTML());
        return $previewpath;
    }

    /**
     * Sends the constructed mail
     */
    public function send()
    {
       try
       {
           $this->mail->send();
           $dbal = DBAL::getInstance();
           $dbal->dynamicUpdate(
               $this->type.'s',
               array('id', $this->id),
               array('state'),
               array('state' => PDF_SENT)
           );
       }
       catch(Exception $e)
       {
           throw $e;
       }
    }



    /**
     * Gathers the info
     * @return array
     * @throws Exception - if the thing is not found
     */
    private function getInfo()
    {
         if($this->type == 'reminder')
        {
            $fields = array('name','description','invoice','refnumber','date', 'path');
        }
        else
        {
            $fields = array('name','description','project','refnumber','date', 'path');
        }

        $dbal = DBAL::getInstance();
        $info = $dbal->simpleSelect($this->type.'s', $fields, array('id', $this->id), 1);
        if(count($info) < 1)
        {
            throw new Exception('Info for "'.$this->type.'" "'.$this->id.'" not found', 404);
        }

        /* Add project and client data */
        if($this->type != 'reminder')
        {
            $project = new AmaProject($info['project']);
        }
        else
        {
            $invoice = $dbal->simpleSelect('invoices', array('id, project, name, description, refnumber, date, path'), array('id', $info['invoice']), 1);
            $info['invoice'] = $invoice;
            $project = new AmaProject($invoice['project']);
        }
        $info['project'] = $project->getProjectData();

        /* Add current date as date, if not existent (acceptance) */
        $info['date'] = isset($info["date"]) ? date_create($info["date"]) : date('Y-m-d');


        return $info;
    }

    /**
     * Gathers Recipient info
     * @return array with 'mail' and 'name'
     * @throws Exception
     */
    private function getRecipient()
    {
        $clientid = $this->info['project']['client']['id'];
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare("
            SELECT value FROM customer_data WHERE customer = :id AND isdefault = TRUE AND datatype = 'mail' LIMIT 1
        ");
        $q->bindParam(':id',$clientid);
        $q->execute();
        if($entry = $q->fetch(PDO::FETCH_ASSOC))
        {
            $recipient = $entry['value'];
        }
        else
        {
            $q2 = $dbal->prepare("
                SELECT value FROM customer_data WHERE customer = :id AND datatype = 'mail' LIMIT 1
            ");
            $q2->bindParam(':id',$clientid);
            $q2->execute();
            if($entry = $q2->fetch(PDO::FETCH_ASSOC))
            {
                $recipient = $entry['value'];
            }
            else
            {
                throw new Exception('No recipient found', 404);
            }
        }

        if ((isset($this->info['project']['client']['contact_firstname']) && $this->info['project']['client']['contact_firstname'] != '') &&
            (isset($this->info['project']['client']['contact_lastname']) && $this->info['project']['client']['contact_lastname'] != ''))
        {
            $recipientname = $this->info['project']['client']['contact_firstname'].' '.$this->info['project']['client']['contact_lastname'];
        }
        else
        {
            $recipientname = $this->info['project']['client']['companyname'];
        }

        return array(
            'mail' => $recipient,
            'name'=> $recipientname
        );
    }

    /**
     * Gathers the Attachment path and ensures it existence
     * @return array
     */
    private function getAttachments()
    {
        $attachments = array();
        /* Add main document */
        if(
            !isset($this->info['path']) ||
            $this->info['path'] == '' ||
            !file_exists($this->info['path'])
        )
        {
            $pdf = new PdfDoc($this->type, $this->id);
            array_push($attachments, $pdf->saveToDisk());
        }
        else
        {
            array_push($attachments, $this->info['path']);
        }
        /* Add Invoice to reminders */
        if(isset($this->info['invoice']))
        {
            if(
                !isset($this->info['invoice']['path']) ||
                $this->info['invoice']['path'] == '' ||
                !file_exists($this->info['invoice']['path'])
            )
            {
                $pdf = new PdfDoc('invoice', $this->info['invoice']['id']);
                array_push($attachments, $pdf->saveToDisk());
            }
            else
            {
                array_push($attachments, $this->info['invoice']['path']);
            }
        }
        /* Add additional attachment from config */
        $conf = Config::getInstance();
        if(isset($conf->get['mailcontent']['attachment_'.$this->type]) && file_exists($conf->get['mailcontent']['attachment_'.$this->type]))
        {
            array_push($attachments, $conf->get['mailcontent']['attachment_'.$this->type]);
        }

        return $attachments;
    }

    /**
     * Gathers the mail content
     * @return string
     */
    private function getContent()
    {
        $conf = Config::getInstance();
        $template = new amaTemplate($conf->get['mailcontent']['content_'.$this->type], $this->info);
        return $template->getHTML();
    }

    /**
     * Generates the Mails subject
     * @return string
     */
    private function getSubject()
    {
        $conf = Config::getInstance();
        $subject = $conf->get['mailcontent']['subject_'.$this->type];
        $subject = str_replace('%ref%', $this->info['refnumber'], $subject);
        return $subject;
    }




}