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
define("PROJECT_OFFER_SENT", 1);
define("PROJECT_CONTRACT_ADDED", 2);
define("PROJECT_TODOS_FULFILLED", 3);
define("PROJECT_ACCEPTANCE_SENT", 4);
define("PROJECT_INVOICE_SENT", 5);
define("PROJECT_INVOICE_OVERDUE", 6);
define("PROJECT_PAID_FINISHED", 7);

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