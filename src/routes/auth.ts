import { Hono } from "hono";
import { login, register, logout, getCurrentUser } from "../services/authService";

const authRoutes = new Hono();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/logout', logout);
authRoutes.post('/me', getCurrentUser);

export default authRoutes