"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { ResponseMeta, SeverActionResponse } from "@/types";
import { User } from "@/types/auth";
import { CreateUserDto } from "@/types/dtos/users";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";
import { revalidateTag } from "next/cache";

export interface GetUsersResponse {
	meta: ResponseMeta;
	items: User[];
}
export async function createUser(body: CreateUserDto) {
	try {
		const endpoint = apiConfig.auth.signup();
		await apiHandler({ endpoint, method: "POST", body });
		revalidateTag(Tags.users);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function deleteUser(userId: string) {
	try {
		const endpoint = apiConfig.users.delete(userId);
		await apiHandler({ endpoint, method: "DELETE" });
		revalidateTag(Tags.users);
	} catch (error) {
		throw new Error(getErrorMessage(error));
	}
}
export async function getUsers(
	query: Query,
): Promise<SeverActionResponse<GetUsersResponse>> {
	try {
		const endpoint = apiConfig.users.list(query);
		const users = await apiHandler<GetUsersResponse>({
			endpoint,
			method: "GET",
			next: { tags: [Tags.users] },
		});
		return { results: users };
	} catch (error) {
		return { error: getErrorMessage(error) };
	}
}
