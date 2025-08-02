import { Hono } from "hono";
import * as authHandler from '../handlers/authHandler'

const authRoutes = new Hono();

authRoutes.post('/login', authHandler.loginHandler);
authRoutes.post('/register', authHandler.registerHandler);
authRoutes.post('/logout', authHandler.logout);
authRoutes.get('/auth/me', authHandler.getCurrentUserHandler);
authRoutes.post('/password-reset-request', authHandler.passwordResetRequestHandler);
authRoutes.post('/password-reset', authHandler.passwordResetHandler);

export default authRoutes