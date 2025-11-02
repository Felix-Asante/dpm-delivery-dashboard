import React from "react";
import { getPayoutRequests } from "@/actions/wallet";
import WithServerError from "@/components/hoc/WithServerError";
import PayoutRequestsTable from "./_sections/PayoutRequestsTable";

interface Props {
  searchParams: Promise<{ status?: string; page?: string; search?: string }>;
}

export default async function PayoutRequestsPage({ searchParams }: Props) {
  const params = await searchParams;
  const payoutResponse = await getPayoutRequests(params);

  return (
    <WithServerError error={payoutResponse?.error}>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payout Requests</h1>
          <p className="text-gray-500 mt-1">
            View and manage all payout requests from riders
          </p>
        </div>
        <PayoutRequestsTable payoutResponse={payoutResponse?.results} />
      </div>
    </WithServerError>
  );
}
