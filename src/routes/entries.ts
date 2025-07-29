import { Hono } from "hono";
import { addEntry, getEntriesByJournalId, getEntryById } from "../services/entryService";
import { Env } from "../env";

export const entryRoutes = new Hono<Env>()

entryRoutes.get('/:journalId/:entryId', getEntryById)
entryRoutes.get('/:journalId', getEntriesByJournalId)
entryRoutes.post('/:journalId/new', addEntry)

export default entryRoutes