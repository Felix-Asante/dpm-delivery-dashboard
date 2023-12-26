"use server";

import { DASHBOARD_PATHS } from "@/config/routes";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { ResponseMeta } from "@/types";
import { User } from "@/types/auth";
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
export async function getPlaceBySlug(slug: string): Promise<Place> {
	try {
		const endpoint = apiConfig.places.get_by_slug(slug);
		const place = await apiHandler<Place>({
			endpoint,
			method: "GET",
		});
		return place;
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function getPlaceAdmin(placeId: string): Promise<User> {
	try {
		const endpoint = apiConfig.places.get_admin(placeId);
		const admin = await apiHandler<User>({
			endpoint,
			method: "GET",
		});
		return admin;
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}

export async function updatePlace(body: FormData, placeId: string) {
	try {
		const endpoint = apiConfig.places.update(placeId);
		await apiHandler({ endpoint, method: "PUT", json: false, body });
		revalidateTag(Tags.places);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
