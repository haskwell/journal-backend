import { Context } from "hono";
import { getDb } from "../db/client";
import { journalEntries } from "../db/schema";
import { Env } from "../env";

export const getAllEntries = async (c: Context<Env>) => {

    try{
        const db = getDb(c)
        const result = await db
            .select()
            .from(journalEntries)
            .orderBy(journalEntries.dateCreated)
            .all()
        return c.json(result)
    }
    catch(err){
        console.error("Error fetching entries: ", err)
        return c.json({error: "Error fetching entries"}, 500)
    }

}
