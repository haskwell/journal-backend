import { Context } from "hono"
import { getDB } from "../db/client"
import { LoginRequest, RegisterRequest, User } from "../types/types"
import { success, failure } from "../utils/response"
import { users } from "../db/schema"
import { eq, or } from "drizzle-orm"
import { hash, compare } from "bcrypt-ts"
import { LoginSchema, RegisterSchema } from "../schemas/auth"
import { cookieOptions, generateToken } from "../utils/token"
import { deleteCookie, setCookie } from "hono/cookie"

export const register = async (c: Context) => {

    const body: RegisterRequest = await c.req.json<RegisterRequest>();
    
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
        const messages = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
        return c.json(failure(null, messages), 400);
    }

    if (!body.username || !body.email || !body.password) {
        return c.json(failure(null, "Missing required fields"), 400);
    }

    const db = getDB(c.env)
    const existing : User[] = await db
        .select()
        .from(users)
        .where(
            or(
                eq(users.username, body.username),
                eq(users.email, body.email)
            )
        );
    
    if(existing.length != 0){
        return c.json(failure(null, "User already exists"), 400);
    }

    const passwordHash: string = await hash(body.password, 10);

    const newUser: User = {
        userId: crypto.randomUUID(),
        username: body.username,
        email: body.email,
        passwordHash: passwordHash,
        //dateCreated: ""
    }

    await db.insert(users).values(newUser);

    return c.json(success({username: newUser.username}, "User added successfully"), 201)
}

export const login = async (c: Context) => {
    const body: LoginRequest = await c.req.json<LoginRequest>()

    const result = LoginSchema.safeParse(body);
    if (!result.success) {
        const messages = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
        return c.json(failure(null, messages), 400);
    }

    const db = getDB(c.env)
    const existing: User[] = await db
        .select()
        .from(users)
        .where(
            eq(users.username, body.username),
        );
    
    if(existing.length == 0){
        return c.json(failure(null, "User does not exist"), 400);
    }

    const isPasswordCorrect: boolean = await compare(body.password, existing[0].passwordHash)

    if(!isPasswordCorrect){
        return c.json(failure(null, "Wrong password"), 400);
    }
    const token = await generateToken(existing[0].userId, c);
    setCookie(c, 'authToken', token, cookieOptions);

    return c.json(success(null, "Successfully logged in"), 200);
}

export const logout = async (c: Context) => {

    deleteCookie(c, 'authToken', cookieOptions);
    return c.json(success(null, "Log out successful"), 200);
}

export const getCurrentUser = async (c: Context) => {
  try {
    // Get JWT payload from context — available if jwt middleware ran
    const payload = c.get("jwtPayload") as { sub: string };

    if (!payload || !payload.sub) {
        return c.json(failure(null, "Unauthorized"), 401);
    }

    const db = getDB(c.env);
    const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, payload.sub));

    if (user.length === 0) {
        return c.json(failure(null, "User not found"), 404);
    }

    const { passwordHash, ...safeUser } = user[0]; // Remove sensitive data

    return c.json(success(safeUser, "User fetched"), 200);
    } catch (err) {
        return c.json(failure(null, "Invalid token or unauthorized"), 401);
    }
};