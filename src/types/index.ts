export interface ResponseMeta {
	totalItems: number;
	itemCount: number;
	itemsPerPage: number;
	totalPages: number;
	currentPage: number;
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
