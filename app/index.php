<?php

require_once 'classes/scripthandling/scriptLoader.php';

$headstuff = ScriptLoader::echoScripts(true);

?>
<html>
<head>
    <?php echo $headstuff ?>
</head>
<body>
hello world
</body>
</html>