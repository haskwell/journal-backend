import { Context } from "hono"
import { getDB } from "../db/client"
import { Journal, LoginRequest, RegisterRequest, User } from "../types/types"
import { success, failure } from "../utils/response"
import { journals, passwordResetTokens, users } from "../db/schema"
import { eq, or } from "drizzle-orm"
import { hash, compare } from "bcrypt-ts"
import { LoginSchema, RegisterSchema } from "../schemas/auth"
import { cookieOptions, generateToken } from "../utils/token"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { nanoid } from 'nanoid'

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
/*
    const newJournal : Journal = {
        journalId: crypto.randomUUID(),
        userId: newUser.userId,
        title: `${newUser.username}'s journal`,
        journalNumber: 1,
    }
*/

    await db.insert(users).values(newUser);
    //await db.insert(journals).values(newJournal);


    return c.json(success({username: newUser.username}, "User added successfully"), 201)
    //return c.json(success(db.select().from(journals).all(), "Journal added successfully"), 201)

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
    const token = getCookie(c, 'authToken');

    if (!token) {
        return c.json(failure(null, "You're not logged in"), 401);
    }

    deleteCookie(c, 'authToken', cookieOptions);
    return c.json(success(null, "Log out successful"), 200);
}

export const getCurrentUser = async (c: Context) => {
    const payload = c.get("jwtPayload") as { sub: string } | undefined;

    if (!payload?.sub) {
        return c.json(failure(null, "Invalid token or unauthorized"), 401);
    }

    const db = getDB(c.env);
    const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, payload.sub));

    if (user.length === 0) {
        return c.json(failure(null, "User not found"), 404);
    }

    const { passwordHash, ...safeUser } = user[0];
    return c.json(success(safeUser, "User fetched"), 200);   
};

export const passwordResetRequest = async (c: Context) => {

    const apiUrl = 'https://spero.pages.dev';
    //const apiUrl = 'http://localhost:5173';

    const {email} = await c.req.json();
    const db = getDB(c.env);

    const user = await db
        .select()
        .from(users)
        .where(
            eq(users.email, email)
        )
        .get()
        
    if (!user) return c.json(success(null, "If email exists, reset link will be sent."));

    const token = nanoid(32)

    const exp = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await db
        .insert(passwordResetTokens)
        .values({
            token,
            userId: user.userId,
            expiresAt: exp
        })

    const resetLink = `${apiUrl}/reset-password/?token=${token}`;

    //todo send mail, sending link in response for now for testing since console.log refuses to work for some reason
    return c.json(success(resetLink, "If email exists, reset link will be sent."));
}

export const passwordReset = async (c: Context) => {

    const { token, newPassword } = await c.req.json();
    const db = getDB(c.env)

    const record = await db
        .select()
        .from(passwordResetTokens)
        .where(
            eq(passwordResetTokens.token, token)
        )
        .get()
    
    if (!record) {
        return c.json(failure(null, "Invalid or expired token."), 400);
    }

    const now = new Date();
    const exp = new Date(record.expiresAt);

    if(exp < now){
        return c.json(failure(null, "Invalid or expired token"), 400);
    }

    const newPasswordHash = await hash(newPassword, 10);

    await db
        .update(users)
        .set({
            passwordHash: newPasswordHash
        })
        .where(
            eq(users.userId, record.userId)
        )

    await db
        .delete(passwordResetTokens)
        .where(
            eq(passwordResetTokens.token, token)
        )
    
    return c.json(success(null, "Password has been reset successfully."));    
}