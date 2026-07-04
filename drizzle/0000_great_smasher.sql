CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `in_app_notification` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`listing_id` text NOT NULL,
	`read_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`listing_id`) REFERENCES `listing`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `notification_unique` ON `in_app_notification` (`vendor_id`,`listing_id`);--> statement-breakpoint
CREATE INDEX `notification_vendor_idx` ON `in_app_notification` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `notification_listing_idx` ON `in_app_notification` (`listing_id`);--> statement-breakpoint
CREATE TABLE `listing` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`part_type_id` text NOT NULL,
	`make_id` text,
	`model_id` text,
	`year` integer,
	`title` text NOT NULL,
	`description` text,
	`part_number` text NOT NULL,
	`sku` text NOT NULL,
	`condition` text DEFAULT 'new' NOT NULL,
	`price_cents` integer NOT NULL,
	`stock` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`part_type_id`) REFERENCES `part_type`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`make_id`) REFERENCES `make`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`model_id`) REFERENCES `model`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `listing_vendor_idx` ON `listing` (`vendor_id`);--> statement-breakpoint
CREATE INDEX `listing_part_type_idx` ON `listing` (`part_type_id`);--> statement-breakpoint
CREATE INDEX `listing_make_idx` ON `listing` (`make_id`);--> statement-breakpoint
CREATE INDEX `listing_model_idx` ON `listing` (`model_id`);--> statement-breakpoint
CREATE INDEX `listing_year_idx` ON `listing` (`year`);--> statement-breakpoint
CREATE INDEX `listing_part_number_idx` ON `listing` ("part_number" COLLATE NOCASE);--> statement-breakpoint
CREATE INDEX `listing_title_idx` ON `listing` (`title`);--> statement-breakpoint
CREATE TABLE `make` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`country` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `make_name_unique` ON `make` ("name" COLLATE NOCASE);--> statement-breakpoint
CREATE UNIQUE INDEX `make_slug_unique` ON `make` ("slug" COLLATE NOCASE);--> statement-breakpoint
CREATE TABLE `model` (
	`id` text PRIMARY KEY NOT NULL,
	`make_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`body_style` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`make_id`) REFERENCES `make`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `model_make_name_unique` ON `model` ("make_id" COLLATE NOCASE,"name" COLLATE NOCASE);--> statement-breakpoint
CREATE UNIQUE INDEX `model_make_slug_unique` ON `model` (`make_id`,"slug" COLLATE NOCASE);--> statement-breakpoint
CREATE INDEX `model_make_id_idx` ON `model` (`make_id`);--> statement-breakpoint
CREATE TABLE `part_type` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `part_type_name_unique` ON `part_type` ("name" COLLATE NOCASE);--> statement-breakpoint
CREATE UNIQUE INDEX `part_type_slug_unique` ON `part_type` ("slug" COLLATE NOCASE);--> statement-breakpoint
CREATE TABLE `saved_search` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_id` text NOT NULL,
	`name` text NOT NULL,
	`filters` text NOT NULL,
	`last_dispatched_at` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`vendor_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`role` text DEFAULT 'customer' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`business_name` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
