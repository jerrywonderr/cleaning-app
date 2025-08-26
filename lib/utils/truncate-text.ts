export function truncateText(
  str: string,
  maxLength: number,
  ending = "..."
): string {
  if (str.length > maxLength) {
    // If the string is longer than maxLength, truncate it and add the ending
    return str.slice(0, maxLength - ending.length) + ending;
  } else {
    // Otherwise, return the original string
    return str;
  }
}
