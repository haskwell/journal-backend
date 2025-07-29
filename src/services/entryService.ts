import { Context } from "hono";
import { getDb } from "../db/client";
import { journalEntries } from "../db/schema";
import { Env } from "../env";
import { JournalEntry } from "../types/types";
import { ApiResponse } from "../types/types";

export const getAllEntries = async (c: Context<Env>) => {

    try{
        const db = getDb(c)
        const result: JournalEntry[] = await db
            .select()
            .from(journalEntries)
            .orderBy(journalEntries.dateCreated)
            .all()

        const response: ApiResponse<JournalEntry[]> = {
            success: true,
            data: result,
            message: "All entries fetched successfully"
        }
        return c.json(response)
    }
    catch(err){
        console.error("Error fetching entries: ", err)
        const response: ApiResponse<null> = {
            success: true,
            data: null,
            message: "Failed to fetch entries"
        }
        return c.json(response, 500)
    }

}
