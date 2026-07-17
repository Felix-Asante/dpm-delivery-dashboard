import React from "react";
import { getPayoutRequests } from "@/actions/wallet";
import WithServerError from "@/components/hoc/WithServerError";
import PayoutRequestsTable from "./_sections/PayoutRequestsTable";

interface Props {
  searchParams: Promise<{ status?: string; page?: string; search?: string }>;
}

export default async function PayoutRequestsPage({
  searchParams,
}: Readonly<Props>) {
  const params = await searchParams;
  const payoutResponse = await getPayoutRequests(params);

  return (
    <WithServerError error={payoutResponse?.error}>
      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6">
          <p className="text-sm font-medium text-primary">Finance operations</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-secondary sm:text-3xl">
            Payout requests
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review rider withdrawal requests and record payment outcomes.
          </p>
        </header>
        <PayoutRequestsTable payoutResponse={payoutResponse?.results} />
      </main>
    </WithServerError>
  );
}
