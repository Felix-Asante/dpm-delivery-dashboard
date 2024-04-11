"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { CreateVariableDto } from "@/rules/validations";
import { SeverActionResponse, Variables } from "@/types";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

export async function getVariables(): Promise<
	SeverActionResponse<Variables[]>
> {
	try {
		const endpoint = apiConfig.variables.root();
		const variables = await apiHandler<Variables[]>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.variables] },
		});
		return { results: variables };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function createVariables(data: CreateVariableDto) {
	try {
		const endpoint = apiConfig.variables.root();
		await apiHandler<Variables[]>({
			endpoint,
			method: "POST",
			body: data,
		});
		revalidateTag(Tags.variables);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
export async function updateVariables(id: string, data: CreateVariableDto) {
	try {
		const endpoint = apiConfig.variables.get(id);
		await apiHandler<Variables[]>({
			endpoint,
			method: "PATCH",
			body: data,
		});
		revalidateTag(Tags.variables);
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
