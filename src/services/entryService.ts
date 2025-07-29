import { Context } from "hono";
import { getDb } from "../db/client";
import { journalEntries } from "../db/schema";
import { Env } from "../env";
import { CreateEntryRequest, JournalEntry, ApiResponse } from "../types/types";
import { eq } from "drizzle-orm";

// Get all entries for a specific journal
export const getEntriesByJournalId = async (c: Context<Env>) => {
    try {
        const db = getDb(c);
        const journalId = Number(c.req.param("journalId"));

        if (isNaN(journalId)) {
            return c.json({
                success: false,
                data: null,
                message: "Invalid journal ID",
            }, 400);
        }

        const result: JournalEntry[] = await db
            .select()
            .from(journalEntries)
            .where(eq(journalEntries.journalId, journalId))
            .orderBy(journalEntries.dateCreated)
            .all();

        return c.json({
            success: true,
            data: result,
            message: `Entries for journal ${journalId} fetched successfully`,
        });
    } catch (err) {
        console.error("Error fetching entries:", err);
        return c.json({
            success: false,
            data: null,
            message: "Failed to fetch entries",
        }, 500);
    }
};

// Get a single entry by its ID
export const getEntryById = async (c: Context<Env>) => {
    try {
        const db = getDb(c);
        const entryId = Number(c.req.param("entryId"));

        if (isNaN(entryId)) {
            return c.json({
                success: false,
                data: null,
                message: "Invalid entry ID",
            }, 400);
        }

        const [entry] = await db
            .select()
            .from(journalEntries)
            .where(eq(journalEntries.entryId, entryId))
            .limit(1)
            .all();

        if (!entry) {
            return c.json({
                success: false,
                data: null,
                message: "Entry not found",
            }, 404);
        }

        return c.json({
            success: true,
            data: entry,
            message: `Entry ${entryId} fetched successfully`,
        });
    } catch (err) {
        console.error("Error fetching entry:", err);
        return c.json({
            success: false,
            data: null,
            message: "Failed to fetch entry",
        }, 500);
    }
};

// Add a new entry to a journal
export const addEntry = async (c: Context<Env>) => {
    try {
        const body = await c.req.json<CreateEntryRequest>();
        const db = getDb(c);
        const journalId = Number(c.req.param("journalId"));

        if (isNaN(journalId)) {
            return c.json({
                success: false,
                data: null,
                message: "Invalid journal ID",
            }, 400);
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

        return c.json({
            success: true,
            data: inserted,
            message: "Entry added successfully",
        }, 201);
    } catch (err) {
        console.error("Error adding entry:", err);
        return c.json({
            success: false,
            data: null,
            message: "Failed to add entry",
        }, 500);
    }
};
