import { Hono } from "hono";
import * as authHandler from '../handlers/authHandler'

const authRoutes = new Hono();

authRoutes.post('/login', authHandler.loginHandler);
authRoutes.post('/register', authHandler.registerHandler);
authRoutes.post('/logout', authHandler.logout);
authRoutes.get('/auth/me', authHandler.getCurrentUserHandler);
authRoutes.get('/isloggedin', authHandler.isLoggedIn);
authRoutes.post('/password-reset-request', authHandler.passwordResetRequestHandler);
authRoutes.post('/password-reset', authHandler.passwordResetHandler);
authRoutes.patch('/auth/update-username', authHandler.updateUsernameHandler);
authRoutes.patch('/auth/update-email', authHandler.updateEmailHandler);
authRoutes.patch('/auth/update-password', authHandler.updatePasswordHandler);

export default authRoutes