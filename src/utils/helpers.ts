import { Context } from "hono";
import { ZodType } from "zod/v4";

export const inputValidator = async <T>(c: Context, schema: ZodType<T>) : Promise<T | string> => {
    const body = await c.req.json<T>();
    const result = schema.safeParse(body);
    if (!result.success) {
        const messages = result.error.issues
            .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
            .join('; ');
        return messages;
    }
    return result.data;
}
