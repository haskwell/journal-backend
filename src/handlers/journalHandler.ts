import { Context } from "hono";
import { getDB } from "../db/client";
import { CreateJournalRequest, Journal, UpdateJournalRequest } from "../types/types";
import { journals } from "../db/schema";
import { failure, success } from "../utils/response";
import { desc, eq } from "drizzle-orm";
import { decodeBase64 } from "hono/utils/encode";

export const createJournal = async (c: Context) => {
    
    const { prevJournalNumber, requestuserId }: CreateJournalRequest = await c.req.json();
    if (typeof prevJournalNumber !== 'number' || typeof requestuserId !== 'string') {
        return c.json(failure("Invalid input"), 400);
    }

    const db = getDB(c.env);
    const newJournal: Journal = {
        journalId: crypto.randomUUID(),
        journalNumber: prevJournalNumber + 1,
        userId: requestuserId,
        title: "New Journal"
    }
    await db.insert(journals).values(newJournal)
    return c.json(success(null, `Journal with number: ${newJournal.journalNumber} successfully created for user with ID: ${requestuserId}`));

}

export const updateJournal = async (c: Context) => {
    const {journalTitle , journalId} : UpdateJournalRequest = await c.req.json();

    if (typeof journalTitle !== 'string') {
        return c.json(failure("Invalid input"), 400);
    }
  
    const db = getDB(c.env);
    await db.update(journals).set({title: journalTitle}).where(eq(journals.journalId, journalId))

    return c.json(success(null, `Journal ${journalId} updated successfully.`));
}

export const getJournals = async (c: Context) => {
    const {start, end} = await c.req.json();

    const db = getDB(c.env)

    const journalArray: Journal[] = await db
        .select()
        .from(journals)
        .orderBy(desc(journals.dateCreated))

    //get largest journalNumber from db
    
    //calculate from where to where we need to get

    //get em from the db

    //return em
}