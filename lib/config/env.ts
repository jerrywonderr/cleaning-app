import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

// Helper function to get environment variable
function getEnvVar(key: string): string | undefined {
  return extra[key];
}

// Export variables
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
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};
