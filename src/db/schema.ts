import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('USERS', {
  userId: integer('USER_ID').primaryKey({ autoIncrement: true }),
  username: text('USERNAME').notNull().unique(),
  passwordHash: text('PASSWORD_HASH').notNull(),
  emailAddress: text('EMAIL_ADDRESS').notNull().unique(),
  dateCreated: text('DATE_CREATED').default('CURRENT_TIMESTAMP')
})

export const journals = sqliteTable('JOURNAL', {
  journalId: integer('JOURNAL_ID').primaryKey({ autoIncrement: true }),
  userId: integer('USER_ID').notNull(),
  title: text('TITLE').notNull(),
  dateCreated: text('DATE_CREATED').default('CURRENT_TIMESTAMP')
})

export const journalEntries = sqliteTable('JOURNAL_ENTRY', {
  entryId: integer('ENTRY_ID').primaryKey({ autoIncrement: true }),
  journalId: integer('JOURNAL_ID').notNull(),
  title: text('TITLE').notNull(),
  content: text('CONTENT').notNull(),
  color: text('COLOR'),
  mood: integer('MOOD'),
  dateCreated: text('DATE_CREATED').default('CURRENT_TIMESTAMP'),
  dateModified: text('DATE_MODIFIED').default('CURRENT_TIMESTAMP')
})

export const sharedEntries = sqliteTable('SHARED_ENTRY', {
  sharingId: integer('SHARING_ID').primaryKey({ autoIncrement: true }),
  entryId: integer('ENTRY_ID').notNull(),
  fromUserId: integer('FROM_USER_ID').notNull(),
  toUserId: integer('TO_USER_ID').notNull(),
  dateShared: text('DATE_SHARED').default('CURRENT_TIMESTAMP')
})
