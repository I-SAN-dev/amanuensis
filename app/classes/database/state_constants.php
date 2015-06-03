<?php
/**
 * Defines the state-constants for the data model
 * see http://wiki.ama.i-san.de/doku.php?id=info:statuscodes for further definitions
 *
 * This file is part of the project codename "AMANUENSIS"
 *
 * @author Sebastian Antosch <s.antosch@i-san.de>
 * @copyright 2015 I-SAN.de Webdesign & Hosting GbR
 * @link http://i-san.de
 *
 * @license GPL
 */


/**
 * project
 */
define("PROJECT_CREATED", 0);
define("PROJECT_WAITING", 1);
define("PROJECT_TODO", 2);
define("PROJECT_WAITING_OVERDUE", 3);
define("PROJECT_TODO_OVERDUE", 4);
//define("PROJECT_INVOICE_SENT", 5);
//define("PROJECT_INVOICE_OVERDUE", 6);
define("PROJECT_FINISHED", 7);
define("PROJECT_ARCHIVED", 8);

/**
 * global
 */
define("CREATED", 0);
define("PDF_GENERATED", 1);
define("PDF_SENT", 2);
define("CLIENT_ACCEPTED", 3);
define("CLIENT_DECLINED", -1);

/**
 * invoice special
 */
define("INVOICE_PAID", 3);
define("INVOICE_OVERDUE", 4);
define("INVOICE_OVERDUE_REMINDER_CREATED", 5);

/**
 * ToDo special
 */
define("TODO_TODO", 0);
define("TODO_FINISHED", 1);
define("TODO_OVERDUE", 2);