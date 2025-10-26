"use server";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import type { ResponseMeta, SeverActionResponse } from "@/types";
import type { Transaction } from "@/types/wallet";
import { getErrorMessage } from "@/utils/helpers";
import "server-only";

export interface GetWalletTransactionsResponse {
  meta: ResponseMeta;
  items: Transaction[];
}
export async function getWalletTransactions(q: {
  type?: string;
  page?: string;
}): Promise<SeverActionResponse<GetWalletTransactionsResponse>> {
  try {
    const endpoint = apiConfig.users.transactions(q);
    const wallet = await apiHandler<GetWalletTransactionsResponse>({
      endpoint,
      method: "GET",
    });
    return { results: wallet };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
