import { pgTable, serial, timestamp, varchar, text, numeric, boolean, jsonb, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { z } from "zod"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const categories = pgTable(
	"categories",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		name: varchar("name", { length: 100 }).notNull(),
		slug: varchar("slug", { length: 100 }).notNull().unique(),
		description: text("description"),
		image_url: text("image_url"),
		sort_order: integer("sort_order").default(0).notNull(),
		is_active: boolean("is_active").default(true).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("categories_slug_idx").on(table.slug),
		index("categories_sort_order_idx").on(table.sort_order),
	]
);

export const products = pgTable(
	"products",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		name: varchar("name", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 255 }).notNull().unique(),
		brand: varchar("brand", { length: 100 }).notNull(),
		category_id: varchar("category_id", { length: 36 }).notNull().references(() => categories.id),
		price: numeric("price", { precision: 10, scale: 2 }).notNull(),
		compare_at_price: numeric("compare_at_price", { precision: 10, scale: 2 }),
		description: text("description"),
		short_description: text("short_description"),
		images: jsonb("images").$type<string[]>(),
		specifications: jsonb("specifications").$type<Record<string, string>>(),
		features: jsonb("features").$type<string[]>(),
		stock_status: varchar("stock_status", { length: 20 }).default("in_stock").notNull(),
		is_bestseller: boolean("is_bestseller").default(false).notNull(),
		is_new_arrival: boolean("is_new_arrival").default(false).notNull(),
		is_featured: boolean("is_featured").default(false).notNull(),
		is_active: boolean("is_active").default(true).notNull(),
		sort_order: integer("sort_order").default(0).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("products_slug_idx").on(table.slug),
		index("products_category_id_idx").on(table.category_id),
		index("products_brand_idx").on(table.brand),
		index("products_price_idx").on(table.price),
		index("products_is_active_idx").on(table.is_active),
		index("products_is_bestseller_idx").on(table.is_bestseller),
		index("products_is_new_arrival_idx").on(table.is_new_arrival),
		index("products_created_at_idx").on(table.created_at),
	]
);

export const inquiries = pgTable(
	"inquiries",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		name: varchar("name", { length: 100 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		phone: varchar("phone", { length: 50 }),
		company: varchar("company", { length: 200 }),
		subject: varchar("subject", { length: 255 }),
		message: text("message").notNull(),
		product_id: varchar("product_id", { length: 36 }).references(() => products.id),
		inquiry_type: varchar("inquiry_type", { length: 20 }).default("general").notNull(),
		status: varchar("status", { length: 20 }).default("pending").notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("inquiries_email_idx").on(table.email),
		index("inquiries_status_idx").on(table.status),
		index("inquiries_created_at_idx").on(table.created_at),
		index("inquiries_product_id_idx").on(table.product_id),
	]
);

export const orders = pgTable(
	"orders",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		order_id: varchar("order_id", { length: 100 }).notNull().unique(),
		product_id: varchar("product_id", { length: 36 }).notNull().references(() => products.id),
		product_name: varchar("product_name", { length: 255 }).notNull(),
		quantity: integer("quantity").notNull().default(1),
		amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
		currency: varchar("currency", { length: 10 }).default("USD").notNull(),
		payer_email: varchar("payer_email", { length: 255 }),
		payer_name: varchar("payer_name", { length: 200 }),
		paypal_order_id: varchar("paypal_order_id", { length: 100 }),
		stripe_session_id: varchar("stripe_session_id", { length: 255 }),
		stripe_payment_intent_id: varchar("stripe_payment_intent_id", { length: 255 }),
		airwallex_intent_id: varchar("airwallex_intent_id", { length: 100 }),
		payment_method: varchar("payment_method", { length: 20 }).default("paypal").notNull(),
		payment_status: varchar("payment_status", { length: 30 }).default("unpaid").notNull(),
		shipping_method: varchar("shipping_method", { length: 50 }),
		shipping_cost: numeric("shipping_cost", { precision: 10, scale: 2 }),
		tracking_number: varchar("tracking_number", { length: 200 }),
		status: varchar("status", { length: 20 }).default("pending").notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("orders_order_id_idx").on(table.order_id),
		index("orders_product_id_idx").on(table.product_id),
		index("orders_status_idx").on(table.status),
		uniqueIndex("orders_paypal_order_id_unique").on(table.paypal_order_id),
		uniqueIndex("orders_stripe_session_id_unique").on(table.stripe_session_id),
		index("orders_stripe_payment_intent_id_idx").on(table.stripe_payment_intent_id),
		index("orders_airwallex_intent_id_idx").on(table.airwallex_intent_id),
		index("orders_payment_method_idx").on(table.payment_method),
		index("orders_created_at_idx").on(table.created_at),
	]
);

export const users = pgTable(
	"users",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		email: varchar("email", { length: 255 }).notNull().unique(),
		password_hash: varchar("password_hash", { length: 255 }).notNull(),
		name: varchar("name", { length: 100 }).notNull(),
		role: varchar("role", { length: 20 }).default("staff").notNull(),
		permissions: jsonb("permissions").$type<string[]>().default([]),
		is_active: boolean("is_active").default(true).notNull(),
		last_login_at: timestamp("last_login_at", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("users_email_idx").on(table.email),
		index("users_role_idx").on(table.role),
	]
);

export const shipping_templates = pgTable(
	"shipping_templates",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		name: varchar("name", { length: 100 }).notNull(),
		zone: varchar("zone", { length: 200 }).notNull(),
		method: varchar("method", { length: 50 }).notNull(),
		weight_rate: jsonb("weight_rate").$type<Record<string, number>>(),
		volume_rate: jsonb("volume_rate").$type<Record<string, number>>(),
		fixed_fee: numeric("fixed_fee", { precision: 10, scale: 2 }),
		free_shipping_min: numeric("free_shipping_min", { precision: 10, scale: 2 }),
		trade_terms: varchar("trade_terms", { length: 20 }).default("DDP"),
		is_active: boolean("is_active").default(true).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("shipping_templates_zone_idx").on(table.zone),
		index("shipping_templates_method_idx").on(table.method),
	]
);

export const insertInquirySchema = z.object({
	name: z.string().max(100),
	email: z.string().max(255),
	phone: z.string().max(50).optional(),
	company: z.string().max(200).optional(),
	subject: z.string().max(255).optional(),
	message: z.string(),
	product_id: z.string().max(36).optional(),
	inquiry_type: z.string().max(20).default("general"),
});
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export const rfqRequests = pgTable(
	"rfq_requests",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		rfq_number: varchar("rfq_number", { length: 20 }).notNull().unique(),
		product_name: varchar("product_name", { length: 255 }),
		product_slug: varchar("product_slug", { length: 255 }),
		quantity: integer("quantity").notNull(),
		target_price: numeric("target_price", { precision: 10, scale: 2 }),
		intended_use: text("intended_use"),
		company_name: varchar("company_name", { length: 200 }).notNull(),
		contact_name: varchar("contact_name", { length: 100 }).notNull(),
		country: varchar("country", { length: 100 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		phone: varchar("phone", { length: 50 }).notNull(),
		whatsapp: varchar("whatsapp", { length: 50 }),
		message: text("message"),
		accept_marketing: boolean("accept_marketing").default(false),
		status: varchar("status", { length: 20 }).default("pending").notNull(),
		assigned_to: varchar("assigned_to", { length: 100 }),
		notes: text("notes"),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("idx_rfq_status").on(table.status),
		index("idx_rfq_created").on(table.created_at),
		index("idx_rfq_email").on(table.email),
	]
);

export const productTiers = pgTable(
	"product_tiers",
	{
		id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
		product_slug: varchar("product_slug", { length: 255 }).notNull(),
		tier_min: integer("tier_min").notNull(),
		tier_max: integer("tier_max"),
		discount_percent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull(),
		tier_label: varchar("tier_label", { length: 50 }),
		is_active: boolean("is_active").default(true).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("idx_tiers_product").on(table.product_slug),
	]
);

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type User = typeof users.$inferSelect;
export type ShippingTemplate = typeof shipping_templates.$inferSelect;
export type RfqRequest = typeof rfqRequests.$inferSelect;
export type ProductTier = typeof productTiers.$inferSelect;
