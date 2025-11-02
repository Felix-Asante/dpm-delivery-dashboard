"use client";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { Button, buttonVariants } from "@/components/ui/button";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import HStack from "@/components/shared/layout/HStack";
import { formatCurrency } from "@/utils/helpers";
import { Wallet } from "@/types/wallet";
import Link from "next/link";
import { RequestWithdrawModal } from "./RequestWithdrawModal";

export function RidersHomeHeader({ wallet }: { wallet?: Wallet }) {
  const totalBalance = wallet ? +wallet.balance : 0;
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  return (
    <section>
      <h4 className="font-semibold text-lg">Balance</h4>
      <p className="text-gray-500 text-sm">Your remaining income</p>
      <h3 className="text-2xl font-bold my-2">
        {DEFAULT_CURRENCY.symbol} {formatCurrency(totalBalance)}
      </h3>
      <HStack>
        <Button
          className="rounded-full"
          onClick={() => setIsWithdrawModalOpen(true)}
        >
          Request withdraw
        </Button>
        <Link
          href="/transactions"
          className={buttonVariants({
            className: "!bg-muted !hover:bg-muted !text-black !rounded-full",
          })}
        >
          View transactions
        </Link>
      </HStack>

      <RequestWithdrawModal
        open={isWithdrawModalOpen}
        onOpenChange={setIsWithdrawModalOpen}
        balance={totalBalance}
      />
    </section>
  );
}
