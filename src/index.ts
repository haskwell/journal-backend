import { Hono } from 'hono'
import type { D1Database } from '@cloudflare/workers-types'

type Env = {
  Bindings: {
    DB: D1Database
  }
}

const app = new Hono()

export default app
