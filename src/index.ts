import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('hello world CAN U HEAR ME BRUH')
})

export default app
