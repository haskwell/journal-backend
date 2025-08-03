import { sql } from "drizzle-orm";
import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('USERS', {
  userId: text('USER_ID').primaryKey().notNull(),
  username: text('USERNAME').notNull().unique(),
  passwordHash: text('PASSWORD_HASH').notNull(),
  email: text('EMAIL_ADDRESS').notNull().unique(),
  dateCreated: text('DATE_CREATED').default(sql`CURRENT_TIMESTAMP`),
});


export const pages = sqliteTable("PAGES", {
  pageId: text("PAGE_ID").primaryKey().notNull(),
  userId: text("USER_ID").notNull().references(() => users.userId),
  pageTitle: text("PAGE_TITLE").notNull(),
  pageNumber: integer("PAGE_NUMBER").notNull(),
  content: text("CONTENT").notNull(),
  mood: integer("MOOD").notNull(),
  color: text("COLOR").notNull(),
  dateCreated: text("DATE_CREATED").default(sql`CURRENT_TIMESTAMP`),
  dateModified: text("DATE_MODIFIED").default(sql`CURRENT_TIMESTAMP`),
});


export const passwordResetTokens = sqliteTable('PASSWORD_RESET_TOKENS', {
  token: text('TOKEN').primaryKey(),
  userId: text('USER_ID').notNull().references(() => users.userId),
  expiresAt: text('EXPIRES_AT').notNull(),
});
