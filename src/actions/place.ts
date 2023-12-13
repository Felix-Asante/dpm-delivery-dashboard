"use server";

import { DASHBOARD_PATHS } from "@/config/routes";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { ResponseMeta } from "@/types";
import { CreatePlaceDto } from "@/types/dtos/places";
import { Place } from "@/types/place";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

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
			next: { tags: [Tags.places] },
		});
		return places;
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}

export async function addNewPlace(body: FormData) {
	try {
		const endpoint = apiConfig.places.create();
		await apiHandler({ endpoint, method: "POST", json: false, body });
		revalidateTag(Tags.places);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function deletePlace(placeId: string) {
	try {
		const endpoint = apiConfig.places.delete(placeId);
		await apiHandler({
			endpoint,
			method: "DELETE",
		});
		revalidateTag(Tags.places);
	} catch (error) {
		console.log(error);
		throw new Error(getErrorMessage(error));
	}
}
