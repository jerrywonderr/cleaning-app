import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  parseISO,
} from "date-fns";
// import { jwtDecode } from "jwt-decode";

export const combineDateAndTime = (
  dateStr: string | Date,
  timeStr: string | Date
): string => {
  // Parse the date and time
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  const time = typeof timeStr === "string" ? parseISO(timeStr) : timeStr;

  // Create a new date with the date from dateStr
  const combinedDate = new Date(date);

  // Set the time components (this time is already in user's local time)
  combinedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);

  // Convert back to UTC for storage
  return new Date(combinedDate).toISOString();
};

export const combineDateAndTimeISO = (
  dateStr: string | Date,
  timeStr: string | Date
): string => {
  // Parse the date and time
  const date = typeof dateStr === "string" ? parseISO(dateStr) : dateStr;
  const time = typeof timeStr === "string" ? parseISO(timeStr) : timeStr;

  // Create a new date with the date from dateStr
  const combinedDate = new Date(date);

  // Set the time components (this time is already in user's local time)
  combinedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);

  // Get the timezone offset in minutes
  const offset = combinedDate.getTimezoneOffset();

  // console.log("offset", offset);

  // Create a date string with timezone information
  const dateWithTimezone = combinedDate.toISOString().replace(
    "Z",
    `${offset > 0 ? "-" : "+"}${Math.abs(offset / 60)
      .toString()
      .padStart(2, "0")}:00`
  );

  // Convert back to UTC for storage
  return new Date(dateWithTimezone).toISOString();
};

/**
 * Converts a UTC time string to the user's local timezone string
 * @param utcTimeString The UTC time string to convert (e.g., "2025-04-29T11:51:00.000Z")
 * @returns A string representing the time in the user's local timezone
 */
export const utcToLocalTime = (utcTimeString: string): string => {
  // Create a Date object from the UTC string
  const date = new Date(utcTimeString);

  // Get the timezone offset in minutes
  const offset = date.getTimezoneOffset();

  // Create a new date that's adjusted for the local timezone
  const localDate = new Date(date.getTime() - offset * 60000);

  // Convert to local time string with timezone information
  return localDate.toISOString().replace(
    "Z",
    `${offset > 0 ? "-" : "+"}${Math.abs(offset / 60)
      .toString()
      .padStart(2, "0")}:00`
  );
};

// Helper function to convert date strings to Date objects
export const utcToLocalDate = (dateValue: string): Date => {
  return parseISO(utcToLocalTime(dateValue));
};

export function getTimeRemaining(endDate: string): string {
  const now = new Date();
  const end = parseISO(endDate); // Parse ISO string with timezone info
  const diffInMinutes = differenceInMinutes(end, now);
  const diffInHours = differenceInHours(end, now);
  const diffInDays = differenceInDays(end, now);

  if (diffInMinutes < 60) {
    return `Ends in ${diffInMinutes} mins`;
  } else if (diffInHours < 24) {
    return `Ends in ${diffInHours} hours`;
  } else {
    return `Ends in ${diffInDays} days`;
  }
}
