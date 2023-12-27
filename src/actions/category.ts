"use server";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { SeverActionResponse } from "@/types";
import { Category } from "@/types/category";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

export async function getCategory(): Promise<SeverActionResponse<Category[]>> {
	try {
		const endpoint = apiConfig.categories.list();
		const categories = await apiHandler<Category[]>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.categories] },
		});
		return { results: categories };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function createCategory(body: FormData) {
	try {
		const endpoint = apiConfig.categories.create();
		await apiHandler({
			endpoint,
			method: "POST",
			json: false,
			body,
		});
		revalidateTag(Tags.categories);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function updateCategory(categoryId: string, body: FormData) {
	try {
		const endpoint = apiConfig.categories.update(categoryId);
		await apiHandler({
			endpoint,
			method: "PUT",
			json: false,
			body,
		});
		revalidateTag(Tags.categories);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function deleteCategory(categoryId: string) {
	try {
		const endpoint = apiConfig.categories.delete(categoryId);
		await apiHandler({
			endpoint,
			method: "DELETE",
		});
		revalidateTag(Tags.categories);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
