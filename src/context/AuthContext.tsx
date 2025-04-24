import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  updateProfile,
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { toast } from '@/components/ui/sonner';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string) => {
    try {
      if (auth.app.options.apiKey.includes("placeholder") || auth.app.options.apiKey === "AIzaSyDqZsZyzE2aUcf-GxcuD9N41dJaHt-TNsE") {
        console.log("Using mock signup for:", email);
        const mockUser = {
          uid: 'mock-uid-' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          emailVerified: false,
        };
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentUser(mockUser as unknown as User);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        toast.success("Account created successfully!");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: email.split('@')[0]
      });
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already registered. Please log in instead.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email format. Please check your email.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Please use a stronger password.");
      } else {
        toast.error("Failed to create an account. Please try again.");
      }
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (auth.app.options.apiKey.includes("placeholder") || auth.app.options.apiKey === "AIzaSyDqZsZyzE2aUcf-GxcuD9N41dJaHt-TNsE") {
        console.log("Using mock login for:", email);
        const mockUser = {
          uid: 'mock-uid-' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          emailVerified: true,
        };
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentUser(mockUser as unknown as User);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        toast.success("Logged in successfully!");
        return;
      }

      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email format. Please check your email.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many failed login attempts. Please try again later.");
      } else {
        toast.error("Failed to log in. Please try again.");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (auth.app.options.apiKey.includes("placeholder") || auth.app.options.apiKey === "AIzaSyDqZsZyzE2aUcf-GxcuD9N41dJaHt-TNsE") {
        console.log("Using mock logout");
        setCurrentUser(null);
        localStorage.removeItem('mockUser');
        toast.success("Logged out successfully!");
        return;
      }

      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
      throw error;
    }
  };

  useEffect(() => {
    if (auth.app.options.apiKey.includes("placeholder") || auth.app.options.apiKey === "AIzaSyDqZsZyzE2aUcf-GxcuD9N41dJaHt-TNsE") {
      console.log("Using mock auth state");
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser) as unknown as User);
      }
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
