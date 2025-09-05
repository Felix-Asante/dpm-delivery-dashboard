"use client";
import { DEFAULT_CURRENCY } from "@/config/constants";
import { Button } from "@/components/ui/button";
import React from "react";
import { useSession } from "next-auth/react";
import HStack from "@/components/shared/layout/HStack";
import { formatCurrency } from "@/utils/helpers";

export function RidersHomeHeader() {
  const { data } = useSession();

  const totalBalance = data?.user?.wallet ? +data.user.wallet.balance : 0;

  return (
    <section>
      <h4 className="font-semibold text-lg">Balance</h4>
      <p className="text-gray-500 text-sm">Your remaining income</p>
      <h3 className="text-2xl font-bold my-2">
        {DEFAULT_CURRENCY.symbol} {formatCurrency(totalBalance)}
      </h3>
      <HStack>
        <Button className="rounded-full">Request withdraw</Button>
        <Button className="bg-muted hover:bg-muted text-black rounded-full">
          View transactions
        </Button>
      </HStack>
    </section>
  );
}
