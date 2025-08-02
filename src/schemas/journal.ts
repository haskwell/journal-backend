import z from "zod";

export const CreateJournalSchema = z.object({
    prevJournalNumber: z.int().nonnegative(),
    requestuserId: z.string()
});

export const UpdateJournalSchema = z.object({
    journalTitle: z.string(),
    journalId: z.string()
})

export const GetJournalListSchema = z.object({
    listStart: z.int().nonnegative(),
    listEnd: z.int().nonnegative()
})

export const GetJournalByIdSchema = z.object({
    journalId: z.string()
})

export const DeleteJournalSchema = z.object({
    journalId: z.string()
})