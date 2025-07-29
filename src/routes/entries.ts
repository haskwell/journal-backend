import { Hono } from "hono";
import { addEntry, getEntriesByJournalId } from "../services/entryService";
import { Env } from "../env";

export const entryRoutes = new Hono<Env>()

entryRoutes.get('/:journalId', getEntriesByJournalId)
entryRoutes.post('/:journalId', addEntry)

export default entryRoutes