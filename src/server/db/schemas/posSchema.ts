import { relations } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { AnyPgColumn } from "drizzle-orm/pg-core";

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

export const restaurantRelations = relations(restaurants, ({ many }) => ({
  employees: many(employees),
}));

export const employees = createTable(
  "employee",
  {
    ...idColumn,

    name: varchar("name", { length: 255 }).notNull(),
    // TODO(Adin): Integrate with the authentication system
    restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
    // TODO(Adin): Remove me?
    pin: integer("pin").notNull(), 
  }
)

export const employeeRelations = relations(employees, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [employees.restaurantId],
    references: [restaurants.id],
  }),
  clockedInIntervals: many(clockedInIntervals)
}));

export const clockedInIntervals = createTable(
  "clocked_in_interval",
  {
    ...idColumn,

    employeeId: integer("employee_id").references(() => employees.id).notNull(),
    timeIn: timestamp("time_in").notNull(),
    timeOut: timestamp("time_out"), // If timeOut is null, the employee is still clocked in
  }
)

export const clockedInIntervalsRelations = relations(clockedInIntervals, ({ one }) => ({
  employee: one(employees, {
    fields: [clockedInIntervals.employeeId],
    references: [employees.id],
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

export const specializations = createTable(
  "specialization",
  {
    ...idColumn,

    itemId: integer("item_id").references(() => items.id).notNull(),
    name: varchar("name", { length: 255 }),
    price: integer("price").notNull().default(0),
  }
)

export const transactions = createTable(
  "transaction",
  {
    ...idColumn,

    restaurantId: integer("restaurant_id").references(() => restaurants.id).notNull(),
    employeeId: integer("employee_id").references(() => employees.id).notNull(),
    timestamp: timestamp("timestamp").notNull(),
    tipAmount: integer("tip_amount").notNull().default(0),
});

export const transactionItems = createTable(
  "transaction_item",
  {
    ...idColumn,

    transactionId: integer("transaction_id").references(() => transactions.id),
    itemId: integer("item_id").references(() => items.id).notNull(),
  }
)

// Cache invalidation and transactionItemSpecializations
export const transactionItemSpecializations = createTable(
  "transaction_item_specialization",
  {
    ...idColumn,

    transactionItem: integer("transaction_item").references(() => transactionItems.id).notNull(),
    specializationId: integer("specialization_id").references(() => specializations.id).notNull()
  }
)
