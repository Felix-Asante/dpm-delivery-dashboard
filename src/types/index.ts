import { ShipmentStatus } from "./../config/constants/index";
export interface ResponseMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
export interface CountResponse {
  currentMonth: number;
  all_time: number;
}
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "edit" | "create";
}

export interface SeverActionResponse<R> {
  error?: string;
  results?: R;
}

export type Status =
  | "pending"
  | "confirmed"
  | "rejected"
  | "delivered"
  | "cancelled"
  | "out_for_delivery"
  | "failed_delivery_attempt"
  | "rider_reassigned"
  | "pickup_confirmed"
  | "rider_assigned";

export type OpeningHoursRange = {
  from: string;
  to: string;
};

export type OpeningHour = {
  closed?: boolean;
  openAllDay?: boolean;
  ranges?: OpeningHoursRange[];
};

export type OpeningHours = {
  exceptions: string[];
  monday: OpeningHour;
  tuesday: OpeningHour;
  wednesday: OpeningHour;
  thursday: OpeningHour;
  friday: OpeningHour;
  saturday: OpeningHour;
  sunday: OpeningHour;
};

export type Variables = {
  id: string;
  createdAt: string;
  updatedAt: string;
  label: string;
  value: string;
};
