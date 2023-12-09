"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { ResponseMeta } from "@/types";
import { Place } from "@/types/place";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";

interface PlacesResponse {
	items: Place[];
	meta: ResponseMeta;
}

export async function getPlaces(query: Query): Promise<PlacesResponse> {
	try {
		const endpoint = apiConfig.places.list(query);
		const places = await apiHandler<PlacesResponse>({
			endpoint,
			method: "GET",
		});
		return places;
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
