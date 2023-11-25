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
	isFormData?: boolean;
}

export const apiHandler = async <T>({
	endpoint,
	method,
	body,
	headers,
	cache,
	next,
	isFormData = false,
}: ApiHandlerProps): Promise<T> => {
	const session = await getServerSession<typeof authOptions, Session>(
		authOptions,
	);
	const authorization = `Bearer ${session?.idToken}`;
	const contentType = isFormData ? "multipart/form-data" : "application/json";

	const requestBody = body
		? isFormData
			? body
			: JSON.stringify(body)
		: undefined;

	const res = await fetch(apiConfig.baseUrl + endpoint, {
		method,
		body: requestBody,
		headers: {
			"Content-Type": contentType,
			authorization,
			Accept: contentType,
			...headers,
		},
		cache,
		next,
	});
	const data = res?.json ? await res.json() : res;

	if (!res.ok) {
		throw data as Error;
	}
	return data as T;
};
