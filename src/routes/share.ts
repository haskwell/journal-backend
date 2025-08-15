import { Hono } from "hono";
import * as shareHandler from "../handlers/shareHandler";

const shareRoutes = new Hono();

shareRoutes.post('/auth/share/:pageNumber', shareHandler.sharePageHandler);
shareRoutes.delete('/auth/shared/delete/:pageId', shareHandler.deleteShareHandler);
shareRoutes.get('/auth/shared', shareHandler.getPagesSharedWithMeHandler);
shareRoutes.get('/auth/shared/sent', shareHandler.getPagesISentHandler);
shareRoutes.get('/auth/shared/get/:pageId', shareHandler.getPagesSharedWithMeByIdHandler);

export default shareRoutes;