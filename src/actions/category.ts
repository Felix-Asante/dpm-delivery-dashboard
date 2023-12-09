import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { Category } from "@/types/category";
import { getErrorMessage } from "@/utils/helpers";

export async function getCategory(): Promise<Category[]> {
	try {
		const endpoint = apiConfig.categories.list();
		const categories = await apiHandler<Category[]>({
			endpoint,
			method: "GET",
		});
		return categories;
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
