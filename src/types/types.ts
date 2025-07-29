// ========== USER ==========
export interface User {
  userId: number
  username: string
  emailAddress: string
  passwordHash: string
  dateCreated: string
}

export interface RegisterRequest {
  username: string
  email_address: string
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
  journalId: number
  userId: number
  title: string
  dateCreated: string
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