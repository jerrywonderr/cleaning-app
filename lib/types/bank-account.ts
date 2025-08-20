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

export interface PayoutAccount {
  id: string;
  userId: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  accountType: "savings" | "current";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionPin {
  id: string;
  userId: string;
  pinHash: string;
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
}

export interface CreateTransactionPinData {
  userId: string;
  pin: string;
}

export interface UpdateTransactionPinData {
  currentPin: string;
  newPin: string;
}

export interface BankInfo {
  code: string;
  name: string;
}
