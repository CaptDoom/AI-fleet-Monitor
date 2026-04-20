import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError } from './firebase';
import { ModelQuota } from '../types';
import { useAuth } from './AuthContext';

export const useQuotas = () => {
  const { profile } = useAuth();
  const [quotas, setQuotas] = useState<ModelQuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!profile) {
      setQuotas([]);
      setLoading(false);
      return;
    }

    // Combine primary email and linked emails
    const emails = [profile.email, ...profile.linkedEmails];
    
    // Firestore 'in' query supports up to 30 values. We constrain linkedEmails to 10 in rules.
    const q = query(
      collection(db, 'quotas'), 
      where('ownerEmail', 'in', emails)
    );
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ModelQuota[];
        
        // Manual sorting since 'in' doesn't support 'orderBy' comfortably with multiple fields in some cases
        const sorted = data.sort((a, b) => a.provider.localeCompare(b.provider));
        setQuotas(sorted);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching quotas:", err);
        try {
          handleFirestoreError(err, 'list', '/quotas');
        } catch (wrappedErr: any) {
          setError(wrappedErr.message);
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [profile]);

  return { quotas, loading, error };
};
