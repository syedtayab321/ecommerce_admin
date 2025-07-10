import { initializeApp } from "firebase/app";
import { getAuth, setPersistence,browserLocalPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage, ref, updateMetadata } from "firebase/storage";
import { getPerformance } from "firebase/performance";
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);
const performance = getPerformance(app);
const analytics = getAnalytics(app);

// Security and persistence settings
const configureFirebase = async () => {
  try {
    // Set authentication persistence
    await setPersistence(auth, browserLocalPersistence);
    
    // Enable Firestore offline persistence
    if (process.env.NODE_ENV === 'production') {
      await enableIndexedDbPersistence(db)
        .catch((err) => {
          if (err.code === 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
          } else if (err.code === 'unimplemented') {
            console.warn('The current browser does not support all of the features required to enable persistence.');
          }
        });
    }

    // Emulator settings for development
    if (process.env.NODE_ENV === 'development') {
      connectFunctionsEmulator(functions, "localhost", 5001);
      console.log('Firebase emulators connected for development');
    }

    // Security headers for storage
    const storageRef = ref(storage);
    // updateMetadata(storageRef, {
    //   cacheControl: 'public,max-age=3600',
    //   contentDisposition: 'inline'
    // });

  } catch (error) {
    console.error('Firebase configuration error:', error);
  }
};

configureFirebase();

export { 
  auth, 
  db, 
   db as firestore, // Add this line
  storage, 
  functions, 
  performance, 
  analytics 
};