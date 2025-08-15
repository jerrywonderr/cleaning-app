import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";
// import { jwtDecode } from "jwt-decode";

/**
 * Format date to "8th of June, 2000" format
 * Handles multiple date formats including MM/DD/YY, MM/DD/YYYY, and ISO dates
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'Not set';
  
  try {
    let date: Date;
    
    // Handle different date formats
    if (dateString.includes('/')) {
      // Handle "08/08/08" format - assume MM/DD/YY or MM/DD/YYYY
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1; // Month is 0-indexed
        const day = parseInt(parts[1]);
        let year = parseInt(parts[2]);
        
        // Handle 2-digit years (assume 20xx for years < 50, 19xx for years >= 50)
        if (year < 50) year += 2000;
        else if (year < 100) year += 1900;
        
        date = new Date(year, month, day);
      } else {
        throw new Error('Invalid date format');
      }
    } else {
      // Try ISO format first
      date = parseISO(dateString);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return format(date, "do 'of' MMMM, yyyy");
  } catch (error) {
    // If parsing fails, return the original string
    return dateString;
  }
};

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
