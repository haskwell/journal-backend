import { Hono } from "hono";
import * as pageHandler from "../handlers/pageHandler";

const pageRoutes = new Hono()

pageRoutes.post('/auth/page/new', pageHandler.createPageHandler);
pageRoutes.put('/auth/page/update', pageHandler.updatePageHandler);
pageRoutes.delete('/auth/page/delete/:pageNumber', pageHandler.deletePageHandler);
pageRoutes.get('/auth/page', pageHandler.getPageListHandler);
pageRoutes.get('/auth/page/:pageNumber', pageHandler.getPageByIdHandler);

export default pageRoutes;