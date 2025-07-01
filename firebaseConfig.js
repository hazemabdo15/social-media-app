// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8aFZMAvSc9cVu2bkExXfWGLXb228yGgI",
  authDomain: "react-native-app-c113f.firebaseapp.com",
  projectId: "react-native-app-c113f",
  storageBucket: "react-native-app-c113f.appspot.com",
  messagingSenderId: "255221793699",
  appId: "1:255221793699:web:a5abf7027d628722019016",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
export { app, auth, db };
