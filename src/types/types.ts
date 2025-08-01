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

export interface AuthResponse {
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


// ========== JOURNAL ENTRY ==========
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

export interface CreateJournalRequest {
  prevJournalNumber: number;
  requestuserId: string;
};

export interface UpdateJournalRequest {
  journalTitle: number;
  journalId: string;
};

export interface GetJournalRequest {
  start: number;
  end: number;
};

export interface GetJournalRequestId {
  journalId: string;
};

export interface DeleteJournalRequest {
  journalId: string;
};

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