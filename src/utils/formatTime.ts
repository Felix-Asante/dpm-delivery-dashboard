import { Periods } from "@/config/constants";

export function getDateRange(rangeType: Periods) {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentMonth = currentDate.getMonth();

	let fromDate, toDate;

	switch (rangeType) {
		case "last3Months":
			fromDate = new Date(currentYear, currentMonth - 3, 1, 0, 0, 0, 0);
			toDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
			break;
		case "last6Months":
			fromDate = new Date(currentYear, currentMonth - 6, 1, 0, 0, 0, 0);
			toDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
			break;
		case "lastYear":
			fromDate = new Date(currentYear - 1, 0, 1, 0, 0, 0, 0);
			toDate = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);
			break;
		case "2YearsAgo":
			fromDate = new Date(currentYear - 2, 0, 1, 0, 0, 0, 0);
			toDate = new Date(currentYear - 2, 11, 31, 23, 59, 59, 999);
			break;
		case "currentMonth":
			fromDate = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
			toDate = new Date(
				currentYear,
				currentMonth,
				currentDate.getDate(),
				23,
				59,
				59,
				999,
			);
			break;
		case "currentYear":
			fromDate = new Date(currentYear, 0, 1, 0, 0, 0, 0);
			toDate = new Date(
				currentYear,
				currentMonth,
				currentDate.getDate(),
				23,
				59,
				59,
				999,
			);
			break;
		case "last7Days":
			fromDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
			toDate = new Date(currentDate);
			break;
		default:
			throw new Error("Invalid range type");
	}

	return [fromDate, toDate];
}
