<?php
set_include_path(getcwd());

require_once 'classes/scripthandling/scriptLoader.php';
require_once 'classes/config/config.php';

$conf = Config::getInstance();
$headstuff = ScriptLoader::echoScripts($conf->get['debug']);

?>
<html>
<head>
    <?php  echo $headstuff ?>
</head>
<body>
hello world<br/>
<?php

echo $conf->get['path']['scriptsbytemplate'];

?>
</body>
</html>