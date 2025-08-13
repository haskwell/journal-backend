import { Context } from "hono";
import { getDB } from "../db/client";
import { failure, success } from "../utils/response";
import * as pageService from '../services/pageService'
import { UpdatePageRequest } from "../types/types";
import { inputValidator } from "../utils/helpers";
import { UpdatePageSchema } from "../schemas/page";

export const createPageHandler = async (c: Context) => {
    const payload = c.get('jwtPayload') as {sub: string} | undefined;

    if(!payload?.sub){
       return c.json(failure(null, 'Invalid')) 
    }

    const response = await pageService.createPage(getDB(c.env), payload.sub);
    
    return c.json(success(response, `Page with number: ${response.pageId} successfully created for user with ID: ${response.userId}`));

}

export const updatePageHandler = async (c: Context) => {
    
    const payload = c.get('jwtPayload') as {sub: string} | undefined;

    if(!payload?.sub){
       return c.json(failure(null, 'Invalid'))
    }

    const validation = await inputValidator(c, UpdatePageSchema);
    if (typeof validation === 'string') {
        return c.json(failure(null, validation));
    }

    const request = validation;

    const response = await pageService.updatePage(getDB(c.env), request, payload.sub);
    if(!response) return c.json(failure(response, `Page update failed.`));
    else
    return c.json(success(response, `Page updated.`));}

export const getPageListHandler = async (c: Context) => {
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

    const response = await pageService.getPagesList(getDB(c.env), listStart, listEnd, payload.sub);
    return c.json(success(response, `Page list fetched.`));
}

export const getPageByIdHandler = async (c: Context) => {
    const payload = c.get("jwtPayload") as {sub: string} | undefined;
    const pageNumberParse = c.req.param("pageNumber");
    const pageNumber = parseInt(pageNumberParse, 10);
    if(!payload?.sub){
       return c.json(failure(null, 'Invalid')) 
    }
    const response = await pageService.getPageById(getDB(c.env), payload.sub, pageNumber);
    if(!response) return c.json(failure(response, `Page fetch failed.`));
    else
    return c.json(success(response, `Page fetched.`));
}

export const deletePageHandler = async (c: Context) => {
    const payload = c.get('jwtPayload') as {sub: string} | undefined;
    const pageNumberParse = c.req.param("pageNumber");
    const pageNumber = parseInt(pageNumberParse, 10);
    if(!payload?.sub){
       return c.json(failure(null, 'Invalid')) 
    }
    const response = await pageService.deletePage(getDB(c.env), payload.sub, pageNumber);
    if(!response) return c.json(failure(response, `Page deletion failed.`));
    else
    return c.json(success(response, `Page deleted.`));
}