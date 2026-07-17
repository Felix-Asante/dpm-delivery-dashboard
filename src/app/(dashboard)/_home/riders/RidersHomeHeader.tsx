"use client";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import React, { useState } from "react";
import { formatCurrency } from "@/utils/helpers";
import { Wallet } from "@/types/wallet";
import Link from "next/link";
import { RequestWithdrawModal } from "./RequestWithdrawModal";

export function RidersHomeHeader({
  wallet,
}: Readonly<{ wallet?: Wallet }>) {
  const totalBalance = wallet ? +wallet.balance : 0;
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  return (
    <section className="flex flex-col justify-between gap-5 rounded-xl border bg-white p-5 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-medium text-gray-500">Available balance</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-secondary">
          {DEFAULT_CURRENCY.symbol} {formatCurrency(totalBalance)}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Earnings available for withdrawal
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setIsWithdrawModalOpen(true)}>
          Request withdrawal
        </Button>
        <Link
          href="/transactions"
          className={buttonVariants({ variant: "outline" })}
        >
          View transactions
        </Link>
      </div>

      <RequestWithdrawModal
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        balance={totalBalance}
      />
    </section>
  );
}
