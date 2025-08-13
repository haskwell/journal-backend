import { desc, eq, and, sql } from "drizzle-orm";
import { DBtype } from "../db/client";
import { pages } from "../db/schema";
import { Page, UpdatePageRequest } from "../types/types";

export const createPage = async (db: DBtype, request: string) => {

    const lastPage = await db
        .select()
        .from(pages)
        .where(eq(pages.userId, request))
        .orderBy(pages.pageNumber)
        .all();
    
    const prevPageNumber = lastPage.length > 0
        ? lastPage[lastPage.length - 1].pageNumber
        : 0;
    
    const newPage: Page = {
        pageId: crypto.randomUUID(),
        pageNumber: prevPageNumber + 1,
        userId: request,
        pageTitle: "New Page",
        content: "",
        mood: 5,
        color: "black",
    }
    await db
        .insert(pages)
        .values(newPage)

    return newPage;

}

export const updatePage = async (db: DBtype, request: UpdatePageRequest, userid: string) => {
    
    const res = await db
        .update(pages)
        .set(
            {
                pageTitle: request.title,
                content: request.content,
                color: request.color,
                mood: request.mood,
                dateModified: sql`CURRENT_TIMESTAMP`
            }
        )
        .where(
            and(
                eq(pages.pageNumber, request.pageNumber),
                eq(pages.userId, userid)
            )
        )
    return res.rowsAffected > 0;
}

export const getPagesList = async (db: DBtype, listStart: number, listEnd: number, request: string) => {
    //request is the userId of the user requesting their journal list
    const pagesList : Page[] = await db.select()
                                            .from(pages)
                                            .orderBy(desc(pages.dateCreated))
                                            .where(eq(pages.userId, request))
                                            .offset(listStart)
                                            .limit(listEnd - listStart)

    return pagesList;
}

export const getPageById = async (db: DBtype, request: string, pageNumber: number) => {
    const pageList : Page[] = await db.select()
                                            .from(pages)
                                            .where(
                                                and(
                                                    eq(pages.userId, request),
                                                    eq(pages.pageNumber, pageNumber)
                                                )
                                            )
                                                
    if(!pageList[0]) return false;
    else
    return pageList[0];
}

export const deletePage = async (db: DBtype, request: string, pageNumber: number) => {
    const res = await db.delete(pages)
            .where(
                and(
                    eq(pages.userId, request),
                    eq(pages.pageNumber, pageNumber)
                )
            )
    return res.rowsAffected > 0;
}