import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import firebaseConfigFile from "../../firebase-applet-config.json";

// Support both environment variables (for Vercel / GitHub Actions / Netlify / Custom Host)
// and the local firebase-applet-config.json for AI Studio development.
const firebaseConfig = {
  projectId:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_PROJECT_ID) ||
    firebaseConfigFile?.projectId ||
    "pristine-shade-ls7sz",
  appId:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_APP_ID) ||
    firebaseConfigFile?.appId ||
    "1:693433277059:web:e33a14840d737f844d99b6",
  apiKey:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_API_KEY) ||
    firebaseConfigFile?.apiKey ||
    "AIzaSyDQDuF7DcVnuyHBm4i1YVglr9bw2VE39Yw",
  authDomain:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) ||
    firebaseConfigFile?.authDomain ||
    "pristine-shade-ls7sz.firebaseapp.com",
  firestoreDatabaseId:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_DATABASE_ID) ||
    firebaseConfigFile?.firestoreDatabaseId ||
    "ai-studio-americanbookfoun-0b29e0f1-db1b-4d01-9805-9afc639ab23d",
  storageBucket:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) ||
    firebaseConfigFile?.storageBucket ||
    "pristine-shade-ls7sz.firebasestorage.app",
  messagingSenderId:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
    firebaseConfigFile?.messagingSenderId ||
    "693433277059",
  measurementId:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID) ||
    firebaseConfigFile?.measurementId ||
    "",
  oAuthClientId:
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_OAUTH_CLIENT_ID) ||
    firebaseConfigFile?.oAuthClientId ||
    "693433277059-vq25cvks0e3aljp1ijka2tcc8o85103e.apps.googleusercontent.com",
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with specific database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Error Handler Implementation per Firebase Integration Standard
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
