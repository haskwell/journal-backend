import { desc, eq } from "drizzle-orm";
import { DBtype } from "../db/client";
import { journals } from "../db/schema";
import { CreateJournalRequest, GetJournalByIdRequest, GetJournalListRequest, Journal, UpdateJournalRequest } from "../types/types";

export const createJournal = async (db: DBtype, request: CreateJournalRequest) => {
    
    const newJournal: Journal = {
        journalId: crypto.randomUUID(),
        journalNumber: request.prevJournalNumber + 1,
        userId: request.requestuserId,
        title: "New Journal"
    }
    await db
        .insert(journals)
        .values(newJournal)

    return newJournal;

}

export const updateJournal = async (db: DBtype, request: UpdateJournalRequest) => {
    
    await db
        .update(journals)
        .set(
            {title: request.journalTitle}
        )
        .where(
            eq(journals.journalId, request.journalId)
        )
    return true;
}

export const getJournalList = async (db: DBtype, request: GetJournalListRequest) => {
    const journalList : Journal[] = await db.select()
                                            .from(journals)
                                            .orderBy(desc(journals.dateCreated))
                                            .offset(request.listStart)
                                            .limit(request.listEnd - request.listStart)

    return journalList;
}

export const getJournalById = async (db: DBtype, request: GetJournalByIdRequest) => {
    const journalList : Journal[] = await db.select()
                                            .from(journals)
                                            .where(eq(journals.journalId, request.journalId))

    return journalList[0];
}

export const deleteJournal = async (db: DBtype, request: GetJournalByIdRequest) => {
    await db.delete(journals)
            .where(eq(journals.journalId, request.journalId))

    return true;
}