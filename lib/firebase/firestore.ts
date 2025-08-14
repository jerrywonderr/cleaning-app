import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./config";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  isServiceProvider: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
}

export interface CreateUserProfileData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  isServiceProvider: boolean;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dob?: string;
  isServiceProvider?: boolean;
  profileImage?: string;
}

export class FirebaseFirestoreService {
  private static readonly USERS_COLLECTION = "users";

  // Create a new user profile
  static async createUserProfile(
    userId: string,
    data: CreateUserProfileData
  ): Promise<UserProfile> {
    try {
      const userRef = doc(collection(db, this.USERS_COLLECTION), userId);

      const userProfile: UserProfile = {
        id: userId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userRef, userProfile);
      return userProfile;
    } catch (error: any) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(collection(db, this.USERS_COLLECTION), userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile;
      }

      return null;
    } catch (error: any) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  // Update user profile
  static async updateUserProfile(
    userId: string,
    data: UpdateUserProfileData
  ): Promise<void> {
    try {
      const userRef = doc(collection(db, this.USERS_COLLECTION), userId);

      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  }

  // Delete user profile
  static async deleteUserProfile(userId: string): Promise<void> {
    try {
      const userRef = doc(collection(db, this.USERS_COLLECTION), userId);
      await deleteDoc(userRef);
    } catch (error: any) {
      throw new Error(`Failed to delete user profile: ${error.message}`);
    }
  }

  // Get user profile by email
  static async getUserProfileByEmail(
    email: string
  ): Promise<UserProfile | null> {
    try {
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile;
      }

      return null;
    } catch (error: any) {
      throw new Error(`Failed to get user profile by email: ${error.message}`);
    }
  }

  // Get all service providers
  static async getServiceProviders(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where("isServiceProvider", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const serviceProviders: UserProfile[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        serviceProviders.push({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile);
      });

      return serviceProviders;
    } catch (error: any) {
      throw new Error(`Failed to get service providers: ${error.message}`);
    }
  }

  // Get all customers
  static async getCustomers(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where("isServiceProvider", "==", false)
      );

      const querySnapshot = await getDocs(q);
      const customers: UserProfile[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        customers.push({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile);
      });

      return customers;
    } catch (error: any) {
      throw new Error(`Failed to get customers: ${error.message}`);
    }
  }

  // Search users by name
  static async searchUsersByName(searchTerm: string): Promise<UserProfile[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple prefix search - you might want to use Algolia or similar for better search
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where("firstName", ">=", searchTerm),
        where("firstName", "<=", searchTerm + "\uf8ff")
      );

      const querySnapshot = await getDocs(q);
      const users: UserProfile[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile);
      });

      return users;
    } catch (error: any) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }
}
