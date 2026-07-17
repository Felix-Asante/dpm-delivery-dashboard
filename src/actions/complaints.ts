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

export interface GetComplaintDetailResponse extends Complaint {}

export type ComplaintsAdminQuery = {
  page?: string;
  limit?: string;
  query?: string;
  category?: string;
  status?: string;
  from?: string;
  to?: string;
};

function buildComplaintsQuery(q: ComplaintsAdminQuery): Query {
  const out: Query = {};
  if (q.page) out.page = q.page;
  if (q.limit) out.limit = q.limit;
  if (q.query) out.query = q.query;
  if (q.category && q.category !== "all") out.category = q.category;
  if (q.status && q.status !== "all") out.status = q.status;
  if (q.from && q.to) {
    out.from = q.from;
    out.to = q.to;
  }
  return out;
}

export async function getComplaintsForAdmin(
  q: ComplaintsAdminQuery,
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

export async function getComplaintDetail(
  id: string,
): Promise<SeverActionResponse<GetComplaintDetailResponse>> {
  try {
    const endpoint = apiConfig.complaints.admin_get(id);
    const result = await apiHandler<GetComplaintDetailResponse>({
      endpoint,
      method: "GET",
    });
    return { results: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updateComplaintStatus(
  id: string,
  data: { status: string; comment?: string },
): Promise<SeverActionResponse<Complaint>> {
  try {
    const endpoint = apiConfig.complaints.update_status(id);
    const result = await apiHandler<Complaint>({
      endpoint,
      method: "PATCH",
      body: data,
    });
    return { results: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
