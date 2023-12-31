"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { ResponseMeta, SeverActionResponse } from "@/types";
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
