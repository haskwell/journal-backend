import { Context } from "hono";
import { getDb } from "../db/client";
import { journalEntries } from "../db/schema";
import { Env } from "../env";
import { CreateEntryRequest, JournalEntry } from "../types/types";
import { ApiResponse } from "../types/types";
import { sql } from "drizzle-orm";

export const getEntriesByJournalId = async (c: Context<Env>) => {
    try {
        const db = getDb(c);
        const journalId = Number(c.req.param("journalId"));

        if (isNaN(journalId)) {
            const response: ApiResponse<null> = {
                success: false,
                data: null,
                message: "Invalid journal ID",
            };
            return c.json(response, 400);
        }

        const result: JournalEntry[] = await db
            .select()
            .from(journalEntries)
            .where(sql`${journalEntries.journalId} = ${journalId}`)
            .orderBy(journalEntries.dateCreated)
            .all();

        const response: ApiResponse<JournalEntry[]> = {
            success: true,
            data: result,
            message: `Entries for journal ${journalId} fetched successfully`,
        };
        return c.json(response);
    } catch (err) {
        console.error("Error fetching entries:", err);
        const response: ApiResponse<null> = {
            success: false,
            data: null,
            message: "Failed to fetch entries",
        };
        return c.json(response, 500);
    }
};


export const addEntry = async (c: Context<Env>) => {
    try {
        const body = await c.req.json<CreateEntryRequest>();
        const db = getDb(c);
        const journalId = Number(c.req.param("journalId"));

        if (isNaN(journalId)) {
            const response: ApiResponse<null> = {
                success: false,
                data: null,
                message: "Invalid journal ID",
            };
            return c.json(response, 400);
        }

        const [inserted] = await db
            .insert(journalEntries)
            .values({
                journalId,
                title: body.title,
                content: body.content,
                color: body.color ?? "black",
                mood: body.mood,
            })
            .returning();

        const response: ApiResponse<JournalEntry> = {
            success: true,
            data: inserted,
            message: "Entry added successfully",
        };

        return c.json(response, 201);
    } catch (err) {
        console.error("Error adding entry:", err);
        const response: ApiResponse<null> = {
            success: false,
            data: null,
            message: "Failed to add entry",
        };
        return c.json(response, 500);
    }
};
