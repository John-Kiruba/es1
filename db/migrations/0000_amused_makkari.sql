CREATE TABLE `customer_bank_details` (
	`cust_bank_details_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`card_number` text NOT NULL,
	`expiry_date` text NOT NULL,
	`cvv` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_bank_details_card_number_unique` ON `customer_bank_details` (`card_number`);--> statement-breakpoint
CREATE TABLE `customer_table` (
	`cust_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`address` text,
	`age` integer,
	`phone_number` text,
	`created_at` text DEFAULT CURRENT_DATE NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customer_table_email_unique` ON `customer_table` (`email`);