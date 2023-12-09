import { ERRORS } from "@/config/constants/errors";
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

export function pluralize(text: string, total = 2): string {
	return total > 1 ? `${text}s` : text;
}
