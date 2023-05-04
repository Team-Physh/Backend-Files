# Table For Fish Data 
CREATE TABLE `fishtotal` (
  `catch_id` int NOT NULL AUTO_INCREMENT,
  `pit` varchar(16) NOT NULL,
  `hex` bigint NOT NULL,
  `lastCaught` datetime NOT NULL,
  `species` varchar(3) NOT NULL,
  `length` double NOT NULL,
  `riverMile` double NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`catch_id`),
  UNIQUE KEY `catch_id_UNIQUE` (`catch_id`)
);