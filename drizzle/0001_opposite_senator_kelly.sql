CREATE TABLE `checkins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`venueId` int NOT NULL,
	`latitude` float NOT NULL,
	`longitude` float NOT NULL,
	`visibility` enum('public','friends','private') NOT NULL DEFAULT 'public',
	`text` varchar(240),
	`mood` varchar(60),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `checkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `venues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`name` varchar(180) NOT NULL,
	`category` varchar(80) NOT NULL,
	`address` varchar(255) NOT NULL,
	`district` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL DEFAULT 'Adana',
	`latitude` float NOT NULL,
	`longitude` float NOT NULL,
	`rating` float NOT NULL DEFAULT 0,
	`ratingCount` int NOT NULL DEFAULT 0,
	`checkinCount` int NOT NULL DEFAULT 0,
	`activityScore` int NOT NULL DEFAULT 0,
	`coverImageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `venues_id` PRIMARY KEY(`id`),
	CONSTRAINT `venues_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `checkins` ADD CONSTRAINT `checkins_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `checkins` ADD CONSTRAINT `checkins_venueId_venues_id_fk` FOREIGN KEY (`venueId`) REFERENCES `venues`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `checkins_venue_created_idx` ON `checkins` (`venueId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `checkins_user_created_idx` ON `checkins` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `venues_city_category_idx` ON `venues` (`city`,`category`);--> statement-breakpoint
CREATE INDEX `venues_activity_idx` ON `venues` (`activityScore`);