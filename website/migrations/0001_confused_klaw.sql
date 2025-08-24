PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_coffee_shops` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`postal_code` text,
	`latitude` text,
	`longitude` text,
	`website` text,
	`phone_number` text,
	`rating` text,
	`google_places_id` text,
	`wifi_speed` integer,
	`image_url` text,
	`thumbnail_url` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_coffee_shops`("id", "name", "description", "address", "city", "country", "postal_code", "latitude", "longitude", "website", "phone_number", "rating", "google_places_id", "wifi_speed", "image_url", "thumbnail_url", "created_at", "updated_at") SELECT "id", "name", "description", "address", "city", "country", "postal_code", "latitude", "longitude", "website", "phone_number", "rating", "google_places_id", "wifi_speed", "image_url", "thumbnail_url", "created_at", "updated_at" FROM `coffee_shops`;--> statement-breakpoint
DROP TABLE `coffee_shops`;--> statement-breakpoint
ALTER TABLE `__new_coffee_shops` RENAME TO `coffee_shops`;--> statement-breakpoint
PRAGMA foreign_keys=ON;