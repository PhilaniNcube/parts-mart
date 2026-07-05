CREATE TABLE `listing_year` (
	`listing_id` text NOT NULL,
	`year` integer NOT NULL,
	PRIMARY KEY(`listing_id`, `year`),
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `listing_year_id_idx` ON `listing_year` (`listing_id`);--> statement-breakpoint
CREATE INDEX `listing_year_year_idx` ON `listing_year` (`year`);--> statement-breakpoint
DROP INDEX `listing_year_idx`;--> statement-breakpoint
ALTER TABLE `listing` DROP COLUMN `year`;--> statement-breakpoint
ALTER TABLE `user` ADD `city` text;