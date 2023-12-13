import { Session, getServerSession } from "next-auth";
import { apiConfig } from "./apiConfig";
import { authOptions } from "./authentication";

interface ApiHandlerProps {
	endpoint: string;
	method: RequestInit["method"];
	body?: any;
	headers?: RequestInit["headers"];
	cache?: RequestInit["cache"];
	next?: RequestInit["next"];
	json?: boolean;
}

export const apiHandler = async <T>({
	endpoint,
	method,
	body,
	headers,
	cache,
	next,
	json = true,
}: ApiHandlerProps): Promise<T> => {
	const session = await getServerSession<typeof authOptions, Session>(
		authOptions,
	);
	const authorization = `Bearer ${session?.idToken}`;
	const requestBody = json ? JSON.stringify(body) : body;

	const requestHeaders: any = {
		authorization,
		...headers,
	};
	if (json) {
		requestHeaders["Content-Type"] = "application/json";
	}
	const res = await fetch(apiConfig.baseUrl + endpoint, {
		method,
		body: requestBody,
		headers: requestHeaders,
		cache,
		next,
	});
	const data = res?.json ? await res.json() : res;

	if (!res.ok) {
		throw data as Error;
	}
	return data as T;
};
