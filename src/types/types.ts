// ========== USER ==========
export interface User {
  userId: string
  username: string
  email: string
  passwordHash: string
  //dateCreated: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface PasswordResetRequestType {
  email: string
}

export interface PasswordResetType {
  password: string
  token: string
}

// ========== JOURNAL ==========
export interface Journal {
  journalId: string
  userId: string
  title: string
  //dateCreated: string
  journalNumber: number
}

export interface CreateJournalRequest {
  prevJournalNumber: number;
  requestuserId: string;
};

export interface UpdateJournalRequest {
  journalTitle: string;
  journalId: string;
};

export interface GetJournalListRequest {
  listStart: number;
  listEnd: number;
};

export interface GetJournalByIdRequest {
  journalId: string;
};

export interface DeleteJournalRequest {
  journalId: string;
};

// ========== ENTRIES ==========
export interface JournalEntry {
  entryId: number
  journalId: number
  title: string
  content: string
  color: string | null
  mood: number | null
  dateCreated: string | null
  dateModified: string | null
}

export interface CreateEntryRequest {
  title: string
  content: string
  color?: string
  mood: number
}

export interface UpdateEntryRequest {
  title?: string
  content?: string
  color?: string
  mood?: number
}


// ========== SHARED ENTRIES ==========
export interface SharedEntry {
  sharingId: number
  entryId: number
  fromUserId: number
  toUserId: number
  dateShared: string
}

export interface ShareEntryRequest {
  entryId: number
  toUserId: number
}

// ========== API RESPONSE ==========
export interface ApiResponse<T>{
    success: boolean;
    data: T;
    message: string;
}