"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { Place } from "@/types/place";
import { getErrorMessage } from "@/utils/helpers";

export async function getPlaces(): Promise<Place[]> {
	try {
		const endpoint = apiConfig.places.list();
		const places = await apiHandler<Place[]>({ endpoint, method: "GET" });
		return places;
	} catch (error) {
		console.log(error);
		throw new Error(getErrorMessage(error));
	}
}
