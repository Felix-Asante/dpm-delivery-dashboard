export enum PayoutMethod {
  MOBILE_MONEY = "mobile_money",
  BANK_TRANSFER = "bank_transfer",
}

export enum PayoutRequestStatus {
  PENDING = "pending",
  // PROCESSING = "processing",
  APPROVED = "approved",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  FAILED = "failed",
}

export interface CreatePayoutRequestDto {
  amount: number;
  payoutMethod: PayoutMethod;
  mobileMoneyProvider?: string;
  mobileMoneyNumber?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  bankCode?: string;
  notes?: string;
}

export interface UpdatePayoutRequestStatusDto {
  status: PayoutRequestStatus;
  rejectionReason?: string;
  failureReason?: string;
  notes?: string;
  externalReference?: string;
  transactionId?: string;
}

export interface PayoutRequestRider {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  phone: string;
  email: string;
  fullName: string;
  profilePicture: string | null;
  isVerified: boolean;
}

export interface PayoutRequestWallet {
  id: string;
  balance: string;
  totalEarned: string;
}

export interface PayoutRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  amount: string;
  status: PayoutRequestStatus;
  payoutMethod: string;
  accountNumber?: string | null;
  accountName?: string | null;
  bankName?: string | null;
  bankCode?: string | null;
  mobileMoneyProvider?: string | null;
  mobileMoneyNumber?: string | null;
  reference: string;
  externalReference?: string | null;
  transactionId?: string | null;
  rejectionReason?: string | null;
  notes?: string | null;
  approvedAt?: string | null;
  processedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  processingFee: string;
  netAmount: string;
  requestIp: string;
  retryCount: number;
  lastRetryAt?: string | null;
  metadata?: any;
  rider: PayoutRequestRider;
  wallet: PayoutRequestWallet;
  approvedBy?: any;
  processedBy?: any;
}
