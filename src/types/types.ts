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
export interface Page {
  pageId: string;
  userId: string;
  pageTitle: string;
  pageNumber: number;
  content: string;
  mood: number;
  color: string;
}

export interface CreatePageRequest {
  title: string
  content: string
  color?: string
  mood: number
}

export interface UpdatePageRequest {
  title?: string
  content?: string
  color?: string
  mood?: number
  pageNumber: number
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