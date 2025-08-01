import { Hono } from "hono";
import authRoutes from "./routes/auth";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import { cors } from "hono/cors";
import { failure } from "./utils/response";

type Bindings = {
  JWT_SECRET: string;
}

const app = new Hono<{Bindings: Bindings}>();

app.use(
  '*',
  cors({
    origin: ['https://spero.pages.dev', 'http://localhost:5173'],
    credentials: true,
  })
)

app.use('/api/*', csrf({
  origin: ['https://spero.pages.dev', 'http://localhost:5173'],
}))

app.use('/api/auth/*', async (c, next) => {
  try {
    const jwtMiddleware = jwt({
      secret: c.env.JWT_SECRET,
      cookie: 'authToken',
    });
    await jwtMiddleware(c, next);
  } catch (err) {
    return c.json(failure(null, 'Invalid or missing token'), 401);
  }
});

app.route('/api', authRoutes);

export default app