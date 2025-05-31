import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

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

export const ordersTable = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number").unique().notNull(),
  orderDate: text("order_date").notNull(),
  status: text("status").notNull(),
  customerId: integer("cust_id")
    .notNull()
    .references(() => customerTable.id),
});

const orderStatuses = ["pending", "paid", "cancelled"] as const;
type OrderStatus = (typeof orderStatuses)[number];

export const pendingOrdersTable = sqliteTable("pending_orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  addedDate: text("order_added_date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  status: text("status", { enum: orderStatuses }).notNull(),
  customerId: integer("cust_id")
    .notNull()
    .references(() => customerTable.id, { onDelete: "cascade" }),
});

export const customerRelations = relations(customerTable, ({ many }) => ({
  bankDetails: many(customerBankDetails),
  orders: many(ordersTable),
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

export const orderRelations = relations(ordersTable, ({ one }) => ({
  customer: one(customerTable, {
    fields: [ordersTable.customerId],
    references: [customerTable.id],
  }),
}));
