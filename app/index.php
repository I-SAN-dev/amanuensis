<?php

require_once 'classes/scripthandling/scriptLoader.php';
require_once 'classes/config/config.php';

$headstuff = ScriptLoader::echoScripts(true);

?>
<html>
<head>
    <?php  //echo $headstuff ?>
</head>
<body>
hello world<br/>
<?php
$conf = Config::getInstance();
echo $conf->get['path']['scriptsbytemplate'];

?>
</body>
</html>