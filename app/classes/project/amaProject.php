<?php
/**
 * Holds functions for Project Handling
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
require_once('classes/errorhandling/amaException.php');
require_once('classes/config/config.php');

class AmaProject {

    public function __construct($id)
    {
        $this->id = $id;
        $this->dbal = DBAL::getInstance();
        $data = $this->dbal->simpleSelect(
            'projects',
            array('name', 'description', 'client', 'state'),
            array('id', $this->id),
            1);
        $this->name = $data['name'];
        $this->description = $data['description'];
        $this->clientid = $data['client'];
        var_dump($data);
        $this->state = $data['state'];
    }

    /**
     * Returns an array that represents the associated client
     * @return array
     */
    public function getClient()
    {
        if(!isset($this->client))
        {
            $this->client = $this->dbal->simpleSelect(
                'customers',
                array('id', 'refnumber', 'companyname', 'contact_gender', 'contact_firstname', 'contact_lastname', 'street_no', 'additional', 'zip', 'city', 'country'),
                array('id', $this->clientid),
                1);
        }
        return $this->client;
    }

}