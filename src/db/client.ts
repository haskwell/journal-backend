import { drizzle } from 'drizzle-orm/d1'
import type { Context } from 'hono'
import * as schema from './schema'
import type { D1Database } from '@cloudflare/workers-types'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

export const getDb = (c: Context<Env>) => drizzle(c.env.DB, { schema })
