<?php
/**
 * Handles stream item creation and stream delivering
 * Implements Singleton Pattern
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
require_once('classes/authentication/authenticator.php');
require_once('classes/project/amaProject.php');

final class AmaStream {

    protected static $instance;

    /**
     * Will return the instance of the stream
     * @return AmaStream - a stream object
     */
    public static function getInstance()
    {
        if(self::$instance == NULL)
        {
            self::$instance = new AmaStream();
        }
        return self::$instance;
    }

    /**
     * Manage proper cloning
     * @return AmaStream - an AmaStream instance
     */

    private function __clone(){
        return self::getInstance();
    }

    /**
     * Constructor will trigger the cleanup
     */
    private function __construct()
    {
        $this->cleanUpOld();
    }

    /**
     * @param $action - the action that was done, e.g create, send, archive, delete
     * @param $type - what was done, e.g. project, client, invoice
     * @param $id - id of the thing
     * @param $nouser - if it is an event that shall not be connected with a user - defaults to false
     */
    public function addItem($action, $type, $id, $nouser = false)
    {
        $dbal = DBAL::getInstance();

        $data = array(
            'associated_type' => $type,
            'associated_id' => $id,
            'associated_action' => $action
        );

        /* get user */
        if($nouser)
        {
            $data['user_id'] = NULL;
        }
        else
        {
            $user = Authenticator::getUser();
            $data['user_id'] = $user->id;
        }


        /* client */
        if($type == 'client')
        {
            $client = $dbal->simpleSelect(
                'customers',
                array('companyname','contact_firstname','contact_lastname'),
                array('id',$id),
                1
            );

            $data['client_id'] = $id;
            $data['associated_title'] = (isset($client['companyname']) && $client['companyname'] != '') ? $client['companyname'] : $client['contact_firstname'].' '.$client['contact_lastname'];

        }

        /* project */
        else if($type == 'project')
        {
            $project = new AmaProject($id);
            $data['associated_title'] = $project->name;

            $client = $project->getClient();
            $data['client_id'] = $client['id'];
        }
        /* reminder */
        else if($type == 'reminder')
        {
            $thing = $dbal->simpleSelect(
                $type.'s',
                array('name', 'invoice'),
                array('id', $id),
                1
            );

            $data['associated_title'] = $thing['name'];
            $invoice = $dbal->simpleSelect('invoices', array('project'), array('id', $thing['invoice']), 1);
            $project = new AmaProject($invoice['project']);
            $client = $project->getClient();
            $data['client_id'] = $client['id'];
        }
        /* things */
        else if(in_array($type, array('offer','contract','todo','acceptance','invoice')))
        {
            $thing = $dbal->simpleSelect(
                $type.'s',
                array('name', 'project'),
                array('id', $id),
                1
            );

            $data['associated_title'] = $thing['name'];

            $project = new AmaProject($thing['project']);
            $client = $project->getClient();
            $data['client_id'] = $client['id'];
        }

        /* fill ind atabase */
        $dbal->dynamicInsert(
            'stream',
            array(
                'user_id',
                'associated_type',
                'associated_id',
                'associated_title',
                'client_id',
                'associated_action'
            ),
            $data
        );
    }

    /**
     * Returns the stream data and triggers the cleanup
     * @return array
     */
    public function getStream()
    {
        $dbal = DBAL::getInstance();

        $q = $dbal->prepare('
            SELECT    stream.create_time,
                    users.id AS user_id, users.username AS user_name, users.email AS user_email,
                    stream.associated_action AS action, stream.associated_title AS title, stream.associated_type AS type, stream.associated_id AS id,
                    customers.id AS client_id, customers.companyname AS client_companyname, customers.contact_firstname AS client_firstname, customers.contact_lastname AS client_lastname
            FROM stream
                LEFT JOIN users ON (stream.user_id = users.id)
                LEFT JOIN customers ON (stream.client_id = customers.id)
            ORDER BY stream.create_time DESC
            LIMIT 50
        ');

        $q->execute();
        $entries = $q->fetchAll(PDO::FETCH_ASSOC);

        /* Reconstruct this moloch */
        foreach($entries as &$e)
        {
            /* user */
            $e['user'] = array(
                'id' => $e['user_id'],
                'name' => $e['user_name'],
                'email' => $e['user_email'],
            );
            unset($e['user_id']);
            unset($e['user_name']);
            unset($e['user_email']);

            /* client */
            $e['client'] = array(
                'id' => $e['client_id'],
                'name' => (isset($e['client_companyname']) && $e['client_companyname'] != '') ? $e['client_companyname'] : $e['client_firstname'].' '.$e['client_lastname']
            );
            unset($e['client_id']);
            unset($e['client_companyname']);
            unset($e['client_firstname']);
            unset($e['client_lastname']);
        }
        return $entries;
    }

    /**
     * Deletes old stream entries, older than 90 days
     */
    private function cleanUpOld()
    {
        $dbal = DBAL::getInstance();
        $q = $dbal->prepare('
            DELETE FROM stream
            WHERE create_time < NOW() - INTERVAL 90 DAY
        ');
        $q->execute();
    }

}