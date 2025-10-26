import React from "react";
import { getWalletTransactions } from "@/actions/wallet";
import WithServerError from "@/components/hoc/WithServerError";
import TransactionList from "./_sections/TransactionList";
import { getUserWallet } from "@/actions/users";

interface Props {
  searchParams: Promise<{ type?: string; page?: string }>;
}
export default async function RiderTransactionPage({ searchParams }: Props) {
  const params = await searchParams;
  const [transactionsResponse, walletResponse] = await Promise.all([
    getWalletTransactions(params),
    getUserWallet(),
  ]);

  const error = transactionsResponse?.error || walletResponse?.error;
  return (
    <WithServerError error={error}>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1">
            View and manage all your transaction history
          </p>
        </div>
        <TransactionList
          transactionResponse={transactionsResponse?.results}
          wallet={walletResponse?.results}
        />
      </div>
    </WithServerError>
  );
}
