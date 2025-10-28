export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StripeConnectAccount {
  id: string;
  userId: string;
  stripeConnectAccountId: string;
  stripeAccountStatus:
    | "pending"
    | "active"
    | "completed"
    | "restricted"
    | "rejected";
  accountSetupData?: {
    address: AddressData;
    createdAt: Date;
  };
  onboardingUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface StripeAccountSetupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: AddressData;
}

export interface StripeAccountStatusResponse {
  success: boolean;
  accountId: string;
  status: "pending" | "active" | "restricted" | "completed";
  needsOnboarding: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  onboardingUrl?: string | null;
  message?: string;
  requirements?: any;
}

export interface StripeAccountSetupResponse {
  success: boolean;
  accountId: string;
  onboardingUrl: string;
  message: string;
}

export interface PayoutAccount {
  id: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  accountType: "savings" | "current";
  isActive: boolean;
  isDefault: boolean; // New: mark one as default
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionPin {
  id: string;
  userId: string;
  pinHash: string;
  salt: string; // Added: salt for PIN hashing
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBankAccountData {
  userId: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export interface CreatePayoutAccountData {
  userId: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  accountType: "savings" | "current";
  isDefault?: boolean; // New: optional default flag
}

export interface CreateTransactionPinData {
  pin: string;
}

export interface UpdateTransactionPinData {
  currentPin: string;
  newPin: string;
}

export interface VerifyPinData {
  userId: string;
  pin: string;
}

export interface DeletePayoutAccountData {
  userId: string;
  payoutAccountId: string;
  pin: string; // Required for deletion
}

export interface SetDefaultPayoutAccountData {
  userId: string;
  payoutAccountId: string;
  pin: string; // Required for changing default
}

export interface BankInfo {
  code: string;
  name: string;
}

// New: Response types for PIN verification
export interface PinVerificationResponse {
  isValid: boolean;
  message?: string;
}
