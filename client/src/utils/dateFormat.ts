/**
 * Date formatting utilities that automatically use the user's browser timezone
 * All functions use the browser's Intl API which respects the user's locale and timezone
 */

/**
 * Format a date to a localized string with date and time
 * @param date - Date string or Date object
 * @returns Formatted date string in user's timezone (e.g., "December 13, 2025, 3:30 PM")
 */
export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Format a date to a localized date string (no time)
 * @param date - Date string or Date object
 * @returns Formatted date string in user's timezone (e.g., "December 13, 2025")
 */
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format a date to a short localized date string
 * @param date - Date string or Date object
 * @returns Formatted short date string in user's timezone (e.g., "12/13/2025")
 */
export const formatShortDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

/**
 * Format a date to show only month and year
 * @param date - Date string or Date object
 * @returns Formatted month and year in user's timezone (e.g., "December 2025")
 */
export const formatMonthYear = (date: string | Date): string => {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
};

/**
 * Format a date to a compact format with time
 * @param date - Date string or Date object
 * @returns Compact formatted date string (e.g., "12/13/2025, 3:30 PM")
 */
export const formatCompactDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString();
};

/**
 * Get the user's timezone
 * @returns IANA timezone identifier (e.g., "America/New_York", "Europe/London")
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Get the user's locale
 * @returns Locale string (e.g., "en-US", "fr-FR")
 */
export const getUserLocale = (): string => {
  return navigator.language || "en-US";
};
