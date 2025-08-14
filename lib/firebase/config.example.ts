import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Example Firebase configuration using environment variables
// This is a template - you'll need to set up your actual environment variables
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "your-api-key",
  authDomain:
    Constants.expoConfig?.extra?.firebaseAuthDomain ||
    "your-project-id.firebaseapp.com",
  projectId:
    Constants.expoConfig?.extra?.firebaseProjectId || "your-project-id",
  storageBucket:
    Constants.expoConfig?.extra?.firebaseStorageBucket ||
    "your-project-id.appspot.com",
  messagingSenderId:
    Constants.expoConfig?.extra?.firebaseMessagingSenderId ||
    "your-messaging-sender-id",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
export default app;

/*
To use this configuration with environment variables:

1. Create a .env file in your project root:
   FIREBASE_API_KEY=your-actual-api-key
   FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-actual-app-id

2. Update your app.json to include:
   {
     "expo": {
       "extra": {
         "firebaseApiKey": process.env.FIREBASE_API_KEY,
         "firebaseAuthDomain": process.env.FIREBASE_AUTH_DOMAIN,
         "firebaseProjectId": process.env.FIREBASE_PROJECT_ID,
         "firebaseStorageBucket": process.env.FIREBASE_STORAGE_BUCKET,
         "firebaseMessagingSenderId": process.env.FIREBASE_MESSAGING_SENDER_ID,
         "firebaseAppId": process.env.FIREBASE_APP_ID
       }
     }
   }

3. Rename this file to config.ts and use it instead of the basic config.ts
*/
