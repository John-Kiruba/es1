import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const customerTable = sqliteTable("customer_table", {
  id: integer("cust_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  address: text("address"),
  age: integer("age"),
  phone: text("phone_number"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_DATE`),
});

export const customerBankDetails = sqliteTable("customer_bank_details", {
  id: integer("cust_bank_details_id").primaryKey({ autoIncrement: true }),
  cardNumber: text("card_number").notNull().unique(),
  expiryDate: text("expiry_date").notNull(),
  cvv: text("cvv").notNull(), // "YYYY-MM"

  customerId: integer("cust_id")
    .notNull()
    .references(() => customerTable.id),
});

export const customerRelations = relations(customerTable, ({ many }) => ({
  bankDetails: many(customerBankDetails),
}));

export const bankDetailsRelations = relations(
  customerBankDetails,
  ({ one }) => ({
    customer: one(customerTable, {
      fields: [customerBankDetails.customerId],
      references: [customerTable.id],
    }),
  })
);

export const ordersTable = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number").unique().notNull(),
  customerId: integer("cust_id")
    .notNull()
    .references(() => customerTable.id),
});
