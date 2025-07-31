import { Hono } from "hono";
import authRoutes from "./routes/auth";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";

type Bindings = {
    JWT_SECRET: string;
}

const app = new Hono<{Bindings: Bindings}>();

app.use('/api/*', csrf())

app.use('/api/auth/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
    cookie: 'authToken'
  })
  return jwtMiddleware(c, next)
})

app.route('/api', authRoutes);

export default app