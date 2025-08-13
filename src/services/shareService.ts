import { and, desc, eq, inArray } from "drizzle-orm";
import { DBtype } from "../db/client";
import { pages, sharedPages } from "../db/schema";
import { Page } from "../types/types";

export const sharePage = async (db: DBtype, fromUserId: string, toUserId: string, pageNumber: number) => {

    const pagesResult = await db.select().from(pages).where(
        and(
            eq(pages.userId, fromUserId),
            eq(pages.pageNumber, pageNumber)
        ))

    if (pagesResult.length === 0) return false;

    const pageId = pagesResult[0].pageId;

    const newShare = {
        shareId: crypto.randomUUID(),
        sharedFromUserId: fromUserId,
        sharedToUserId: toUserId,
        sharedPageId: pageId,
        dateShared: new Date().toISOString()
    };

    await db.insert(sharedPages).values(newShare);

    return newShare;
};

export const deleteShare = async (db: DBtype, userId: string, shareId: string) => {

    const deleted = await db.delete(sharedPages).where(
        and(
            eq(sharedPages.sharedFromUserId, userId),
            eq(sharedPages.shareId, shareId)
        )
    )
    if (deleted.rowCount === 0) {
        return false;
    }
    return true;

}

export const getPagesSharedWithMe = async (db: DBtype, listStart: number, listEnd: number, request: string) => {
    const pageIdRow = await db.select({
        sharedPageId: sharedPages.sharedPageId
    }).from(sharedPages)
    .where(
        eq(sharedPages.sharedToUserId, request)
    )

    const sharedPageIds = pageIdRow.map(row => row.sharedPageId);
    if (sharedPageIds.length === 0) {
        return [];
    }

    const pagesList : Page[] = await db.select()
                                            .from(pages)
                                            .orderBy(desc(pages.dateCreated))
                                            .where(
                                                inArray(pages.pageId, sharedPageIds)
                                            )
                                            .offset(listStart)
                                            .limit(listEnd - listStart)
    
    return pagesList;
}


export const getPagesIShared = async (db: DBtype, listStart: number, listEnd: number, request: string) => {
    const pageIdRow = await db.select({
        sharedPageId: sharedPages.sharedPageId
    }).from(sharedPages)
    .where(
        eq(sharedPages.sharedFromUserId, request)
    )

    const sharedPageIds = pageIdRow.map(row => row.sharedPageId);
    if (sharedPageIds.length === 0) {
        return [];
    }
    
    const pagesList : Page[] = await db.select()
                                            .from(pages)
                                            .orderBy(desc(pages.dateCreated))
                                            .where(and(
                                                eq(pages.userId, request),
                                                inArray(pages.pageId, sharedPageIds)
                                            ))
                                            .offset(listStart)
                                            .limit(listEnd - listStart)

    return pagesList;
}