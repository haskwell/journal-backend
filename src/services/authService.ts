import { LoginRequest, PasswordResetRequestType, PasswordResetType, RegisterRequest, User } from "../types/types";
import { DBtype } from "../db/client";
import { passwordResetTokens, users } from "../db/schema";
import { eq, or } from "drizzle-orm";
import { compare, hash } from "bcrypt-ts";
import { nanoid } from "nanoid";

export const registerUser = async (db : DBtype, request: RegisterRequest) => {
    
    const existing : User[] = await db
        .select()
        .from(users)
        .where(
            or(
                eq(users.username, request.username),
                eq(users.email, request.email)
            )
        );
    if(existing.length != 0) {
        return false;
    }
    const passwordHash: string = await hash(request.password, 10);
    const newUser: User = {
        userId: crypto.randomUUID(),
        username: request.username,
        email: request.email,
        passwordHash: passwordHash,
    }
    await db.insert(users).values(newUser);
    return newUser;
}

export const loginUser = async (db: DBtype, request: LoginRequest) => {

    const existing: User[] = await db
        .select()
        .from(users)
        .where(
            eq(users.username, request.username),
        );

    if (existing.length === 0) return false;
    const isPasswordCorrect: boolean = await compare(request.password, existing[0].passwordHash)

    if(!isPasswordCorrect){
        return false;
    }

    return existing[0].userId;
}

export const getCurrentUser = async (db: DBtype, request: string) => {

    const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, request));

    if(user.length === 0){
        return false;
    }
    return user[0];
}

export const passwordResetRequest = async (db: DBtype, request: PasswordResetRequestType) => {

    const user = await db
        .select()
        .from(users)
        .where(
            eq(users.email, request.email)
        )
        .get()
        
    if (!user) return false;

    const token = nanoid(32)

    const exp = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    await db
        .insert(passwordResetTokens)
        .values({
            token,
            userId: user.userId,
            expiresAt: exp
        })

    return token;
}

export const passwordReset = async (db: DBtype, request: PasswordResetType) => {
    
    const record = await db
        .select()
        .from(passwordResetTokens)
        .where(
            eq(passwordResetTokens.token, request.token)
        )
        .get()
    
    if (!record) {
        return false;
    }

    const now = new Date();
    const exp = new Date(record.expiresAt);

    if(exp < now){
        return false;
    }

    const newPasswordHash = await hash(request.password, 10);

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
            eq(passwordResetTokens.token, request.token)
        )
    return true;
}

export const updateUsername = async (
  db: DBtype,
  newUsername: string,
  requestPassword: string,
  userId: string
) => {

    const existing : User[] = await db
        .select()
        .from(users)
        .where(
            eq(users.username, newUsername),
        );
    if(existing.length != 0) {
        return false;
    }

    const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, userId))
        .then((res) => res[0]);

    if (!user) return false;

    const isValidPassword = await compare(requestPassword, user.passwordHash);

    if (!isValidPassword) return false;

    await db
        .update(users)
        .set({ username: newUsername })
        .where(eq(users.userId, userId));

    return true;
};

export const updateEmail = async (
  db: DBtype,
  newEmail: string,
  requestPassword: string,
  userId: string
) => {

    const existing : User[] = await db
        .select()
        .from(users)
        .where(
            eq(users.email, newEmail),
        );
    if(existing.length != 0) {
        return false;
    }

    const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, userId))
        .then((res) => res[0]);

    if (!user) return false;

    const isValidPassword = await compare(requestPassword, user.passwordHash);

    if (!isValidPassword) return false;

    await db
        .update(users)
        .set({ email: newEmail })
        .where(eq(users.userId, userId));

    return true;
};

export const updatePassword = async (
  db: DBtype,
  newPassword: string,
  requestPassword: string,
  userId: string
) => {

    const user = await db
        .select()
        .from(users)
        .where(eq(users.userId, userId))
        .then((res) => res[0]);

    if (!user) return false;

    const isValidPassword = await compare(requestPassword, user.passwordHash);

    if (!isValidPassword) return false;
    const newPasswordHash = await hash(newPassword, 10);

    await db
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.userId, userId));

    return true;
};
