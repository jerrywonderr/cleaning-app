import * as Crypto from "expo-crypto";

/**
 * PIN Hashing Utility
 * Provides secure PIN hashing with salt generation and verification
 */

// Generate a random salt for PIN hashing
export const generateSalt = (): string => {
  // Generate a random 16-byte salt and convert to hex string
  const randomBytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
};

// Hash a PIN with a salt using SHA-256
export const hashPin = async (pin: string, salt: string): Promise<string> => {
  console.log("🔐 hashPin called with:", {
    pin,
    salt: salt.substring(0, 10) + "...",
  });
  const message = pin + salt;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    message
  );
  console.log("🔐 hashPin result:", hash.substring(0, 10) + "...");
  return hash;
};

// Verify a PIN against a stored hash and salt
export const verifyPin = async (
  inputPin: string,
  storedHash: string,
  salt: string
): Promise<boolean> => {
  console.log("🔐 verifyPin called with:", {
    inputPin,
    storedHash: storedHash.substring(0, 10) + "...",
    salt: salt.substring(0, 10) + "...",
  });
  const inputHash = await hashPin(inputPin, salt);
  console.log("🔐 Input hash generated:", inputHash.substring(0, 10) + "...");
  console.log("🔐 Hash comparison:", inputHash === storedHash);
  return inputHash === storedHash;
};

// Generate a new PIN hash with salt
export const createPinHash = async (
  pin: string
): Promise<{ hash: string; salt: string }> => {
  const salt = generateSalt();
  const hash = await hashPin(pin, salt);
  return { hash, salt };
};
