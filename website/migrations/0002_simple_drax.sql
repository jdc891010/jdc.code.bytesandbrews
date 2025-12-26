CREATE TABLE `featured_spots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`coffee_shop_id` integer NOT NULL,
	`title` text,
	`description` text,
	`month` integer NOT NULL,
	`year` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`coffee_shop_id`) REFERENCES `coffee_shops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`url` text NOT NULL,
	`thumbnail_url` text,
	`entity_type` text NOT NULL,
	`entity_id` integer,
	`alt_text` text,
	`caption` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `specials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`coffee_shop_id` integer NOT NULL,
	`discount_type` text NOT NULL,
	`discount_value` integer,
	`original_price` integer,
	`special_price` integer,
	`terms` text,
	`image_url` text,
	`thumbnail_url` text,
	`is_active` integer DEFAULT true NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`display_on_homepage` integer DEFAULT true NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`coffee_shop_id`) REFERENCES `coffee_shops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `coffee_shops` ADD `opening_hours` text;--> statement-breakpoint
ALTER TABLE `coffee_shops` ADD `opens_at` text;--> statement-breakpoint
ALTER TABLE `coffee_shops` ADD `closes_at` text;--> statement-breakpoint
ALTER TABLE `coffee_shops` ADD `is_open_24_hours` integer DEFAULT false;