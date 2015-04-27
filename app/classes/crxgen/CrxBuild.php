<?php
/**
 * Generates .crx Files
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Andrey Pashentsev
 * @copyright Andrey Pashentsev
 * @link https://github.com/andyps
 *
 * @license MIT
 */


class CrxBuild
{
    const CRX_FORMAT_VERSION = 2;
    private $_privateKey = null;
    private $_privateKeyDetails = null;
    private $_crxName = null;
    public function __construct($options)
    {
        self::checkRequirements();
        $this->_setOptions($options);
    }
    public static function checkRequirements()
    {
        $requirementFails = array();
        if (!extension_loaded('zlib')) {
            $requirementFails[] = "zlib extension";
        }
        if (!extension_loaded('openssl')) {
            $requirementFails[] = "openssl extension";
        }
        if ($requirementFails) {
            throw new Exception(
                'Requirements: ' . implode(', ', $requirementFails)
            );
        }
    }
    private function _setOptions($options)
    {
        $options['extension_dir'] = trim(@$options['extension_dir']);
        if (!isset($options['extension_dir'][0])) {
            throw new Exception('extension_dir is not set');
        }
        $options['key_file'] = trim(@$options['key_file']);
        if (!isset($options['key_file'][0])) {
            throw new Exception('key_file is not set');
        }

        $options['extension_dir'] = rtrim($options['extension_dir'], '\\/') . '/';
        $options['output_dir'] = trim(@$options['output_dir']);
        if (!isset($options['output_dir'][0])) {
            $options['output_dir'] = '.';
        }
        $options['output_dir'] = rtrim($options['output_dir'], '\\/') . '/';
        if (!isset($options['only_zip'])) {
            $options['only_zip'] = false;
        }
        $options['only_zip'] = (bool)$options['only_zip'];

        $this->_crxName = basename($options['extension_dir']);
        $this->options = $options;

    }
    public function zip($from, $to)
    {
        if (!is_dir($from) || !is_readable($from)) {
            throw new Exception(
                'Extension dir doesn\'t not exist or is not a readable directory'
            );
        }
        $outputDir = dirname($to);
        if (!is_dir($outputDir) || !is_writable($outputDir)) {
            throw new Exception(
                'Output dir doesn\'t not exist or is not a writable directory'
            );
        }
        $phar = new PharData($to, null, null, PHAR::ZIP);
        $phar->buildFromDirectory($from);
        $phar->compressFiles(PHAR::GZ);
        unset($phar);
        if (!file_exists($to)) {
            throw new Exception('Can\'t create zip file');
        }
        if (PHP_SAPI == 'cli') {
            echo "Zip file is created\n";
        }
    }
    public function getPublicDerKey()
    {
        $this->_readPrivateKey();
        $publicKeyPem = $this->_privateKeyDetails['key'];
        $publicKeyPemLines = explode("\n", trim($publicKeyPem));
        array_shift($publicKeyPemLines);
        array_pop($publicKeyPemLines);
        $publicKeyDer = implode("\n", $publicKeyPemLines);
        return base64_decode($publicKeyDer);
    }
    private function _readPrivateKey()
    {
        $keyFile = $this->options['key_file'];
        if (!is_file($keyFile) || !is_readable($keyFile)) {
            throw new Exception(
                'Private key file doesn\'t not exist or is not a readable file'
            );
        }
        $this->_privateKey = openssl_pkey_get_private(
            file_get_contents($keyFile)
        );
        if ($this->_privateKey) {
            $this->_privateKeyDetails = openssl_pkey_get_details(
                $this->_privateKey
            );
        }
        if (!$this->_privateKeyDetails) {
            throw new Exception('Wrong private key');
        }
    }
    public function build()
    {
        $sig = null;

        $zipFile = $this->options['output_dir'] . $this->_crxName . '.zip';
        $crxFile = $this->options['output_dir'] . $this->_crxName . '.crx';
        $this->zip($this->options['extension_dir'], $zipFile);
        if ($this->options['only_zip']) {
            return;
        }
        $publicKeyDer = $this->getPublicDerKey();

        $zipFileContent = file_get_contents($zipFile);
        openssl_sign(
            $zipFileContent, $sig, $this->_privateKey, OPENSSL_ALGO_SHA1
        );

        if (!$sig) {
            throw new Exception('Can\'t create a signature for zip file');
        }

        $cr24 = "\x43\x72\x32\x34";
        $publicKeyDerLen = strlen($publicKeyDer);
        $sigLen = strlen($sig);

        $crxHeader = $cr24 . pack(
                'VVV', self::CRX_FORMAT_VERSION, $publicKeyDerLen, $sigLen
            );

        $crx = "$crxHeader$publicKeyDer$sig$zipFileContent";
        file_put_contents($crxFile, $crx);
        if (PHP_SAPI == 'cli') {
            echo "Crx file is created\n";
        }
        openssl_pkey_free($this->_privateKey);
    }
}
