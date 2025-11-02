"use server";
import { apiConfig } from "@/lib/apiConfig";
import { apiHandler } from "@/lib/apiHandler";
import { verifyMobileMoneyAccount } from "@/lib/paystack";
import type { ResponseMeta, SeverActionResponse } from "@/types";
import type { Transaction } from "@/types/wallet";
import type {
  CreatePayoutRequestDto,
  PayoutRequest,
  UpdatePayoutRequestStatusDto,
} from "@/types/payout";
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

export async function createPayoutRequest(
  data: CreatePayoutRequestDto
): Promise<SeverActionResponse<PayoutRequest>> {
  try {
    const endpoint = apiConfig.users.payout_request();
    const result = await apiHandler<PayoutRequest>({
      endpoint,
      method: "POST",
      body: data,
    });
    return { results: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export interface GetPayoutRequestsResponse {
  items: PayoutRequest[];
  meta: ResponseMeta;
}

export async function getPayoutRequests(q: {
  status?: string;
  page?: string;
  search?: string;
}): Promise<SeverActionResponse<GetPayoutRequestsResponse>> {
  try {
    const endpoint = apiConfig.payouts.list({
      ...q,
      status: q.status === "all" ? "" : (q.status as string),
    });
    const result = await apiHandler<GetPayoutRequestsResponse>({
      endpoint,
      method: "GET",
    });
    return { results: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function updatePayoutRequestStatus(
  id: string,
  data: UpdatePayoutRequestStatusDto
): Promise<SeverActionResponse<PayoutRequest>> {
  try {
    const endpoint = apiConfig.payouts.update_status(id);
    const result = await apiHandler<PayoutRequest>({
      endpoint,
      method: "PATCH",
      body: data,
    });
    return { results: result };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function verifyMobileMoneyNumber(
  accountNumber: string,
  provider: string
): Promise<SeverActionResponse<{ accountName: string }>> {
  try {
    const result = await verifyMobileMoneyAccount(accountNumber, provider);

    if (result.success && result.accountName) {
      return { results: { accountName: result.accountName } };
    } else {
      return { error: result.error || "Failed to verify mobile money number" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
