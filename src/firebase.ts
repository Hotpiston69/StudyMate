import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkqdAcLpE8K3zzwNBuvVfvlwyOmKzXQns",
  authDomain: "studymate-822cf.firebaseapp.com",
  projectId: "studymate-822cf",
  storageBucket: "studymate-822cf.firebasestorage.app",
  messagingSenderId: "48087378988",
  appId: "1:48087378988:web:838cdf4838250e8c81b589",
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
