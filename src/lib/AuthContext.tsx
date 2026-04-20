import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocFromServer, enableNetwork } from 'firebase/firestore';
import { auth, db, signInWithGoogle as firebaseSignInWithGoogle } from './firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: string;
  linkedEmails: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<any>;
  addLinkedEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null,
  loading: true, 
  error: null,
  signInWithGoogle: async () => {},
  addLinkedEmail: async () => {} 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const addLinkedEmail = async (email: string) => {
    if (!user || !profile) return;
    if (profile.linkedEmails.includes(email)) return;
    
    const userRef = doc(db, 'users', user.uid);
    const newLinkedEmails = [...profile.linkedEmails, email];
    await setDoc(userRef, { linkedEmails: newLinkedEmails }, { merge: true });
    setProfile({ ...profile, linkedEmails: newLinkedEmails });
  };

  useEffect(() => {
    // Explicitly enable network
    enableNetwork(db).catch(() => {});

    // Test connection once on mount
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'system', 'health'));
      } catch (e) {}
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync to Firestore with retry logic
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        const fetchProfile = async (retries = 3, delay = 1000): Promise<void> => {
          try {
            console.log(`Fetching user profile (Attempt ${4 - retries}) for:`, firebaseUser.uid);
            const userSnap = await getDocFromServer(userRef);
            let currentProfile: UserProfile;
            
            if (!userSnap.exists()) {
              console.log("No profile found, creating new profile...");
              currentProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || null,
                role: 'member',
                linkedEmails: []
              };
              await setDoc(userRef, {
                ...currentProfile,
                createdAt: new Date().toISOString()
              });
              console.log("Profile created successfully.");
            } else {
              console.log("Profile found, syncing local state.");
              currentProfile = userSnap.data() as UserProfile;
            }
            setProfile(currentProfile);
            setError(null);
          } catch (err: any) {
            if (retries > 0 && err.message?.includes('offline')) {
              console.warn(`Profile sync failed (offline). Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              return fetchProfile(retries - 1, delay * 2);
            }
            console.error("Error syncing user profile Detail:", err);
            setError(err);
          }
        };

        await fetchProfile();
      } else {
        setProfile(null);
        setError(null);
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signInWithGoogle: firebaseSignInWithGoogle, addLinkedEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
