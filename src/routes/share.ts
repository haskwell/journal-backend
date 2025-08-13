import { Hono } from "hono";
import * as shareHandler from "../handlers/shareHandler";

const shareRoutes = new Hono();

shareRoutes.post('/auth/page/:pageNumber', shareHandler.sharePageHandler);
shareRoutes.delete('/auth/page/delete/:shareId', shareHandler.deleteShareHandler);
shareRoutes.get('/auth/shared', shareHandler.getPagesSharedWithMeHandler);
shareRoutes.get('/auth/shared/sent', shareHandler.getPagesISentHandler);

export default shareRoutes;