import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true to check initial auth state
  const [error, setError] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Auth state is now determined
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  async function signUp(name, email, password) {
    try {
      setError(null);
      setLoading(true);
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", userCredentials.user.uid), {
        uid: userCredentials.user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
      });

      // Update the user profile with the display name
      await updateProfile(userCredentials.user, {
        displayName: name,
      });

      console.log(
        "@signUp() @AuthProvider ---- sign up success ---- userCredentials =",
        userCredentials
      );
      console.log(
        "@signUp() @AuthProvider ---- display name updated to:",
        name
      );
      // onAuthStateChanged will automatically update the user state
    } catch (error) {
      console.log(
        "@signUp() @AuthProvider ---- sign up failure ---- error.code =",
        error.code,
        "---- error.message =",
        error.message
      );
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  }

  async function logIn(email, password) {
    try {
      setError(null);
      setLoading(true);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(
        "@logIn() @AuthProvider ---- log in success ---- userCredentials =",
        userCredentials
      );
      // onAuthStateChanged will automatically update the user state
    } catch (error) {
      console.log(
        "@logIn() @AuthProvider ---- log in failure ---- error.code =",
        error.code,
        "---- error.message =",
        error.message
      );
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  }

  async function logOut() {
    try {
      setError(null);
      setLoading(true);
      await signOut(auth);
      console.log("@logOut() @AuthProvider ---- log out success");
      // onAuthStateChanged will automatically update the user state to null
    } catch (error) {
      console.log(
        "@logOut() @AuthProvider ---- log out failure ---- error.code =",
        error.code,
        "---- error.message =",
        error.message
      );
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  }

  function getErrorMessage(errorCode) {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/email-already-in-use":
        return "This email is already in use";
      case "auth/invalid-credential":
        return "Invalid credentials provided";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/missing-password":
        return "Password is required";
      default:
        return "An error occurred";
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signUp, logIn, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
