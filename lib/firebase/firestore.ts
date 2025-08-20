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
import {
  BankAccount,
  CreateBankAccountData,
  CreatePayoutAccountData,
  CreateTransactionPinData,
  PayoutAccount,
  TransactionPin,
  UpdateTransactionPinData,
} from "../types/bank-account";
import {
  CreateUserServicePreferencesData,
  UpdateUserServicePreferencesData,
  UserServicePreferences,
} from "../types/service-config";
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
  private static readonly SERVICE_PREFERENCES_COLLECTION = "servicePreferences";
  private static readonly BANK_ACCOUNTS_COLLECTION = "bankAccounts";
  private static readonly PAYOUT_ACCOUNTS_COLLECTION = "payoutAccounts";
  private static readonly TRANSACTION_PINS_COLLECTION = "transactionPins";

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

  // Create or update user service preferences
  static async setUserServicePreferences(
    userId: string,
    data: CreateUserServicePreferencesData
  ): Promise<UserServicePreferences> {
    try {
      const prefRef = doc(
        collection(db, this.SERVICE_PREFERENCES_COLLECTION),
        userId
      );

      const servicePreferences: UserServicePreferences = {
        userId,
        services: data.services,
        extraOptions: data.extraOptions || {},
        updatedAt: new Date(),
      };

      await setDoc(prefRef, servicePreferences);
      return servicePreferences;
    } catch (error: any) {
      throw new Error(
        `Failed to set user service preferences: ${error.message}`
      );
    }
  }

  // Get user service preferences
  static async getUserServicePreferences(
    userId: string
  ): Promise<UserServicePreferences | null> {
    try {
      const prefRef = doc(
        collection(db, this.SERVICE_PREFERENCES_COLLECTION),
        userId
      );
      const prefSnap = await getDoc(prefRef);

      if (prefSnap.exists()) {
        const data = prefSnap.data();
        return {
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserServicePreferences;
      }

      return null;
    } catch (error: any) {
      throw new Error(
        `Failed to get user service preferences: ${error.message}`
      );
    }
  }

  // Update user service preferences
  static async updateUserServicePreferences(
    userId: string,
    data: UpdateUserServicePreferencesData
  ): Promise<void> {
    try {
      const prefRef = doc(
        collection(db, this.SERVICE_PREFERENCES_COLLECTION),
        userId
      );

      await updateDoc(prefRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(
        `Failed to update user service preferences: ${error.message}`
      );
    }
  }

  // Delete user service preferences
  static async deleteUserServicePreferences(userId: string): Promise<void> {
    try {
      const prefRef = doc(
        collection(db, this.SERVICE_PREFERENCES_COLLECTION),
        userId
      );
      await deleteDoc(prefRef);
    } catch (error: any) {
      throw new Error(
        `Failed to delete user service preferences: ${error.message}`
      );
    }
  }

  // Bank Account methods
  static async createBankAccount(
    userId: string,
    data: CreateBankAccountData
  ): Promise<BankAccount> {
    try {
      const accountRef = doc(
        collection(db, this.BANK_ACCOUNTS_COLLECTION),
        userId
      );

      const bankAccount: BankAccount = {
        id: userId,
        userId,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountName: data.accountName,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(accountRef, bankAccount);
      return bankAccount;
    } catch (error: any) {
      throw new Error(`Failed to create bank account: ${error.message}`);
    }
  }

  static async getBankAccount(userId: string): Promise<BankAccount | null> {
    try {
      const accountRef = doc(
        collection(db, this.BANK_ACCOUNTS_COLLECTION),
        userId
      );
      const accountSnap = await getDoc(accountRef);

      if (accountSnap.exists()) {
        const data = accountSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as BankAccount;
      }

      return null;
    } catch (error: any) {
      throw new Error(`Failed to get bank account: ${error.message}`);
    }
  }

  // Payout Account methods
  static async createPayoutAccount(
    userId: string,
    data: CreatePayoutAccountData
  ): Promise<PayoutAccount> {
    try {
      const accountRef = doc(
        collection(db, this.PAYOUT_ACCOUNTS_COLLECTION),
        userId
      );

      const payoutAccount: PayoutAccount = {
        id: userId,
        userId,
        accountNumber: data.accountNumber,
        bankName: data.bankName,
        accountName: data.accountName,
        accountType: data.accountType,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(accountRef, payoutAccount);
      return payoutAccount;
    } catch (error: any) {
      throw new Error(`Failed to create payout account: ${error.message}`);
    }
  }

  static async getPayoutAccount(userId: string): Promise<PayoutAccount | null> {
    try {
      const accountRef = doc(
        collection(db, this.PAYOUT_ACCOUNTS_COLLECTION),
        userId
      );
      const accountSnap = await getDoc(accountRef);

      if (accountSnap.exists()) {
        const data = accountSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as PayoutAccount;
      }

      return null;
    } catch (error: any) {
      throw new Error(`Failed to get payout account: ${error.message}`);
    }
  }

  static async updatePayoutAccount(
    userId: string,
    data: Partial<CreatePayoutAccountData>
  ): Promise<void> {
    try {
      const accountRef = doc(
        collection(db, this.PAYOUT_ACCOUNTS_COLLECTION),
        userId
      );

      await updateDoc(accountRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update payout account: ${error.message}`);
    }
  }

  // Transaction Pin methods
  static async createTransactionPin(
    userId: string,
    data: CreateTransactionPinData
  ): Promise<TransactionPin> {
    try {
      const pinRef = doc(
        collection(db, this.TRANSACTION_PINS_COLLECTION),
        userId
      );

      const transactionPin: TransactionPin = {
        id: userId,
        userId,
        pinHash: data.pin, // In production, this should be hashed
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(pinRef, transactionPin);
      return transactionPin;
    } catch (error: any) {
      throw new Error(`Failed to create transaction pin: ${error.message}`);
    }
  }

  static async getTransactionPin(
    userId: string
  ): Promise<TransactionPin | null> {
    try {
      const pinRef = doc(
        collection(db, this.TRANSACTION_PINS_COLLECTION),
        userId
      );
      const pinSnap = await getDoc(pinRef);

      if (pinSnap.exists()) {
        const data = pinSnap.data();
        return {
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as TransactionPin;
      }

      return null;
    } catch (error: any) {
      throw new Error(`Failed to get transaction pin: ${error.message}`);
    }
  }

  static async updateTransactionPin(
    userId: string,
    data: UpdateTransactionPinData
  ): Promise<void> {
    try {
      const pinRef = doc(
        collection(db, this.TRANSACTION_PINS_COLLECTION),
        userId
      );

      await updateDoc(pinRef, {
        pinHash: data.newPin, // In production, this should be hashed
        updatedAt: new Date(),
      });
    } catch (error: any) {
      throw new Error(`Failed to update transaction pin: ${error.message}`);
    }
  }
}
