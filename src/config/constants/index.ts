export const DEFAULT_CURRENCY = {
  label: "Cedis",
  symbol: "₵",
};

export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
}

export enum RiderBookingStatus {
  ASSIGNED = "rider_assigned",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REJECTED = "rejected",
}

export enum Periods {
  currentMonth = "currentMonth",
  last3Months = "last3Months",
  last6Months = "last6Months",
  currentYear = "currentYear",
  lastYear = "lastYear",
  twoYearsAgo = "2YearsAgo",
  last7Days = "last7Days",
}

export enum ExportType {
  pdf = "pdf",
  xlsx = "xlsx",
  csv = "csv",
}

export enum UserRoles {
  ADMIN = "Admin",
  USER = "User",
  PLACE_ADMIN = "Place Admin",
  COURIER = "Rider",
}

export enum ShipmentStatus {
  OUT_FOR_DELIVERY = "out_for_delivery",
  FAILED_DELIVERY_ATTEMPT = "failed_delivery_attempt",
  DELIVERED = "delivered",
  RIDER_REASSIGNED = "rider_reassigned",
  PICKUP_CONFIRMED = "pickup_confirmed",
  PENDING = "pending",
  RIDER_ASSIGNED = "rider_assigned",
  PAYMENT_RECEIVED = "payment_received",
  RETURNED = "returned",
  ON_HOLD = "on_hold",
  REPACKAGED = "repackaged",
  IN_TRANSIT = "in_transit",
  ARRIVED = "arrived",
  READY_FOR_PICKUP = "ready_for_pickup",
  REFUNDED = "refunded",
}

export enum ShipmentOptions {
  STANDARD = "standard_delivery",
  EXPRESS = "express_delivery",
  SPECIAL = "special_delivery",
  BULK = "bulk_delivery",
}

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export enum WalletTransactionTypes {
  PAYMENT_RECEIVED = "payment_received",
  WITHDRAWAL = "withdrawal",
  DEBIT = "debit",
  ADJUSTMENT = "adjustment",
  PAYOUT_PENDING = "payout_pending",
  PAYOUT_REJECTED = "payout_rejected",
  PAYOUT_FAILED = "payout_failed",
  PAYOUT_APPROVED = "payout_approved",
}

export enum PayoutRequestStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  APPROVED = "approved",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  FAILED = "failed",
}
