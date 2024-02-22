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
	| "cancelled";

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
