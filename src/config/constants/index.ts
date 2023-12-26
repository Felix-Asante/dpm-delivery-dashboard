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

export const enum UserRoles {
	ADMIN = "Admin",
	USER = "User",
	PLACE_ADMIN = "Place Admin",
	COURIER = "Rider",
}
