import { ApiResponse } from "../types/types";

export const success = <T>(data: T, message = "OK"): ApiResponse<T> => ({
    success: true,
    data,
    message,
})

export const failure = <T>(data: T, message = "Something went wrong"): ApiResponse<null> => ({
    success: false,
    data: null,
    message,
})