import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./config";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  // dob: string;
  isServiceProvider: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  // dob: string;
  isServiceProvider: boolean;
}

export interface SignInData {
  email: string;
  password: string;
}

export class FirebaseAuthService {
  // Sign up with email and password
  static async signUp(data: SignUpData): Promise<AuthUser> {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Create user object with Firebase UID
    const user: AuthUser = {
      id: userCredential.user.uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      // dob: data.dob,
      isServiceProvider: data.isServiceProvider,
    };

    return user;
  }

  // Sign in with email and password
  static async signIn(data: SignInData): Promise<AuthUser> {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // For now, return a basic user object
    // In a real app, you'd fetch additional user data from Firestore
    const user: AuthUser = {
      id: userCredential.user.uid,
      email: userCredential.user.email || "",
      firstName: "", // You'd fetch this from Firestore
      lastName: "", // You'd fetch this from Firestore
      phone: "", // You'd fetch this from Firestore
      // dob: "", // You'd fetch this from Firestore
      isServiceProvider: false, // You'd fetch this from Firestore
    };

    return user;
  }

  // Sign out
  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  static async deleteAccount(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user.");
    }
    await deleteUser(currentUser);
  }

  // Send password reset email
  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  }
}
