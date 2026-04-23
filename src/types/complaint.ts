export enum ComplaintCategory {
  DELAY = "delay",
  DAMAGED_ITEM = "damaged_item",
  RIDER_CONTACT = "rider_contact",
  INCORRECT_STATUS_UPDATE = "incorrect_status_update",
  MISSING_ITEM = "missing_item",
  SAFETY_TRAFFIC_VIOLATIONS = "safety_traffic_violations",
  REFUND_REQUEST = "refund_request",
  INCORRECT_ADDRESS = "incorrect_address",
  ITEM_SWAP = "item_swap",
}

export const COMPLAINT_CATEGORY_LABEL: Record<ComplaintCategory, string> = {
  [ComplaintCategory.DELAY]: "Delay",
  [ComplaintCategory.DAMAGED_ITEM]: "Damaged item",
  [ComplaintCategory.RIDER_CONTACT]: "Rider contact",
  [ComplaintCategory.INCORRECT_STATUS_UPDATE]: "Incorrect status update",
  [ComplaintCategory.MISSING_ITEM]: "Missing item",
  [ComplaintCategory.SAFETY_TRAFFIC_VIOLATIONS]: "Safety / traffic violations",
  [ComplaintCategory.REFUND_REQUEST]: "Refund request",
  [ComplaintCategory.INCORRECT_ADDRESS]: "Incorrect address",
  [ComplaintCategory.ITEM_SWAP]: "Item swap",
};

export interface ComplaintOrderSummary {
  id: string;
  reference: string;
  status?: string;
  pickupCity?: string;
  dropOffArea?: string;
  dropOffCity?: string;
}

export interface Complaint {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phone: string;
  trackingNumber: string;
  category: ComplaintCategory;
  issue: string;
  picture: string | null;
  order: ComplaintOrderSummary;
}
