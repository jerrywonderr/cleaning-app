import Constants from "expo-constants";

// Helper function to get environment variable from either .env (development) or expo-constants (EAS builds)
function getEnvVar(key: string): string | undefined {
  // For development: try process.env first (from .env file with EXPO_PUBLIC_ prefix)
  if (process.env[`EXPO_PUBLIC_${key}`]) {
    return process.env[`EXPO_PUBLIC_${key}`];
  }

  // For EAS builds: get from expo-constants
  return Constants.expoConfig?.extra?.[key];
}

// Validate required environment variables
const requiredEnvVars = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID",
];

export function validateEnvironment() {
  const missingVars = requiredEnvVars.filter((varName) => !getEnvVar(varName));

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}

// Export individual variables for use in other parts of the app
export const env = {
  FIREBASE_API_KEY: getEnvVar("FIREBASE_API_KEY")!,
  FIREBASE_AUTH_DOMAIN: getEnvVar("FIREBASE_AUTH_DOMAIN")!,
  FIREBASE_PROJECT_ID: getEnvVar("FIREBASE_PROJECT_ID")!,
  FIREBASE_STORAGE_BUCKET: getEnvVar("FIREBASE_STORAGE_BUCKET")!,
  FIREBASE_MESSAGING_SENDER_ID: getEnvVar("FIREBASE_MESSAGING_SENDER_ID")!,
  FIREBASE_APP_ID: getEnvVar("FIREBASE_APP_ID")!,
  FIREBASE_MEASUREMENT_ID: getEnvVar("FIREBASE_MEASUREMENT_ID"),
};

// Firebase configuration object
export const firebaseConfig = {
  apiKey: getEnvVar("FIREBASE_API_KEY"),
  authDomain: getEnvVar("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("FIREBASE_APP_ID"),
  measurementId: getEnvVar("FIREBASE_MEASUREMENT_ID"),
};
