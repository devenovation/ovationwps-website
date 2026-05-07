import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./config";

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function subscribeToAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
