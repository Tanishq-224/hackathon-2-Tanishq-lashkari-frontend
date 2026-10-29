import axios, { type AxiosError } from 'axios'

/**
 * @description Shared Axios instance for Repairex backend API calls.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env?.VITE_API_URL ?? 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

/**
 * @description Extracts a user-facing message from an Axios error when possible.
 * @param {unknown} error - Caught error from an API call.
 * @returns {string} Safe error message for UI display.
 */
export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong. Please try again.'
  }

  const axiosError = error as AxiosError<{ message?: string }>
  const message = axiosError.response?.data?.message

  if (typeof message === 'string' && message.length > 0) {
    return message
  }

  if (axiosError.message) {
    return axiosError.message
  }

  return 'Something went wrong. Please try again.'
}
