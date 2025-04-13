"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { ResponseMeta, SeverActionResponse } from "@/types";
import { Rider } from "@/types/auth";
import { Query } from "@/types/url";
import { getErrorMessage } from "@/utils/helpers";
import { Tags } from "@/utils/tags";

export interface GetRidersResponse {
  meta: ResponseMeta;
  items: Rider[];
}

export async function getRiders(
  query: Query
): Promise<SeverActionResponse<GetRidersResponse>> {
  try {
    const endpoint = apiConfig.riders.list(query);
    const riders = await apiHandler<GetRidersResponse>({
      endpoint,
      method: "GET",
      next: { tags: [Tags.users] },
    });
    return { results: riders };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function createRider(data: FormData) {
  try {
    const endpoint = apiConfig.riders.root();
    await apiHandler({
      endpoint,
      method: "POST",
      json: false,
      body: data,
    });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
