import { Hono } from "hono";
import { login, register, logout, getCurrentUser, passwordResetRequest, passwordReset } from "../services/authService";

const authRoutes = new Hono();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/logout', logout);
authRoutes.get('/auth/me', getCurrentUser);
authRoutes.post('/password-reset-request', passwordResetRequest);
authRoutes.post('/password-reset', passwordReset);

export default authRoutes