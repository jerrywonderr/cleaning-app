import { clsx, type ClassValue } from "clsx";
// import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class values using clsx and tailwind-merge.
 * @param inputs The class values to merge.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// /**
//  * Decodes a JWT token and returns the payload as a generic type.
//  * @param token The JWT token to decode.
//  * @returns The decoded payload of the JWT token.
//  * @throws If the token is invalid or cannot be decoded.
//  */
// export function decodeToken<T>(token: string): T {
//   try {
//     return jwtDecode<T>(token);
//   } catch (error) {
//     console.error("Error decoding token:", error);
//     throw error;
//   }
// }
