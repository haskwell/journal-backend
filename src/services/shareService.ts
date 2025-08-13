import { and, desc, eq, inArray, or } from "drizzle-orm";
import { DBtype } from "../db/client";
import { pages, sharedPages, users } from "../db/schema";
import { Page } from "../types/types";

export const sharePage = async (db: DBtype, fromUserId: string, toUsername: string, pageNumber: number) => {
    const toUserIdarr = await db.select({
        userId: users.userId
    }).from(users).where(eq(users.username, toUsername))

    const pagesResult = await db.select().from(pages).where(
        and(
            eq(pages.userId, fromUserId),
            eq(pages.pageNumber, pageNumber)
        ))

    if (pagesResult.length === 0) return false;

    const pageId = pagesResult[0].pageId;

    const newShare = {
        sharedFromUserId: fromUserId,
        sharedToUserId: toUserIdarr[0].userId,
        sharedPageId: pageId,
        dateShared: new Date().toISOString()
    };
    await db.insert(sharedPages).values(newShare);
    return newShare;
};

export const deleteShare = async (db: DBtype, userId: string, pageId: string) => {
    
    await db.delete(sharedPages).where(
        and(
            or(
                eq(sharedPages.sharedFromUserId, userId),
                eq(sharedPages.sharedToUserId, userId)
            ),
            eq(sharedPages.sharedPageId, pageId)
        )
    )

    return true;
}

export const getPagesSharedWithMeById = async (db: DBtype, userId: string, pageId: string) => {

    const share = await db.select().from(sharedPages).where(
        and(
            eq(sharedPages.sharedToUserId, userId),
            eq(sharedPages.sharedPageId, pageId)
        )
    )
    if (share.length === 0) {
        return false;
    }
    const page = await db.select().from(pages).where(eq(pages.pageId, pageId));
    return page[0];
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