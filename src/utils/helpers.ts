import { BookingStatus } from "@/config/constants";
import { ERRORS } from "@/config/constants/errors";
import regexPattern from "@/rules";
import { Status } from "@/types";
import { Query, paths } from "@/types/url";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function parsePathname(pathname: string): paths[] {
	// Remove leading slash if present
	if (pathname.startsWith("/")) {
		pathname = pathname.slice(1);
	}

	// Split the pathname into parts based on slashes
	const parts = pathname.split("/");

	// Initialize an empty array to store the result
	const result: paths[] = [];

	// Iterate through the parts and build the result array
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		if (part) {
			const href = "/" + parts.slice(0, i + 1).join("/");
			const current = i === parts.length - 1;
			result.push({
				name: part,
				href,
				current,
			});
		}
	}

	return result.length ? result : [{ name: "Home", href: "/", current: true }];
}

export function toQuery(queryObj: Query) {
	if (!queryObj || !Object.keys(queryObj).length) return "";
	const queries: string[] = [];
	Object.keys(queryObj).forEach((key) => {
		if (queryObj[key]) {
			queries.push(`${key}=${queryObj[key]}`);
		}
	});
	return queries.length ? `?${queries.join("&")}` : "";
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getErrorMessage(error: any) {
	if (!error?.response && !error?.message) {
		return ERRORS.MESSAGE.NETWORK;
	}
	const { statusCode, data, message = "" } = error;
	if (statusCode === 403) {
		// logout
		console.log("logout");
	}

	return data?.message || message;
}

export function isValidUrl(url: string): boolean {
	if (!regexPattern.URL.test(url)) return false;
	return true;
}
export function pluralize(text: string, total = 2): string {
	return total > 1 ? `${text}s` : text;
}

type AnyObject = { [key: string]: any };

export function removeFromObject(obj: AnyObject, keys: string[]) {
	keys.forEach((key) => {
		delete obj[key];
	});

	return obj;
}

export function removeEmptyFields(obj: AnyObject): AnyObject {
	const cleanedObj: AnyObject = {};

	for (const key in obj) {
		if (
			obj.hasOwnProperty(key) &&
			obj[key] !== null &&
			obj[key] !== undefined &&
			obj[key] !== ""
		) {
			cleanedObj[key] = obj[key];
		}
	}

	return cleanedObj;
}

export function getInitials(name?: string) {
	if (!name) return "";
	const nameParts = name.split("");
	if (nameParts.length === 1) {
		return nameParts[0].charAt(0).toUpperCase();
	} else if (nameParts.length > 1) {
		const [firstName, lastName] = nameParts;
		return `${firstName.charAt(0).toUpperCase()}${lastName
			.charAt(0)
			.toUpperCase()}`;
	}
	return "";
}

export function getStyleByStatus(status: Status) {
	switch (status) {
		case BookingStatus.CANCELLED:
		case BookingStatus.REJECTED:
			return { base: "border border-2 border-red-600", dot: "bg-red-600" };

		case BookingStatus.PENDING:
			return { base: "border border-2 border-warning", dot: "bg-warning" };

		case BookingStatus.CONFIRMED:
			return { base: "border border-2 border-secondary", dot: "bg-secondary" };

		case BookingStatus.DELIVERED:
			return { base: "border border-2 border-success", dot: "bg-success" };

		default:
			return { base: "border border-2 border-default", dot: "bg-default" };
	}
}

export function generateRandomPassword(length: number) {
	const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
	const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numberChars = "0123456789";
	const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

	const allChars = lowerCaseChars + upperCaseChars + numberChars + specialChars;

	let password = "";

	// Ensure at least one of each character type
	password += lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)];
	password += upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)];
	password += numberChars[Math.floor(Math.random() * numberChars.length)];
	password += specialChars[Math.floor(Math.random() * specialChars.length)];

	// Generate the remaining characters
	for (let i = password.length; i < length; i++) {
		password += allChars[Math.floor(Math.random() * allChars.length)];
	}

	// Shuffle the password to randomize the order
	password = password
		.split("")
		.sort(() => Math.random() - 0.5)
		.join("");

	return password;
}
