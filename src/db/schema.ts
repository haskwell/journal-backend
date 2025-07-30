import { sql } from "drizzle-orm";
import { integer, text, sqliteTable, unique } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('USERS', {
  userId: integer('USER_ID').primaryKey().notNull(),
  username: text('USERNAME').notNull().unique(),
  passwordHash: text('PASSWORD_HASH').notNull(),
  email: text('EMAIL_ADDRESS').notNull().unique(),
  dateCreated: text('DATE_CREATED').default(sql`CURRENT_TIMESTAMP`),
});

export const journal = sqliteTable('JOURNAL', {
  journalId: integer('JOURNAL_ID').notNull().primaryKey(),
  userId: integer('USER_ID').references(() => users.userId, {onDelete: "cascade"}).notNull(),
  journalNumber: integer('JOURNAL_NUMBER').notNull(),
  title: text('TITLE').notNull(),
  dateCreated: text('DATE_CREATED').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  unique('unique_journal_per_user').on(table.userId, table.journalNumber)
])

export const pages = sqliteTable('PAGES', {
  pageId: integer('PAGE_ID').primaryKey().notNull(),
  journalId: integer('JOURNAL_ID').notNull().references(() => journal.journalId, {onDelete: "cascade"}),
  pageNumber: integer("PAGE_NUMBER").notNull(),
  title: text('TITLE').notNull(),
  content: text('CONTENT').notNull(),
  mood: integer('MOOD').notNull(),
  dateCreated: text('DATE_CREATED').default(sql`CURRENT_TIMESTAMP`),
  dateModified: text('DATE_MODIFIED').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  unique("unique_page_per_journal").on(table.journalId, table.pageNumber)
])

export const sharedPages = sqliteTable('SHARED_PAGES', {
  sharingId: integer('SHARING_ID').primaryKey().notNull(),
  sharedFromUserId: integer('SHARED_FROM_USER_ID').references(() => users.userId).notNull(),
  sharedToUserId: integer('SHARED_TO_USER_ID').references(() => users.userId).notNull(),
  sharedPageId: integer('SHARED_PAGE_ID').references(() => pages.pageId, {onDelete: "cascade"}).notNull(),
  isPrivate: integer('IS_PRIVATE').default(1).notNull(),
  dateShared: text('DATE_SHARED').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  unique('one_share_per_pair').on(table.sharedFromUserId, table.sharedToUserId, table.sharedPageId)
])