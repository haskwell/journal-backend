import { Context } from "hono"
import { sign } from "hono/jwt";
import { CookieOptions } from "hono/utils/cookie";

export const generateToken = async (userId: string, c: Context) => {
    const secret: string = c.env.JWT_SECRET;
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        sub: userId,
        iat: now,
        exp: now + 1 * 60 * 60
    }
    const token = await sign(payload, secret)
    return token;
}

export const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    path: '/',
    maxAge: 3600
} as CookieOptions;