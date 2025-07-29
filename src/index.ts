import { Hono } from 'hono'
import { entryRoutes } from './routes/entries'

const app = new Hono()

app.route('/entries', entryRoutes)

app.get('/favicon.ico', (c) => c.body(null, 204))





export default app
