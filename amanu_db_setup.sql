-- amanu MySQL DB setup file for amanu version 1.0.0-rc1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `acceptances`
--

DROP TABLE IF EXISTS `acceptances`;
CREATE TABLE IF NOT EXISTS `acceptances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `project` int(11) NOT NULL,
  `state` int(11) DEFAULT '0',
  `path` varchar(255) DEFAULT NULL,
  `refnumber` varchar(255) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `acceptances_fk_project` (`project`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `contracts`
--

DROP TABLE IF EXISTS `contracts`;
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `project` int(11) NOT NULL,
  `refnumber` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `contracts_fk_project` (`project`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyname` varchar(255) DEFAULT NULL,
  `contact_firstname` varchar(255) DEFAULT NULL,
  `contact_lastname` varchar(255) DEFAULT NULL,
  `street_no` varchar(255) DEFAULT NULL,
  `additional` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `comment` text,
  `contact_gender` char(1) DEFAULT NULL,
  `refnumber` varchar(255) NOT NULL,
  `hourlyrate` decimal(10,2) DEFAULT NULL,
  `dailyrate` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=44 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customers_customer_category_mm`
--

DROP TABLE IF EXISTS `customers_customer_category_mm`;
CREATE TABLE IF NOT EXISTS `customers_customer_category_mm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `customers_customer_category_mm_fk_customer` (`customer_id`),
  KEY `customers_customer_category_mm_fk_category` (`category_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=41 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer_category`
--

DROP TABLE IF EXISTS `customer_category`;
CREATE TABLE IF NOT EXISTS `customer_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `customer_data`
--

DROP TABLE IF EXISTS `customer_data`;
CREATE TABLE IF NOT EXISTS `customer_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `datatype` varchar(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `customer` int(11) NOT NULL,
  `isdefault` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `customer_data_fk_customer` (`customer`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `fileContracts`
--

DROP TABLE IF EXISTS `fileContracts`;
CREATE TABLE IF NOT EXISTS `fileContracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `project` int(11) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `fileContracts_fk_project` (`project`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `refnumber` varchar(255) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `project` int(11) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `invoices_fk_project` (`project`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `fixedrate` decimal(10,2) DEFAULT NULL,
  `hourlyrates` decimal(10,2) DEFAULT NULL,
  `dailyrates` decimal(10,2) DEFAULT NULL,
  `userate` int(11) NOT NULL DEFAULT '0',
  `offer` int(11) DEFAULT NULL,
  `contract` int(11) DEFAULT NULL,
  `todo` int(11) DEFAULT NULL,
  `acceptance` int(11) DEFAULT NULL,
  `invoice` int(11) DEFAULT NULL,
  `todo_done` tinyint(1) NOT NULL DEFAULT '0',
  `todo_order` int(11) NOT NULL DEFAULT '0',
  `global_order` int(11) NOT NULL DEFAULT '0',
  `hourlyrate` decimal(10,2) DEFAULT NULL,
  `dailyrate` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `fk_items_offer` (`offer`),
  KEY `fk_items_contract` (`contract`),
  KEY `fk_items_todo` (`todo`),
  KEY `fk_items_acceptance` (`acceptance`),
  KEY `fk_items_invoice` (`invoice`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=37 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `item_presets`
--

DROP TABLE IF EXISTS `item_presets`;
CREATE TABLE IF NOT EXISTS `item_presets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext,
  `fixedrate` decimal(10,2) DEFAULT NULL,
  `hourlyrates` decimal(10,2) DEFAULT NULL,
  `dailyrates` decimal(10,2) DEFAULT NULL,
  `userate` int(11) NOT NULL DEFAULT '0',
  `hourlyrate` decimal(10,2) DEFAULT NULL,
  `dailyrate` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `offers`
--

DROP TABLE IF EXISTS `offers`;
CREATE TABLE IF NOT EXISTS `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `project` int(11) NOT NULL,
  `refnumber` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `offers_fk_project` (`project`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `client` int(11) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `projects_fk_customer` (`client`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reminders`
--

DROP TABLE IF EXISTS `reminders`;
CREATE TABLE IF NOT EXISTS `reminders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` longtext,
  `refnumber` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  `invoice` int(11) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `reminders_fk_invoice` (`invoice`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `stream`
--

DROP TABLE IF EXISTS `stream`;
CREATE TABLE IF NOT EXISTS `stream` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) DEFAULT NULL,
  `associated_type` varchar(255) NOT NULL,
  `associated_id` int(11) NOT NULL,
  `associated_title` varchar(255) NOT NULL,
  `client_id` int(11) NOT NULL,
  `associated_action` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=211 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `time`
--

DROP TABLE IF EXISTS `time`;
CREATE TABLE IF NOT EXISTS `time` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) DEFAULT NULL,
  `start` datetime NOT NULL,
  `end` datetime DEFAULT NULL,
  `item` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `fk_time_users_user` (`user`),
  KEY `fk_time_items_item` (`item`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=26 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todos`
--

DROP TABLE IF EXISTS `todos`;
CREATE TABLE IF NOT EXISTS `todos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `due` date DEFAULT NULL,
  `project` int(11) NOT NULL,
  `state` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  KEY `todos_fk_project` (`project`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `created` int(11) NOT NULL,
  `last_failed_login_attempt` int(11) DEFAULT NULL,
  `password` char(64) NOT NULL,
  `accessgroup` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `acceptances`
--
ALTER TABLE `acceptances`
ADD CONSTRAINT `acceptances_fk_project` FOREIGN KEY (`project`) REFERENCES `projects` (`id`);

--
-- Constraints der Tabelle `contracts`
--
ALTER TABLE `contracts`
ADD CONSTRAINT `contracts_fk_project` FOREIGN KEY (`project`) REFERENCES `projects` (`id`);

--
-- Constraints der Tabelle `customers_customer_category_mm`
--
ALTER TABLE `customers_customer_category_mm`
ADD CONSTRAINT `customers_customer_category_mm_fk_category` FOREIGN KEY (`category_id`) REFERENCES `customer_category` (`id`) ON DELETE CASCADE,
ADD CONSTRAINT `customers_customer_category_mm_fk_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints der Tabelle `customer_data`
--
ALTER TABLE `customer_data`
ADD CONSTRAINT `customer_data_fk_customer` FOREIGN KEY (`customer`) REFERENCES `customers` (`id`);

--
-- Constraints der Tabelle `fileContracts`
--
ALTER TABLE `fileContracts`
ADD CONSTRAINT `fileContracts_fk_project` FOREIGN KEY (`project`) REFERENCES `projects` (`id`);

--
-- Constraints der Tabelle `invoices`
--
ALTER TABLE `invoices`
ADD CONSTRAINT `invoices_fk_project` FOREIGN KEY (`project`) REFERENCES `projects` (`id`);

--
-- Constraints der Tabelle `items`
--
ALTER TABLE `items`
ADD CONSTRAINT `fk_items_acceptance` FOREIGN KEY (`acceptance`) REFERENCES `acceptances` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_items_contract` FOREIGN KEY (`contract`) REFERENCES `contracts` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_items_invoice` FOREIGN KEY (`invoice`) REFERENCES `invoices` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_items_offer` FOREIGN KEY (`offer`) REFERENCES `offers` (`id`) ON DELETE SET NULL,
ADD CONSTRAINT `fk_items_todo` FOREIGN KEY (`todo`) REFERENCES `todos` (`id`) ON DELETE SET NULL;

--
-- Constraints der Tabelle `offers`
--
ALTER TABLE `offers`
ADD CONSTRAINT `offers_fk_project` FOREIGN KEY (`project`) REFERENCES `projects` (`id`);

--
-- Constraints der Tabelle `projects`
--
ALTER TABLE `projects`
ADD CONSTRAINT `projects_fk_customer` FOREIGN KEY (`client`) REFERENCES `customers` (`id`);

--
-- Constraints der Tabelle `reminders`
--
ALTER TABLE `reminders`
ADD CONSTRAINT `reminders_fk_invoice` FOREIGN KEY (`invoice`) REFERENCES `invoices` (`id`);

--
-- Constraints der Tabelle `time`
--
ALTER TABLE `time`
ADD CONSTRAINT `fk_time_items_item` FOREIGN KEY (`item`) REFERENCES `items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `fk_time_users_user` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints der Tabelle `todos`
--
ALTER TABLE `todos`
ADD CONSTRAINT `todos_fk_project` FOREIGN KEY (`project`) REFERENCES `projects` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;