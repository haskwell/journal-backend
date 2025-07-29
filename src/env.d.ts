import type { D1Database } from '@cloudflare/workers-types'

export type Env = {
  Bindings: {
    DB: D1Database
  }
}
