"use server";

import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import type { ResponseMeta, SeverActionResponse } from "@/types";
import type { Complaint } from "@/types/complaint";
import { getErrorMessage } from "@/utils/helpers";
import { Query } from "@/types/url";
import "server-only";

export interface GetComplaintsForAdminResponse {
  items: Complaint[];
  meta: ResponseMeta;
}

export type ComplaintsAdminQuery = {
  page?: string;
  limit?: string;
  query?: string;
  category?: string;
  from?: string;
  to?: string;
};

function buildComplaintsQuery(q: ComplaintsAdminQuery): Query {
  const out: Query = {};
  if (q.page) out.page = q.page;
  if (q.limit) out.limit = q.limit;
  if (q.query) out.query = q.query;
  if (q.category && q.category !== "all") out.category = q.category;
  if (q.from && q.to) {
    out.from = q.from;
    out.to = q.to;
  }
  return out;
}

export async function getComplaintsForAdmin(
  q: ComplaintsAdminQuery
): Promise<SeverActionResponse<GetComplaintsForAdminResponse>> {
  try {
    const endpoint = apiConfig.complaints.admin_list(buildComplaintsQuery(q));
    const result = await apiHandler<GetComplaintsForAdminResponse>({
      endpoint,
      method: "GET",
    });
    return { results: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
