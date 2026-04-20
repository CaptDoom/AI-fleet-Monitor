import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, collection, onSnapshot, query, where } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

export const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'] = 'get', path: string | null = null): never => {
  if (error.code === 'permission-denied' || error.message?.includes('insufficient permissions')) {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message || 'Missing or insufficient permissions',
      operationType,
      path,
      authInfo: {
        userId: auth.currentUser?.uid || 'unauthenticated',
        email: auth.currentUser?.email || null,
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || false,
        providerInfo: auth.currentUser?.providerData || [],
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
};

// Connection Test as required by instructions
async function testConnection() {
  try {
    const testDoc = doc(db, 'system', 'health');
    await getDocFromServer(testDoc);
    console.log("Firestore connection verified");
  } catch (error) {
    if (error instanceof Error && error.message.includes('permission-denied')) {
      console.warn("Firestore connection check failed: Permission Denied (this is expected if document doesn't exist but connection was attempted)");
    } else if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client is offline");
    }
  }
}

testConnection();
