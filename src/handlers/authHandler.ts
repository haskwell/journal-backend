import { Context } from "hono"
import { getDB } from "../db/client"
import { success, failure } from "../utils/response"
import { LoginSchema, RegisterSchema, PasswordResetRequestSchema, PasswordResetSchema } from "../schemas/auth"
import { cookieOptions, generateToken } from "../utils/token"
import { deleteCookie, getCookie, setCookie } from "hono/cookie"
import { inputValidator } from "../utils/helpers"
import * as authService from "../services/authService"

export const registerHandler = async (c: Context) => {

    const validation = await inputValidator(c, RegisterSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;

    const response = await authService.registerUser(getDB(c.env), body);
    if(!response){
        return c.json(failure(null, "User already exists"), 400);
    }

    return c.json(success({username: response.username}, "User added successfully"), 201)
}

export const loginHandler = async (c: Context) => {
    const validation = await inputValidator(c, LoginSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;

    const response = await authService.loginUser(getDB(c.env), body);

    if(!response){
        return c.json(failure(null, "Wrong username or password"));
    }

    const token = await generateToken(response, c);
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

export const getCurrentUserHandler = async (c: Context) => {
    const payload = c.get("jwtPayload") as { sub: string } | undefined;

    if (!payload?.sub) {
        return c.json(failure(null, "Invalid token or unauthorized"), 401);
    }

    const response = await authService.getCurrentUser(getDB(c.env), payload.sub)

    if (!response) {
        return c.json(failure(null, "User not found"), 404);
    }

    const { passwordHash, ...safeUser } = response;
    return c.json(success(safeUser, "User fetched"), 200);   
};

export const passwordResetRequestHandler = async (c: Context) => {

    //const apiUrl = 'https://spero.pages.dev';
    const apiUrl = 'http://localhost:5173';
    
    const validation = await inputValidator(c, PasswordResetRequestSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;

    const response = await authService.passwordResetRequest(getDB(c.env), body)

    if(!response){
        return c.json(failure(null, "If email exists, reset link will be sent."));
    }

    const resetLink = `${apiUrl}/reset-password/?token=${response}`;

    //todo send mail, sending link in response for now for testing since console.log refuses to work for some reason
    return c.json(success(resetLink, "If email exists, reset link will be sent."));
}

export const passwordResetHandler = async (c: Context) => {

    const validation = await inputValidator(c, PasswordResetSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;
    
    const response = await authService.passwordReset(getDB(c.env), body)

    if(!response){
        return c.json(failure(null, "Invalid or expired token"), 400);
    }

    else{
        return c.json(success(null, "Password has been reset successfully."));    
    }
}