CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_number` text NOT NULL,
	`order_date` text NOT NULL,
	`status` text NOT NULL,
	`cust_id` integer NOT NULL,
	FOREIGN KEY (`cust_id`) REFERENCES `customer_table`(`cust_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `pending_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_added_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`status` text NOT NULL,
	`cust_id` integer NOT NULL,
	FOREIGN KEY (`cust_id`) REFERENCES `customer_table`(`cust_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `customer_bank_details` ADD `cust_id` integer NOT NULL REFERENCES customer_table(cust_id);