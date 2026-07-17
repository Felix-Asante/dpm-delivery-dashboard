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

export enum ComplaintStatus {
  OPEN = "OPEN",
  IN_REVIEW = "IN_REVIEW",
  ASSIGNED = "ASSIGNED",
  AWAITING_CUSTOMER_RESPONSE = "AWAITING_CUSTOMER_RESPONSE",
  INVESTIGATING = "INVESTIGATING",
  PENDING_REFUND = "PENDING_REFUND",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  INVALID_SPAM = "INVALID_SPAM",
}

export const COMPLAINT_STATUS_LABEL: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: "New",
  [ComplaintStatus.IN_REVIEW]: "In review",
  [ComplaintStatus.ASSIGNED]: "Assigned",
  [ComplaintStatus.AWAITING_CUSTOMER_RESPONSE]: "Awaiting response",
  [ComplaintStatus.INVESTIGATING]: "Investigating",
  [ComplaintStatus.PENDING_REFUND]: "Pending refund",
  [ComplaintStatus.RESOLVED]: "Resolved",
  [ComplaintStatus.CLOSED]: "Closed",
  [ComplaintStatus.INVALID_SPAM]: "Invalid / Spam",
};

export const COMPLAINT_STATUS_VARIANTS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.OPEN]: "bg-amber-50 text-amber-700 border-amber-200",
  [ComplaintStatus.IN_REVIEW]: "bg-blue-50 text-blue-700 border-blue-200",
  [ComplaintStatus.ASSIGNED]: "bg-blue-50 text-blue-700 border-blue-200",
  [ComplaintStatus.AWAITING_CUSTOMER_RESPONSE]:
    "bg-amber-50 text-amber-700 border-amber-200",
  [ComplaintStatus.INVESTIGATING]: "bg-blue-50 text-blue-700 border-blue-200",
  [ComplaintStatus.PENDING_REFUND]:
    "bg-orange-50 text-orange-700 border-orange-200",
  [ComplaintStatus.RESOLVED]:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  [ComplaintStatus.CLOSED]: "bg-gray-50 text-gray-700 border-gray-200",
  [ComplaintStatus.INVALID_SPAM]: "bg-red-50 text-red-700 border-red-200",
};

export const COMPLAINT_STATUS_OPTIONS = [
  {
    value: ComplaintStatus.OPEN,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.OPEN],
  },
  {
    value: ComplaintStatus.IN_REVIEW,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.IN_REVIEW],
  },
  {
    value: ComplaintStatus.ASSIGNED,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.ASSIGNED],
  },
  {
    value: ComplaintStatus.AWAITING_CUSTOMER_RESPONSE,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.AWAITING_CUSTOMER_RESPONSE],
  },
  {
    value: ComplaintStatus.INVESTIGATING,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.INVESTIGATING],
  },
  {
    value: ComplaintStatus.PENDING_REFUND,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.PENDING_REFUND],
  },
  {
    value: ComplaintStatus.RESOLVED,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.RESOLVED],
  },
  {
    value: ComplaintStatus.CLOSED,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.CLOSED],
  },
  {
    value: ComplaintStatus.INVALID_SPAM,
    label: COMPLAINT_STATUS_LABEL[ComplaintStatus.INVALID_SPAM],
  },
];

export const COMPLAINT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...COMPLAINT_STATUS_OPTIONS,
];

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

export interface ComplaintStatusHistory {
  id: string;
  createdAt: string;
  oldStatus: ComplaintStatus;
  newStatus: ComplaintStatus;
  comment?: string;
  updatedBy?: {
    id: string;
    fullName: string;
  };
}

export interface Complaint {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phone: string;
  trackingNumber: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  issue: string;
  picture: string | null;
  order: ComplaintOrderSummary;
  statusHistory?: ComplaintStatusHistory[];
}
