import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserLevel, CorrectionLevel } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  isDemo: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsAdmin: (password: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemoStudent: (level?: UserLevel) => void;
  updatePreferences: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync with Firebase Auth state
  useEffect(() => {
    // Check if there is a saved admin session
    const savedAdmin = localStorage.getItem('kalam_admin_user');
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('kalam_admin_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsDemo(false);
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            // New user registration in Firestore
            const initialProfile: UserProfile = {
              uid: fbUser.uid,
              displayName: fbUser.displayName || 'Mahasiswa PBA',
              email: fbUser.email || '',
              role: 'student',
              selectedLevel: 'beginner',
              dailyGoalMinutes: 15,
              correctionLevel: 'moderate',
              showTranslation: true,
              showTashkeel: true,
              autoTts: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            await setDoc(userDocRef, initialProfile);
            setUser(initialProfile);
          }
        } catch (err: any) {
          console.error('Error fetching user profile:', err);
          handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
        }
      } else {
        if (!isDemo && !localStorage.getItem('kalam_admin_user')) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isDemo]);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      // Friendly message for popup cancellation or network issues
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Proses login dibatalkan oleh pengguna.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Jendela login sebelumnya masih terbuka.');
      } else {
        setError(err.message || 'Gagal login dengan akun Google. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async (password: string): Promise<{ success: boolean; message?: string }> => {
    setError(null);
    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'syafaadmin', password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setIsDemo(false);
        localStorage.setItem('kalam_admin_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Password admin salah' };
      }
    } catch (err) {
      // Direct fallback if serverless is unreachable in dev
      if (password === 'syafa123') {
        const adminProfile: UserProfile = {
          uid: 'admin_syafaadmin',
          displayName: 'Syafa (Admin Kalām Buddy)',
          email: 'syafaadmin@kalambuddy.edu',
          role: 'admin',
          selectedLevel: 'intermediate',
          dailyGoalMinutes: 30,
          correctionLevel: 'moderate',
          showTranslation: true,
          showTashkeel: true,
          autoTts: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setUser(adminProfile);
        setIsDemo(false);
        localStorage.setItem('kalam_admin_user', JSON.stringify(adminProfile));
        return { success: true };
      }
      return { success: false, message: 'Password admin tidak valid. Gunakan syafa123' };
    }
  };

  const loginAsDemoStudent = (level: UserLevel = 'beginner') => {
    const demoUser: UserProfile = {
      uid: 'demo_student_pba',
      displayName: 'Mahasiswa PBA (Demo)',
      email: 'mahasiswa.pba@demo.edu',
      role: 'student',
      selectedLevel: level,
      dailyGoalMinutes: 15,
      correctionLevel: 'moderate',
      showTranslation: true,
      showTashkeel: true,
      autoTts: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setIsDemo(true);
    setUser(demoUser);
  };

  const updatePreferences = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
    setUser(updatedUser);

    if (user.role === 'admin') {
      localStorage.setItem('kalam_admin_user', JSON.stringify(updatedUser));
      return;
    }

    if (firebaseUser && !isDemo) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userDocRef, updates);
      } catch (err) {
        console.error('Error updating profile in Firestore:', err);
      }
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('kalam_admin_user');
      setIsDemo(false);
      setUser(null);
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin: user?.role === 'admin',
        isDemo,
        signInWithGoogle,
        loginAsAdmin,
        loginAsDemoStudent,
        updatePreferences,
        logout,
        error,
        clearError: () => setError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
