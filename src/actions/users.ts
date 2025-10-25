"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { type UpdateUserFields } from "@/rules/validations/auth";
import { CountResponse, ResponseMeta, SeverActionResponse } from "@/types";
import { User } from "@/types/auth";
import { CreateUserDto } from "@/types/dtos/users";
import { Query } from "@/types/url";
import type { Wallet } from "@/types/wallet";
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
  query: Query
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

export async function getUsersCount(): Promise<
  SeverActionResponse<CountResponse>
> {
  try {
    const endpoint = apiConfig.users.count();
    const results = await apiHandler<CountResponse>({
      endpoint,
      method: "GET",
    });
    return { results };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateUser(userId: string, data: FormData) {
  try {
    const endpoint = apiConfig.users.get(userId);
    await apiHandler({
      endpoint,
      method: "PATCH",
      json: false,
      body: data,
    });
    revalidateTag(Tags.users);
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function getUserWallet(): Promise<SeverActionResponse<Wallet>> {
  try {
    const endpoint = apiConfig.users.wallet();
    const wallet = await apiHandler<Wallet>({
      endpoint,
      method: "GET",
    });
    return { results: wallet };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
