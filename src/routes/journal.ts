import { Hono } from "hono";
import { createJournal, updateJournal } from "../handlers/journalHandler";

const journalRoutes = new Hono()

journalRoutes.post('', createJournal);
journalRoutes.put('', updateJournal);
journalRoutes.delete('', );
journalRoutes.get('', );
journalRoutes.get('', );