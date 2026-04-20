import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

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
  addLinkedEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null,
  loading: true, 
  addLinkedEmail: async () => {} 
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const addLinkedEmail = async (email: string) => {
    if (!user || !profile) return;
    if (profile.linkedEmails.includes(email)) return;
    
    const userRef = doc(db, 'users', user.uid);
    const newLinkedEmails = [...profile.linkedEmails, email];
    await setDoc(userRef, { linkedEmails: newLinkedEmails }, { merge: true });
    setProfile({ ...profile, linkedEmails: newLinkedEmails });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        try {
          console.log("Fetching user profile for:", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
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
        } catch (error: any) {
          console.error("Error syncing user profile Detail:", {
            code: error.code,
            message: error.message,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
          });
        }
      } else {
        setProfile(null);
      }
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, addLinkedEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
