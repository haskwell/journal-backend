import { Hono } from "hono";
import { login, register, logout } from "../services/authService";

const authRoutes = new Hono();

authRoutes.post('/login', login);
authRoutes.post('/register', register);
authRoutes.post('/logout', logout);

export default authRoutes