/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  //   verify recent authentication 
  const reauthenticateUser = useCallback(async (currentPassword) => {
    if (!isFirebaseConfigured() || !auth || !currentUser) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    const user = auth.currentUser;
    // create credential with email and current password
    const credentials = EmailAuthProvider.credential(user.email, currentPassword);

    // Re-authenticate the user
    await reauthenticateWithCredential(user, credentials);
  })


  // signup function
  const signup = useCallback(async (email, password, fullName) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      fullName: fullName,
      createdAt: serverTimestamp(),
      provider: "email",
    });

    // Initialize leaderboard entry for new user
    await setDoc(doc(db, "leaderboard", user.uid), {
      uid: user.uid,
      displayName: fullName,
      photoURL: null,
      score: 0,
      activitiesCount: 0,
      lastUpdated: serverTimestamp(),
    });

    console.log('✅ User account created:', user.email);
    return userCredential;
  }, []);

  //   login function
  const login = useCallback(async (email, password) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  }, []);

  //   login with google function
  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth || !googleProvider) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || "Google User",
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        provider: "google",
      });

      // Initialize leaderboard entry for new user
      await setDoc(doc(db, "leaderboard", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "Google User",
        photoURL: user.photoURL,
        score: 0,
        activitiesCount: 0,
        lastUpdated: serverTimestamp(),
      });
    }

    return userCredential;
  }, []);

  //   logout function
  const logout = useCallback(async () => {
    if (!isFirebaseConfigured() || !auth) {
      return;
    }
    await signOut(auth);
  }, []);

  //   change Password function
  const ChangePassword = useCallback(async (currentPassword, newPassword) => {
    if (!isFirebaseConfigured() || !auth || !auth.currentUser) {
      throw new Error('User  is Not Authenticated');
    }
    const user = auth.currentUser;

    // re-authenticate user
    await reauthenticateUser(currentPassword);

    // update Password
    await updatePassword(user, newPassword);

  }, [reauthenticateUser]);

  //   reset Password function
  const resetPassword = useCallback(async (email) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured. Please add Firebase credentials to use authentication."
      );
    }
    await sendPasswordResetEmail(auth, email);
  }, []);

  //   send verification email function
  const sendVerificationEmail = useCallback(async (user = null) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error(
        "Firebase is not configured."
      );
    }
    
    const userToVerify = user || auth.currentUser;
    if (!userToVerify) {
      throw new Error("No user is logged in.");
    }
    
    console.log('📧 Sending verification email to:', userToVerify.email);
    await sendEmailVerification(userToVerify);
    console.log('✅ Verification email sent successfully');
  }, []);

  //   check if user signed in with email/password
  const isEmailProvider = useCallback(() => {
    if (!auth?.currentUser) return false;

    // check if user has email/password as a  provider
    return auth.currentUser.providerData.some(
      (provider) => provider.providerId === 'password');
  }, []);

  //   delete unverified account if expired (> 24 hours)
  const deleteExpiredUnverifiedAccount = useCallback(async (user, userData) => {
    try {
      // Only check email/password accounts
      const isEmailUser = user.providerData.some(
        (provider) => provider.providerId === 'password'
      );
      
      if (!isEmailUser || user.emailVerified) {
        return false; // Account is verified or not email-based
      }

      // Check if account is older than 24 hours
      const createdAt = userData?.createdAt?.toDate() || user.metadata.creationTime;
      const accountAge = Date.now() - new Date(createdAt).getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (accountAge > twentyFourHours) {
        console.log('Deleting expired unverified account:', user.email);
        
        // Delete Firestore documents
        await deleteDoc(doc(db, "users", user.uid));
        await deleteDoc(doc(db, "leaderboard", user.uid));
        
        // Delete auth account
        await deleteUser(user);
        
        return true; // Account was deleted
      }
      
      return false; // Account not expired yet
    } catch (error) {
      console.error('Error deleting expired account:', error);
      return false;
    }
  }, []);

  //   Monitor auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      return;
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Check if account should be deleted (unverified > 24 hours)
            const wasDeleted = await deleteExpiredUnverifiedAccount(user, userData);
            if (wasDeleted) {
              setCurrentUser(null);
              setLoading(false);
              return;
            }
            
            console.log("Fetched user data from Firestore:", userData);
            setCurrentUser({
              ...user,
              fullName: userData.fullName,
            });
            console.log("Current user after merge:", {
              ...user,
              fullName: userData.fullName,
            });

            // Initialize leaderboard entry if it doesn't exist
            const leaderboardDoc = await getDoc(
              doc(db, "leaderboard", user.uid)
            );
            if (!leaderboardDoc.exists()) {
              await setDoc(doc(db, "leaderboard", user.uid), {
                uid: user.uid,
                displayName: userData.fullName || user.displayName || "User",
                photoURL: user.photoURL || null,
                score: 0,
                activitiesCount: 0,
                lastUpdated: serverTimestamp(),
              });
            }
          } else {
            setCurrentUser(user);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [deleteExpiredUnverifiedAccount]);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      signup,
      login,
      loginWithGoogle,
      logout,
      ChangePassword,
      resetPassword,
      isEmailProvider,
      sendVerificationEmail,
    }),
    [currentUser, loading, signup, login, loginWithGoogle, logout, ChangePassword, resetPassword, isEmailProvider, sendVerificationEmail]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
