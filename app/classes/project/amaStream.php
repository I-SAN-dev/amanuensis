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
     */
    public function addItem($action, $type, $id)
    {
        $dbal = DBAL::getInstance();

        $data = array(
            'associated_type' => $type,
            'associated_id' => $id,
            'associated_action' => $action
        );

        /* get user */
        $user = Authenticator::getUser();
        $data['user_id'] = $user->id;

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

        /* things */
        else if(in_array($type, array('offer','contract','todo','acceptance','invoice','reminder')))
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
     */
    public function getStream()
    {



    }

    /**
     * Deletes old stream entries
     */
    private function cleanUpOld()
    {
        //TODO
    }

}