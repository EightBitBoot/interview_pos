import { relations, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { z } from "zod";

import type { AnyPgColumn } from "drizzle-orm/pg-core";

import { createUpdateSchema } from 'drizzle-zod';
import { users } from "./authSchema";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 *
 * NOTE(Adin): Every attempt at deduplicating this failed with
 * 'ReferenceError: Cannot access 'clockedInIntervals' before initialization'
 */
export const createTable = pgTableCreator((name) => `interview_pos_${name}`);

const idColumn = {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
};

export const restaurants = createTable(
  "restaurant",
  {
    ...idColumn,

    name: varchar("name", { length: 1024 }).notNull(),
    currentMenuId: integer("current_menu_id").references((): AnyPgColumn => menus.id),
  }
);
export type Restaurant = InferSelectModel<typeof restaurants>;
export type RestaurantWithEverything = { menus: MenuWithItemsAndAddons[] } & Restaurant;

export const restaurantRelations = relations(restaurants, ({ many }) => ({
  employees: many(users),
  menus: many(menus)
}));


export const clockedInIntervals = createTable(
  "clocked_in_interval",
  {
    ...idColumn,

    employeeId: varchar("employee_id", {length: 255}).references(() => users.id).notNull(),
    timeIn: timestamp("time_in").notNull(),
    timeOut: timestamp("time_out"), // If timeOut is null, the employee is still clocked in
  }
)
export type ClockedInInterval = InferSelectModel<typeof clockedInIntervals>;

export const clockedInIntervalsRelations = relations(clockedInIntervals, ({ one }) => ({
  employee: one(users, {
    fields: [clockedInIntervals.employeeId],
    references: [users.id],
  })
}))

export const menus = createTable(
  "menu",
  {
    ...idColumn,

    restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
  }
);
export type Menu = InferSelectModel<typeof menus>;
export type MenuWithItems = { items: Item[] } & Menu
export type MenuWithItemsAndAddons = { items: ItemWithAddons[] } & Menu

export const menusRelations = relations(menus, ({ one, many }) => ({
  restaurants: one(restaurants, {
    fields: [menus.restaurantId],
    references: [restaurants.id],
  }),

  items: many(items)
}));

export const items = createTable(
  "item",
  {
    ...idColumn,

    menuId: integer("menu_id").references(() => menus.id).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    basePrice: integer("base_price").notNull().default(0),
  }
);
export type Item = InferSelectModel<typeof items>;
export type ItemWithAddons = {
  addons: Addon[],
} & Item;
export const itemUpdateZodSchema = createUpdateSchema(items).extend({ id: z.number() });

export const itemsRelations = relations(items, ({ one, many }) => ({
  menus: one(menus, {
    fields: [items.menuId],
    references: [menus.id],
  }),

  addons: many(addons),
}));

export const addons = createTable(
  "addon",
  {
    ...idColumn,

    itemId: integer("item_id").references(() => items.id).notNull(),
    name: varchar("name", { length: 255 }),
    price: integer("price").notNull().default(0),
  }
)
export type Addon = InferSelectModel<typeof addons>;

export const addonRelations = relations(addons, ({ one }) => ({
  items: one(items, {
    fields: [addons.itemId],
    references: [items.id],
  })
}));

export const transactions = createTable(
  "transaction",
  {
    ...idColumn,

    restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
    employeeId: integer("employee_id").references(() => employees.id).notNull(),
    timestamp: timestamp("timestamp").notNull(),
    tipAmount: integer("tip_amount").notNull().default(0),
  });
export type Transaction = InferSelectModel<typeof transactions>;

export const transactionItems = createTable(
  "transaction_item",
  {
    ...idColumn,

    transactionId: integer("transaction_id").references(() => transactions.id),
    itemId: integer("item_id").references(() => items.id).notNull(),
  }
)

export const transactionAddons = createTable(
  "transaction_addon",
  {
    ...idColumn,

    transactionItem: integer("transaction_item").references(() => transactionItems.id).notNull(),
    addonId: integer("addon_id").references(() => addons.id).notNull()
  }
)
