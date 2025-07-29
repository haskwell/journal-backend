import { Hono } from 'hono'
import { getDb } from './db/client'
import { journalEntries } from './db/schema'
import type { D1Database } from '@cloudflare/workers-types'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const app = new Hono<Env>()

app.get('/entries', async (c) => {
  const db = getDb(c)

  const result = await db
    .select()
    .from(journalEntries)
    .orderBy(journalEntries.dateCreated)
    .all()

  return c.json(result)
})

export default app
