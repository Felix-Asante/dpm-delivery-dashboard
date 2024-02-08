"use server";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { CreateProductCategoryDto } from "@/rules/validations/category";
import { CountResponse, SeverActionResponse } from "@/types";
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

export async function getCategoryCount(): Promise<
	SeverActionResponse<CountResponse>
> {
	try {
		const endpoint = apiConfig.categories.count();
		const results = await apiHandler<CountResponse>({
			endpoint,
			method: "GET",
		});
		return { results };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
interface CreateProductCategory {
	name: string;
	place: string;
}
export async function createProductCategory(body: CreateProductCategory) {
	try {
		const endpoint = apiConfig.productCategory.root();
		await apiHandler<CountResponse>({
			endpoint,
			method: "POST",
			body,
		});
		revalidateTag(Tags.place);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function updateProductCategory(
	body: CreateProductCategoryDto,
	categoryId: string,
) {
	try {
		const endpoint = apiConfig.productCategory.get(categoryId);
		await apiHandler<CountResponse>({
			endpoint,
			method: "PUT",
			body,
		});
		revalidateTag(Tags.place);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function deleteProductCategory(categoryId: string) {
	try {
		const endpoint = apiConfig.productCategory.get(categoryId);
		await apiHandler<CountResponse>({
			endpoint,
			method: "DELETE",
		});
		revalidateTag(Tags.place);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
