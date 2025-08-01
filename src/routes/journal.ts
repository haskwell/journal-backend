import { Hono } from "hono";
import { createJournal, updateJournal } from "../services/journalService";

const journalRoutes = new Hono()

journalRoutes.post('', createJournal);
journalRoutes.put('', updateJournal);
journalRoutes.delete('', );
journalRoutes.get('', );
journalRoutes.get('', );