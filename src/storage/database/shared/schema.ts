import { pgTable, serial, timestamp, varchar, text, numeric, boolean, jsonb, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
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

const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({ coerce: { date: true } });
export const insertInquirySchema = createCoercedInsertSchema(inquiries).pick({
	name: true,
	email: true,
	phone: true,
	company: true,
	subject: true,
	message: true,
	product_id: true,
	inquiry_type: true,
});
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
