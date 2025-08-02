import { Context } from "hono";
import { getDB } from "../db/client";
import { failure, success } from "../utils/response";
import { inputValidator } from "../utils/helpers";
import { CreateJournalSchema, GetJournalByIdSchema, GetJournalListSchema, UpdateJournalSchema } from "../schemas/journal";
import * as journalService from '../services/journalService'

export const createJournalHandler = async (c: Context) => {
    
    const validation = await inputValidator(c, CreateJournalSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation; 

    const response = await journalService.createJournal(getDB(c.env), body);
    
    return c.json(success(null, `Journal with number: ${response.journalId} successfully created for user with ID: ${response.userId}`));

}

export const updateJournalHandler = async (c: Context) => {
    const validation = await inputValidator(c, UpdateJournalSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;
    const response = await journalService.updateJournal(getDB(c.env), body);
    return c.json(success(null, `Journal updated successfully.`));
}

export const getJournalListHandler = async (c: Context) => {
    const validation = await inputValidator(c, GetJournalListSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;
    const response = await journalService.getJournalList(getDB(c.env), body);
    return c.json(success(response, `Journal list fetched.`));
}

export const getJournalByIdHandler = async (c: Context) => {
    const validation = await inputValidator(c, GetJournalByIdSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;
    const response = await journalService.getJournalById(getDB(c.env), body);
    return c.json(success(response, `Journal fetched.`));
}

export const deleteJournalHandler = async (c: Context) => {
    const validation = await inputValidator(c, GetJournalByIdSchema);
    if (typeof validation === 'string') return c.json(failure(null, validation));
    const body = validation;
    const response = await journalService.deleteJournal(getDB(c.env), body);
    return c.json(success(response, `Journal deleted.`));
}