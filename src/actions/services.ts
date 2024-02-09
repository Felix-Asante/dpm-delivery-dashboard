"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

export async function createService(body: FormData) {
	try {
		const endpoint = apiConfig.products.create();
		await apiHandler({ endpoint, method: "POST", body, json: false });
		revalidateTag(Tags.place_service);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function updateService(body: FormData, serviceId: string) {
	try {
		const endpoint = apiConfig.products.get(serviceId);
		await apiHandler({ endpoint, method: "PUT", body, json: false });
		revalidateTag(Tags.place_service);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function deleteService(serviceId: string) {
	try {
		const endpoint = apiConfig.products.get(serviceId);
		await apiHandler({ endpoint, method: "DELETE", json: false });
		revalidateTag(Tags.place_service);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
