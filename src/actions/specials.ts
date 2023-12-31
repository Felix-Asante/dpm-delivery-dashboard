"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { CountResponse, ResponseMeta, SeverActionResponse } from "@/types";
import { CreateOfferDto } from "@/types/dtos/offers";
import { Special } from "@/types/specials";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

export interface GetOffersResponse {
	meta: ResponseMeta;
	items: Special[];
}
export async function getOffers(
	query: Query,
): Promise<SeverActionResponse<GetOffersResponse>> {
	try {
		const endpoint = apiConfig.special_offers.list(query);
		const offers = await apiHandler<GetOffersResponse>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.offers] },
		});
		return { results: offers };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function createOffer(body: CreateOfferDto) {
	try {
		const endpoint = apiConfig.special_offers.create();
		await apiHandler({ endpoint, method: "POST", body });
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function deleteOffer(offerId: string) {
	try {
		const endpoint = apiConfig.special_offers.delete(offerId);
		await apiHandler<Special[]>({ endpoint, method: "DELETE" });
		revalidateTag(Tags.offers);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function getOffer(offerId: string): Promise<Special> {
	try {
		const endpoint = apiConfig.special_offers.get_and_update(offerId);
		const offer = await apiHandler<Special>({ endpoint, method: "GET" });
		return offer;
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function updateOffer(offerId: string, body: CreateOfferDto) {
	try {
		const endpoint = apiConfig.special_offers.get_and_update(offerId);
		await apiHandler<Special>({ endpoint, method: "PUT", body });
		revalidateTag(Tags.offers);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}

export async function getSpecialsCount(): Promise<
	SeverActionResponse<CountResponse>
> {
	try {
		const endpoint = apiConfig.special_offers.count();
		const results = await apiHandler<CountResponse>({
			endpoint,
			method: "GET",
		});
		return { results };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
