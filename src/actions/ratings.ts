"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

export async function deleteRating(ratingId: string) {
	try {
		const endpoint = apiConfig.ratings.get(ratingId);
		await apiHandler({
			endpoint,
			method: "DELETE",
		});
		revalidateTag(Tags.reviews);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
