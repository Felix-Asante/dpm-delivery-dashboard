import type { WalletTransactionTypes } from "@/config/constants";

export type Wallet = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  balance: string;
  totalEarned: string;
};

export type Transaction = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  amount: string;
  type: WalletTransactionTypes;
  reference: string;
};
