import { Context } from "hono";
import { failure, success } from "../utils/response";
import { getDB } from "../db/client";
import * as shareService from '../services/shareService'

export const sharePageHandler = async (c: Context) => {
    const payload = c.get("jwtPayload") as { sub: string } | undefined;
    const pageNumberString = c.req.param("pageNumber");

    if (!payload?.sub) {
        return c.json(failure(null, "Invalid token"));
    }

    const { sharedToUsername } = await c.req.json();
    const pageNumber = Number(pageNumberString);
    if (isNaN(pageNumber)) {
        return c.json(failure(null, "Invalid page number"));
    }
    const response = await shareService.sharePage(getDB(c.env), payload.sub, sharedToUsername, pageNumber);
    return c.json(success(response, "Page shared successfully."));
};

export const deleteShareHandler = async (c: Context) => {
    const payload = c.get("jwtPayload") as { sub: string } | undefined;
    const pageId = c.req.param("pageId");

    if (!payload?.sub) {
        return c.json(failure(null, "Invalid token"));
    }
    const response = await shareService.deleteShare(getDB(c.env), payload.sub, pageId);
    if(!response) return c.json(failure(null, "Share failed successfully"))
    return c.json(success(response, "Share deleted successfully"))
};

export const getPagesSharedWithMeByIdHandler = async (c: Context) => {
    const payload = c.get("jwtPayload") as { sub: string } | undefined;
    const pageId = c.req.param("pageId");

    if (!payload?.sub) {
        return c.json(failure(null, "Invalid token"));
    }
    const response = await shareService.getPagesSharedWithMeById(getDB(c.env), payload.sub, pageId);
    if(!response) return c.json(failure(null, "Page not found"))
    return c.json(success(response, "Share fetched successfully"))
};

export const getPagesSharedWithMeHandler = async (c: Context) => {

    const payload = c.get('jwtPayload') as {sub: string} | undefined;

    if(!payload?.sub){
       return c.json(failure(null, 'Invalid')) 
    }
    const startParam = c.req.query("start");
    const endParam = c.req.query("end");

    if (!startParam || !endParam) {
        return c.json(failure(null, "Missing query parameters"), 400);
    }

    const listStart =  parseInt(startParam, 10);
    const listEnd =  parseInt(endParam, 10);

    const response  = await shareService.getPagesSharedWithMe(getDB(c.env), listStart, listEnd, payload.sub);

    return c.json(success(response , "List fetched"))

};

export const getPagesISentHandler = async (c: Context) => {

    const payload = c.get('jwtPayload') as {sub: string} | undefined;

    if(!payload?.sub){
       return c.json(failure(null, 'Invalid')) 
    }
    const startParam = c.req.query("start");
    const endParam = c.req.query("end");

    if (!startParam || !endParam) {
        return c.json(failure(null, "Missing query parameters"), 400);
    }

    const listStart =  parseInt(startParam, 10);
    const listEnd =  parseInt(endParam, 10);

    const response  = await shareService.getPagesIShared(getDB(c.env), listStart, listEnd, payload.sub);

    return c.json(success(response , "List fetched"))


};
