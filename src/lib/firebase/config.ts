
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Analytics can be added later if needed

// Your web app's Firebase configuration should be stored in environment variables
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Add a check for essential Firebase environment variables
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.databaseURL ||
  !firebaseConfig.projectId
) {
  throw new Error(
    "Firebase environment variables are not set. Please check your .env file and ensure that NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_DATABASE_URL, and NEXT_PUBLIC_FIREBASE_PROJECT_ID are all defined."
  );
}


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Auth only on the client-side
let auth: Auth | undefined;
if (typeof window !== 'undefined') {
  auth = getAuth(app);
}

const db: Database = getDatabase(app);

// Example for client-side Analytics initialization (if you uncomment the import)
// if (typeof window !== 'undefined') {
//   if (app.name && typeof window !== "undefined") {
//     analytics = getAnalytics(app);
//   }
// }

export { app, auth, db };
