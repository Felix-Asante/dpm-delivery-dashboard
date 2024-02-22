"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import {
	CountResponse,
	OpeningHours,
	ResponseMeta,
	SeverActionResponse,
} from "@/types";
import { User } from "@/types/auth";
import { Place, PlaceService } from "@/types/place";
import { Ratings } from "@/types/ratings";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

interface PlacesResponse {
	items: Place[];
	meta: ResponseMeta;
}
interface RatingsResponse {
	items: Ratings[];
	meta: ResponseMeta;
}

export async function getPlaces(
	query: Query,
): Promise<SeverActionResponse<PlacesResponse>> {
	try {
		const endpoint = apiConfig.places.list(query);
		const places = await apiHandler<PlacesResponse>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.places] },
		});
		return { results: places };
	} catch (error) {
		throw { error: getErrorMessage(error) };
	}
}

export async function addNewPlace(body: FormData) {
	try {
		const endpoint = apiConfig.places.create();
		await apiHandler({ endpoint, method: "POST", json: false, body });
		revalidateTag(Tags.places);
	} catch (error) {
		return { error: getErrorMessage(error) };
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
		return { error: getErrorMessage(error) };
	}
}
export async function getPlaceBySlug(
	slug: string,
): Promise<SeverActionResponse<Place>> {
	try {
		const endpoint = apiConfig.places.get_by_slug(slug);
		const place = await apiHandler<Place>({
			endpoint,
			method: "GET",
		});
		return { results: place };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function getPlace(
	id: string,
): Promise<SeverActionResponse<Place>> {
	try {
		const endpoint = apiConfig.places.get_by_id(id);
		const place = await apiHandler<Place>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.place] },
		});
		return { results: place };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function getPlaceAdmin(
	placeId: string,
): Promise<SeverActionResponse<User>> {
	try {
		const endpoint = apiConfig.places.get_admin(placeId);
		const admin = await apiHandler<User>({
			endpoint,
			method: "GET",
		});
		return { results: admin };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}

export async function updatePlace(body: FormData, placeId: string) {
	try {
		const endpoint = apiConfig.places.update(placeId);
		await apiHandler({ endpoint, method: "PUT", json: false, body });
		revalidateTag(Tags.places);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}

export async function getPlacesCount(): Promise<
	SeverActionResponse<CountResponse>
> {
	try {
		const endpoint = apiConfig.places.count();
		const results = await apiHandler<CountResponse>({
			endpoint,
			method: "GET",
		});
		return { results };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}

export async function getPopularPlaces(): Promise<
	SeverActionResponse<Place[]>
> {
	try {
		const endpoint = apiConfig.places.popular();
		const results = await apiHandler<Place[]>({
			endpoint,
			method: "GET",
		});
		return { results };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function getPlaceService(
	placeId: string,
): Promise<SeverActionResponse<PlaceService[]>> {
	try {
		const endpoint = apiConfig.places.products(placeId);
		const results = await apiHandler<PlaceService[]>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.place_service] },
		});
		return { results };
	} catch (error) {
		console.log(error);
		return { error: getErrorMessage(error) };
	}
}
export async function getPlaceRatings(
	placeId: string,
	query: Query,
): Promise<SeverActionResponse<RatingsResponse>> {
	try {
		const endpoint = apiConfig.places.ratings(placeId, query);
		const results = await apiHandler<RatingsResponse>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.reviews] },
		});
		return { results };
	} catch (error) {
		console.log(error);
		return { error: getErrorMessage(error) };
	}
}

export async function addPlaceOpeningHour(placeId: string, body: OpeningHours) {
	try {
		const endpoint = apiConfig.places.opening_hrs(placeId);
		await apiHandler({
			endpoint,
			method: "POST",
			body,
		});
	} catch (error) {
		console.log(error);
		return { error: getErrorMessage(error) };
	} finally {
		revalidateTag(Tags.place);
	}
}
