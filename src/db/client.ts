import { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema'

export interface Env{
    DB: D1Database;
}

export const getDB = (env: Env) => drizzle(env.DB, {schema});

export type DBtype = ReturnType<typeof getDB>