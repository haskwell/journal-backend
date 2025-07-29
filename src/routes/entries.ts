import { Hono } from "hono";
import { getAllEntries } from "../services/entryService";

export const entryRoutes = new Hono()

entryRoutes.get('/', getAllEntries)

export default entryRoutes