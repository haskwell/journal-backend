import { Hono } from 'hono'
import { entryRoutes } from './routes/entries'

const app = new Hono()

app.route('/journal', entryRoutes)

export default app
