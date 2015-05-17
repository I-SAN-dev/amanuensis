<?php
/**
 * Handles the FileContracts
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

require_once('classes/database/dbal.php');
require_once('classes/errorhandling/amaException.php');
require_once('classes/authentication/authenticator.php');
require_once('classes/project/amaProject.php');

class fileContract {

    /**
     * This method reacts to GET Requests,
     * the upload method uses POST with GET parameters, we can not surely know, where it arrives (server dependent i think)
     */
    public static function get()
    {
        Authenticator::onlyFor(0, 1);

        if(isset($_GET['id']) && $_GET['id'] != '')
        {
            self::getFileContract($_GET["id"]);
        }
        else if(isset($_GET["uploadfor"]) && $_GET["uploadfor"] != '')
        {
            self::uploadFile($_GET["uploadfor"]);
        }
        else
        {
            self::getFileContractList();
        }
    }


    /**
     * This methods reacts to POST Requests
     * the upload method uses POST with GET parameters, we can not surely know, where it arrives (server dependent i think)
     */
    public static function post()
    {
        Authenticator::onlyFor(0);

        if(isset($_GET["uploadfor"]) && $_GET["uploadfor"] != '')
        {
            self::uploadFile($_GET["uploadfor"]);
        }
        else if(isset($_POST["uploadfor"]) && $_POST["uploadfor"] != '')
        {
            self::uploadFile($_POST["uploadfor"]);
        }
        else if( !isset($_POST["id"]) || $_POST["id"]=='')
        {
            self::createFileContract();
        }
        else
        {
            self::modifyFileContract();
        }
    }

    /**
     * This methods reacts to DELETE Requests
     */
    public static function delete($_DELETE)
    {
        Authenticator::onlyFor(0);

        if(!isset($_DELETE["id"]) || $_DELETE["id"]=='')
        {
            $error = new amaException(NULL, 400, "No id specified");
            $error->renderJSONerror();
            $error->setHeaders();
        }
        else
        {
            self::deleteFileContract($_DELETE);
        }
    }

    /**
     * Gets a list of all FileContracts
     */
    private static function getFileContractList()
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'fileContracts',
            array(
                'id',
                'name',
                'description',
                'project',
                'path'
            )
        );
        json_response($result);
    }

    /**
     * Gets a single FileContract
     * @param $id - the id of the FileContract to get
     */
    private static function getFileContract($id)
    {
        $dbal = DBAL::getInstance();
        $result = $dbal->simpleSelect(
            'fileContracts',
            array(
                'id',
                'name',
                'description',
                'project',
                'path'
            ),
            array('id', $id),
            1
        );

        /* Add project data */
        $project = new AmaProject($result['project']);
        $result['project'] = $project->getProjectData();

        json_response($result);
    }

    /**
     * creates a new FileContract
     */
    private static function createFileContract()
    {
        $dbal = DBAL::getInstance();
        $id = $dbal->dynamicInsert(
            'fileContracts',
            array(
                'name',
                'description',
                'project',
                'path'
            ),
            $_POST
        );
        self::getFileContract($id);
    }

    /**
     * modifies a FileContract
     */
    private static function modifyFileContract()
    {
        $dbal = DBAL::getInstance();
        $affectedid = $dbal->dynamicUpdate(
            'fileContracts',
            array('id', $_POST["id"]),
            array(
                'name',
                'description',
                'path'
            ),
            $_POST);
        self::getFileContract($affectedid);
    }

    /**
     * Saves a file
     * @param $for - the id of the contract to save for
     * @throws Exception
     */
    private static function uploadfile($for)
    {
        if(isset($_FILES) && isset($_FILES['file']))
        {
            $filename = basename($_FILES['file']['name']);

            /* Generate the path */
            $today = new DateTime();
            $year = $today->format('Y');
            $month = $today->format('m');

            $path = 'archive/'.$year.'/'.$month.'/'.'fileContract';

            /* Check if path is existent, if not, generate it */
            if(!file_exists($path))
            {
                if(!mkdir($path, 0777, true))
                {
                    throw new Exception('Path "'.$path.'" cannot be generated', 500);
                }
            }

            /* sanitize filename */

            // Remove anything except letters, numbers, period, hyphen, underscore
            $filename = preg_replace('/[^a-zA-Z0-9-_\.]/','', $filename);
            // Remove any runs of periods
            $filename = preg_replace("([\.]{2,})", '', $filename);

            $savepath = $path.'/'.$for.'_'.$filename;


            /* Check for errors */
            $error = $_FILES['file']['error'];
            if($error == 1 || $error == 2)
            {
                $error = new amaException(NULL, 400, "File to big","upload.toBig");
                $error->renderJSONerror();
                $error->setHeaders();
            }
            if($error == 3)
            {
                $error = new amaException(NULL, 400, "File only transferred partially","upload.partial");
                $error->renderJSONerror();
                $error->setHeaders();
            }
            if($error == 4)
            {
                $error = new amaException(NULL, 400, "No file was uploaded","upload.noFile");
                $error->renderJSONerror();
                $error->setHeaders();
            }
            if($error >= 4)
            {
                $error = new amaException(NULL, 400, "There was another error(UPLOAD_ERROR: ".$error.")","upload.server");
                $error->renderJSONerror();
                $error->setHeaders();
            }

            /* Check if PDF */
            $finfo = finfo_open(FILEINFO_MIME_TYPE); // return mime type ala mimetype extension
            $mime = finfo_file($finfo, $_FILES['file']['tmp_name']);
            finfo_close($finfo);

            if($_FILES['file']['type'] != 'application/pdf' || $mime != 'application/pdf')
            {
                $error = new amaException(NULL, 400, "Only PDFs allowed", 'upload.onlyPDF');
                $error->renderJSONerror();
                $error->setHeaders();
            }

            /* Check if has size */
            if(!$_FILES['file']['size'] > 0)
            {
                $error = new amaException(NULL, 400, "File has length 0", 'upload.noFile');
                $error->renderJSONerror();
                $error->setHeaders();
            }

            /* Check if file already exists */
            if(file_exists($savepath))
            {
                $error = new amaException(NULL, 400, "File ".$savepath." already exists", "upload.alreadyExists");
                $error->renderJSONerror();
                $error->setHeaders();
            }

            /* Get the file content */
            $data = file_get_contents($_FILES['file']['tmp_name']);
            if(!$data)
            {
                $error = new amaException(NULL, 500, "Error reading tmp file");
                $error->renderJSONerror();
                $error->setHeaders();
            }


            /* Save the file */
            if(!file_put_contents($savepath, $data, LOCK_EX))
            {
                $error = new amaException(NULL, 500, "Error writing file ".$savepath);
                $error->renderJSONerror();
                $error->setHeaders();
            }

            $dbal = DBAL::getInstance();
            $dbal->dynamicUpdate(
                'fileContracts',
                array('id', $for),
                array('path'),
                array('path'=>$savepath)
            );

            json_response(array(
               "path" => $savepath
            ));

        }
        else
        {
            $error = new amaException(NULL, 400, "No file supplied");
            $error->renderJSONerror();
            $error->setHeaders();
        }


    }

    /**
     * deletes a FileContract
     * @param $_DELETE
     */
    private static function deleteFileContract($_DELETE)
    {
        $dbal = DBAL::getInstance();

        // TODO: delete file

        try
        {
            $count = $dbal->deleteRow('fileContracts', array('id', $_DELETE['id']));
        }
        catch(Exception $e)
        {
            $error = new amaException($e);
            $error->renderJSONerror();
            $error->setHeaders();
            die();
        }

        if($count)
        {
            self::getFileContractList();
        }
        else
        {
            $error = new amaException(NULL, 404, "There was no FileContract matching your criteria");
            $error->renderJSONerror();
            $error->setHeaders();
        }
    }

}