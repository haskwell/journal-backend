import { drizzle } from 'drizzle-orm/d1'
import type { Context } from 'hono'
import * as schema from './schema'
import { Env } from '../env'

export const getDb = (c: Context<Env>) => drizzle(c.env.DB, { schema })
