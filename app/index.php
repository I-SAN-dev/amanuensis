<?php
set_include_path(getcwd());

require_once 'classes/scripthandling/scriptLoader.php';
require_once 'classes/config/config.php';

$conf = Config::getInstance();
$headstuff = ScriptLoader::echoScripts(0);

?>
<html>
<head>
    <?php  echo $headstuff ?>
</head>
<body>
hello world lalala<br/>
<?php

echo $conf->get['path']['scriptsbytemplate'];

?>
</body>
</html>